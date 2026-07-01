#!/usr/bin/env python3
"""
Intra-model consistency (test-retest reliability) for LLM compliance judges.

Each model was run several independent times (files ..._a.csv, ..._b.csv, ...).
Every run is a ballot of  id,status[,confidence]  where
    status in {satisfied, partial, not-satisfied, not-found}.

Treating the repeated runs as bootstrap replicates, this script answers:
"When the same model judges the same code several times, does it give the same
verdict?"  A model that is coherent (not hallucinating / not random) should give
the SAME status for a given requirement atom across its runs.

For every model family it reports, per requirement atom and in aggregate:
  * modal (majority) status and how large that majority is        -> stability
  * Shannon entropy of the status distribution across runs        -> spread
  * whether every run agreed (unanimous)                          -> flip / no-flip
  * Fleiss' kappa across the runs (chance-corrected agreement)
  * average pairwise percent agreement across the runs
  * confidence mean and within-atom confidence spread
  * confidence-vs-stability calibration check

Optionally, if manual_trace.csv (human ground truth) is present, it also reports
each model's accuracy against the human verdict (validity, not just reliability).

Pure standard library.  Run:  python consistency_analysis.py
Outputs land in  ./consistency_analysis/
"""

import csv
import math
import os
import re
import sys
from collections import Counter, defaultdict
from itertools import combinations

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "consistency_analysis")

VALID_STATUS = {"satisfied", "partial", "not-satisfied", "not-found"}
# collapse to a binary lens (satisfied vs. everything else) for a coarser view
BINARY = {"satisfied": "satisfied", "partial": "not-satisfied",
          "not-satisfied": "not-satisfied", "not-found": "not-satisfied"}

# human-checked golden reference used for the validity (accuracy) column.
# Preferred: a folder of per-assessor ballots (manual_ground_truth_a.csv, _b, ...)
# whose majority vote becomes the consensus golden reference.
GROUND_TRUTH_DIR = os.path.join(HERE, "manual_ground_truth")
GROUND_TRUTH_FILE = os.path.join(HERE, "manual_ground_truth.csv")   # legacy single-file fallback
GROUND_TRUTH_LABEL = "manual_ground_truth (humans)"
# files that are not model ballots and must be kept out of the run pool
SKIP_FILES = {"manual_ground_truth.csv", "manual_trace.csv"}

# tie-break order for a consensus vote (lower = more conservative)
STATUS_RANK = {"not-satisfied": 0, "not-found": 0, "partial": 1, "satisfied": 2}


# ---------------------------------------------------------------------------
# loading
# ---------------------------------------------------------------------------
def _open(path):
    """Open a CSV tolerantly: strip BOM, replace any stray non-UTF-8 bytes."""
    return open(path, encoding="utf-8-sig", errors="replace", newline="")


def _has_header(path):
    """True if the first row is a header (contains 'id'/'status'), False if it's data."""
    try:
        with _open(path) as fh:
            first = csv.reader(fh).__next__() or []
    except (StopIteration, OSError):
        return None                      # empty / unreadable
    cells = [c.strip().lower() for c in first]
    if "id" in cells and "status" in cells:
        return True
    # headerless ballot: col0 is an id, col1 is a valid status
    if len(cells) >= 2 and cells[1] in VALID_STATUS:
        return False
    return None                          # not a ballot at all


def is_ballot(path):
    return _has_header(path) is not None


def load_ballot(path):
    """{id: (status, confidence_or_None)}, whether or not the file has a header row."""
    has_header = _has_header(path)
    rows = {}
    with _open(path) as fh:
        if has_header:
            reader = csv.DictReader(fh)
        else:
            reader = csv.DictReader(fh, fieldnames=["id", "status", "confidence"])
        for r in reader:
            rid = (r.get("id") or "").strip()
            st = (r.get("status") or "").strip().lower()
            if not rid or st not in VALID_STATUS:
                continue
            conf = None
            raw = (r.get("confidence") or "").strip()
            if raw:
                try:
                    conf = float(raw)
                except ValueError:
                    conf = None
            rows[rid] = (st, conf)
    return rows


def load_gt_panel():
    """
    {assessor_label: {id: (status, conf)}} for every human ballot in the
    manual_ground_truth/ folder (labels 'a','b','c',...).  Falls back to the
    single legacy manual_ground_truth.csv file if the folder is absent.
    """
    panel = {}
    if os.path.isdir(GROUND_TRUTH_DIR):
        for fn in sorted(os.listdir(GROUND_TRUTH_DIR)):
            if not fn.lower().endswith(".csv"):
                continue
            path = os.path.join(GROUND_TRUTH_DIR, fn)
            if not is_ballot(path):
                continue
            stem = os.path.splitext(fn)[0]
            fam = family_of(stem)
            label = stem[len(fam) + 1:] or "base"
            panel[label] = load_ballot(path)
    elif os.path.exists(GROUND_TRUTH_FILE):
        panel["base"] = load_ballot(GROUND_TRUTH_FILE)
    return panel


def consensus_status(statuses):
    """Majority vote; ties broken toward the more conservative (lower-rank) status."""
    cnt = Counter(statuses)
    top = max(cnt.values())
    winners = sorted((s for s, c in cnt.items() if c == top),
                     key=lambda s: STATUS_RANK.get(s, 0))
    return winners[0]


def gt_consensus(panel):
    """
    Collapse the assessor panel into a single golden reference.
    Returns:
      cons  : {id: consensus_status}
      agree : {id: (n_agreeing_with_consensus, n_assessors_present)}
    """
    labels = list(panel)
    ids = sorted({r for b in panel.values() for r in b})
    cons, agree = {}, {}
    for rid in ids:
        st = [panel[l][rid][0] for l in labels if rid in panel[l]]
        if not st:
            continue
        c = consensus_status(st)
        cons[rid] = c
        agree[rid] = (Counter(st)[c], len(st))
    return cons, agree


def family_of(stem):
    """Strip a trailing single-letter run id: claude_..._a -> claude_...,  mimo_2_5 -> mimo_2_5."""
    m = re.match(r"^(.*)_([a-z])$", stem)
    return m.group(1) if m else stem


def discover_families(folder):
    """{family: {run_label: {id: (status, conf)}}} for every ballot CSV."""
    fams = defaultdict(dict)
    for fn in sorted(os.listdir(folder)):
        if not fn.lower().endswith(".csv") or fn in SKIP_FILES:
            continue
        path = os.path.join(folder, fn)
        if not is_ballot(path):
            continue
        stem = os.path.splitext(fn)[0]
        fam = family_of(stem)
        run = stem[len(fam) + 1:] or "base"      # 'a'..'e' or 'base'
        fams[fam][run] = load_ballot(path)
    return fams


# ---------------------------------------------------------------------------
# statistics
# ---------------------------------------------------------------------------
def entropy(counts):
    """Shannon entropy (bits) of a category count distribution."""
    total = sum(counts)
    if total <= 0:
        return 0.0
    h = 0.0
    for c in counts:
        if c:
            p = c / total
            h -= p * math.log2(p)
    return h


def fleiss_kappa(items_categories):
    """
    Fleiss' kappa.  items_categories: list where each element is a list of the
    category labels assigned to that item by the raters (equal #raters per item).
    Returns kappa or None if undefined.
    """
    items = [ic for ic in items_categories if ic]
    if not items:
        return None
    n = len(items[0])
    if any(len(ic) != n for ic in items) or n < 2:
        return None
    cats = sorted({c for ic in items for c in ic})
    N = len(items)
    # p_j : proportion of all assignments to category j
    total_assign = N * n
    p_j = {c: 0 for c in cats}
    P_i = []
    for ic in items:
        cnt = Counter(ic)
        for c in cats:
            p_j[c] += cnt.get(c, 0)
        s = sum(v * v for v in cnt.values())
        P_i.append((s - n) / (n * (n - 1)))
    for c in cats:
        p_j[c] /= total_assign
    P_bar = sum(P_i) / N
    P_e = sum(v * v for v in p_j.values())
    if P_e >= 1.0:                       # everyone always picked one category -> perfect but undefined kappa
        return 1.0 if P_bar >= 1.0 else None
    return (P_bar - P_e) / (1 - P_e)


def avg_pairwise_agreement(runs, ids):
    """Mean over run pairs of the fraction of ids where the two runs' status match."""
    labels = list(runs)
    pairs = list(combinations(labels, 2))
    if not pairs or not ids:
        return None
    tot = 0.0
    for a, b in pairs:
        match = sum(1 for r in ids if runs[a].get(r) == runs[b].get(r))
        tot += match / len(ids)
    return tot / len(pairs)


def pearson(xs, ys):
    n = len(xs)
    if n < 2:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sx = sum((x - mx) ** 2 for x in xs)
    sy = sum((y - my) ** 2 for y in ys)
    if sx == 0 or sy == 0:
        return None
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    return cov / math.sqrt(sx * sy)


# ---------------------------------------------------------------------------
# per-family analysis
# ---------------------------------------------------------------------------
def analyse_family(fam, runs, ground_truth):
    """runs: {run_label: {id: (status, conf)}}.  Returns (summary_dict, per_atom_rows)."""
    run_status = {rl: {rid: v[0] for rid, v in b.items()} for rl, b in runs.items()}
    run_conf = {rl: {rid: v[1] for rid, v in b.items()} for rl, b in runs.items()}
    labels = list(runs)
    n_runs = len(labels)

    union_ids = sorted({r for b in run_status.values() for r in b})
    common_ids = [r for r in union_ids if all(r in run_status[rl] for rl in labels)]

    per_atom = []
    stabilities, entropies = [], []
    conf_means, conf_stds = [], []
    unanimous = 0
    fleiss_items = []          # only over common ids (equal rater count)

    for rid in union_ids:
        statuses = [run_status[rl][rid] for rl in labels if rid in run_status[rl]]
        present = len(statuses)
        cnt = Counter(statuses)
        modal, modal_n = cnt.most_common(1)[0]
        stability = modal_n / present
        ent = entropy(list(cnt.values()))
        is_unanimous = len(cnt) == 1 and present == n_runs
        if is_unanimous:
            unanimous += 1
        if rid in common_ids:
            fleiss_items.append([run_status[rl][rid] for rl in labels])

        confs = [run_conf[rl][rid] for rl in labels
                 if rid in run_conf[rl] and run_conf[rl][rid] is not None]
        cmean = sum(confs) / len(confs) if confs else None
        cstd = (statistics_pstdev(confs) if len(confs) >= 2 else 0.0) if confs else None

        stabilities.append(stability)
        entropies.append(ent)
        if cmean is not None:
            conf_means.append(cmean)
        if cstd is not None:
            conf_stds.append(cstd)

        binary_statuses = [BINARY[s] for s in statuses]
        binary_flip = len(set(binary_statuses)) > 1

        vote = ", ".join(f"{s}:{c}" for s, c in cnt.most_common())
        gt = ground_truth.get(rid, "")
        per_atom.append({
            "family": fam,
            "id": rid,
            "runs_present": present,
            "modal_status": modal,
            "modal_count": modal_n,
            "stability": round(stability, 3),
            "entropy_bits": round(ent, 3),
            "unanimous": int(is_unanimous),
            "binary_flip": int(binary_flip),
            "vote_distribution": vote,
            "conf_mean": round(cmean, 3) if cmean is not None else "",
            "conf_std": round(cstd, 3) if cstd is not None else "",
            "ground_truth": gt,
            "modal_matches_gt": (int(modal == gt) if gt else ""),
        })

    # calibration: within-atom mean confidence vs. stability (do confident atoms flip less?)
    cal_pairs = [(a["conf_mean"], a["stability"]) for a in per_atom
                 if a["conf_mean"] != ""]
    calibration = pearson([p[0] for p in cal_pairs], [p[1] for p in cal_pairs]) if cal_pairs else None

    kappa = fleiss_kappa(fleiss_items)
    pair_agree = avg_pairwise_agreement(run_status, common_ids)

    # accuracy of the per-atom consensus (modal) against ground truth
    gt_ids = [a for a in per_atom if a["ground_truth"]]
    modal_acc = (sum(a["modal_matches_gt"] for a in gt_ids) / len(gt_ids)) if gt_ids else None

    summary = {
        "family": fam,
        "n_runs": n_runs,
        "run_labels": ",".join(labels),
        "n_atoms_union": len(union_ids),
        "n_atoms_common": len(common_ids),
        "mean_stability": round(sum(stabilities) / len(stabilities), 3) if stabilities else "",
        "pcnt_of_atoms_all_runs_agreed": round(100 * unanimous / len(union_ids), 1) if union_ids else "",
        "n_unstable_atoms": sum(1 for s in stabilities if s < 1.0),
        "mean_entropy_bits": round(sum(entropies) / len(entropies), 3) if entropies else "",
        "avg_pairwise_agreement": round(pair_agree, 3) if pair_agree is not None else "",
        "fleiss_kappa": round(kappa, 3) if kappa is not None else "n/a",
        "kappa_interpretation": interpret_kappa(kappa),
        "mean_confidence": round(sum(conf_means) / len(conf_means), 3) if conf_means else "",
        "mean_within_atom_conf_std": round(sum(conf_stds) / len(conf_stds), 3) if conf_stds else "",
        "conf_stability_corr": round(calibration, 3) if calibration is not None else "",
        "consensus_accuracy_vs_gt": round(modal_acc, 3) if modal_acc is not None else "",
    }
    return summary, per_atom


def statistics_pstdev(xs):
    m = sum(xs) / len(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / len(xs))


def interpret_kappa(k):
    if k is None:
        return "n/a"
    if k < 0:
        return "worse than chance"
    if k < 0.20:
        return "slight"
    if k < 0.40:
        return "fair"
    if k < 0.60:
        return "moderate"
    if k < 0.80:
        return "substantial"
    return "almost perfect"


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------
def write_csv(name, header, rows):
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, name), "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=header, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)


def main():
    families = discover_families(HERE)
    if not families:
        print("No ballot CSVs found.", file=sys.stderr)
        sys.exit(1)

    # ---- human golden reference: consensus of the assessor panel ----
    gt_panel = load_gt_panel()
    ground_truth, gt_agree = gt_consensus(gt_panel)
    n_assessors = len(gt_panel)

    summaries = []
    all_atoms = []
    for fam in sorted(families):
        runs = families[fam]
        summary, per_atom = analyse_family(fam, runs, ground_truth)
        summaries.append(summary)
        all_atoms.extend(per_atom)

    # rank models by reliability (most consistent first)
    def sort_key(s):
        k = s["fleiss_kappa"]
        return k if isinstance(k, float) else -1
    summaries.sort(key=sort_key, reverse=True)

    # the human assessor panel is itself a "rater family": measure its own
    # inter-assessor reliability with the exact same metrics, so it can be read
    # side-by-side with the models (and acts as the accuracy ceiling).
    human_row = None
    if n_assessors >= 2:
        human_row, _ = analyse_family(GROUND_TRUTH_LABEL, gt_panel, {})
        human_row["consensus_accuracy_vs_gt"] = ""   # accuracy-vs-self is meaningless
        summaries.insert(0, human_row)

    # NOTE: hidden columns are still computed (available in the summary dict and
    # used by the console report) but intentionally left out of the written CSV.
    # Un-comment a line here to bring a column back.
    summary_header = ["family", "n_runs",
                      # "run_labels",
                      "n_atoms_union",
                      # "n_atoms_common",
                      "mean_stability", "pcnt_of_atoms_all_runs_agreed",
                      # "n_unstable_atoms",
                      # "mean_entropy_bits",
                      "avg_pairwise_agreement", "fleiss_kappa",
                      # "kappa_interpretation",
                      # "mean_confidence",
                      # "mean_within_atom_conf_std",
                      # "conf_stability_corr",
                      "consensus_accuracy_vs_gt"]
    write_csv("model_consistency_summary.csv", summary_header, summaries)

    atom_header = ["family", "id", "runs_present", "modal_status", "modal_count", "stability",
                   "entropy_bits", "unanimous", "binary_flip", "vote_distribution",
                   "conf_mean", "conf_std", "ground_truth", "modal_matches_gt"]
    write_csv("per_atom_agreement.csv", atom_header, all_atoms)

    # just the atoms that flipped, sorted worst-first, for eyeballing
    unstable = [a for a in all_atoms if a["stability"] < 1.0]
    unstable.sort(key=lambda a: (a["family"], a["stability"], -a["entropy_bits"]))
    write_csv("unstable_atoms.csv", atom_header, unstable)

    # ---- ground-truth panel agreement: where do the human assessors disagree? ----
    n_contested_gt = 0
    if n_assessors >= 2:
        labels = list(gt_panel)
        gt_ids = sorted({r for b in gt_panel.values() for r in b})
        gt_rows = []
        for rid in gt_ids:
            votes = {l: gt_panel[l][rid][0] for l in labels if rid in gt_panel[l]}
            cnt = Counter(votes.values())
            n_agree, n_present = gt_agree.get(rid, (0, 0))
            unanimous = int(len(cnt) == 1 and n_present == n_assessors)
            if not unanimous:
                n_contested_gt += 1
            gt_rows.append({
                "id": rid,
                "consensus": ground_truth.get(rid, ""),
                "n_agree": n_agree,
                "n_assessors": n_present,
                "unanimous": unanimous,
                "assessor_votes": ", ".join(f"{l}={votes.get(l, '-')}" for l in labels),
                "vote_distribution": ", ".join(f"{s}:{c}" for s, c in cnt.most_common()),
            })
        gt_rows.sort(key=lambda a: (a["unanimous"], a["id"]))   # contested first
        write_csv("ground_truth_panel_agreement.csv",
                  ["id", "consensus", "n_agree", "n_assessors", "unanimous",
                   "assessor_votes", "vote_distribution"], gt_rows)

    # ---- console report ----
    if n_assessors >= 2:
        print(f"Golden reference: consensus of {n_assessors} human assessors "
              f"({len(ground_truth)} atoms); {n_contested_gt} atoms contested among assessors.")
        if human_row:
            print(f"Inter-assessor reliability: kappa={fmt(human_row['fleiss_kappa'])} "
                  f"({human_row['kappa_interpretation']}), "
                  f"pairwise agreement={fmt(human_row['avg_pairwise_agreement'])}  "
                  f"<- this is the accuracy ceiling for the models.")
    elif n_assessors == 1:
        print(f"Golden reference: single human file ({len(ground_truth)} atoms).")
    else:
        print("Golden reference: none found.")
    print("\nReliability (repeated-run agreement), most consistent first "
          "(human panel shown for comparison):\n")
    hdr = f"{'rater':30} {'runs':>4} {'stab':>6} {'unan%':>6} {'kappa':>7} {'pairAgr':>8} {'confStd':>8} {'acc_gt':>7}"
    print(hdr)
    print("-" * len(hdr))
    for s in summaries:
        print(f"{s['family']:30} {s['n_runs']:>4} "
              f"{fmt(s['mean_stability']):>6} {fmt(s['pcnt_of_atoms_all_runs_agreed']):>6} "
              f"{fmt(s['fleiss_kappa']):>7} {fmt(s['avg_pairwise_agreement']):>8} "
              f"{fmt(s['mean_within_atom_conf_std']):>8} {fmt(s['consensus_accuracy_vs_gt']):>7}")
    n_files = 4 if n_assessors >= 2 else 3
    print(f"\nWrote {n_files} files to {OUT_DIR}")
    print("  model_consistency_summary.csv       - one row per rater, headline reliability numbers")
    print("  per_atom_agreement.csv              - every requirement x model, vote spread & entropy")
    print("  unstable_atoms.csv                  - only the atoms that flipped across runs")
    if n_assessors >= 2:
        print("  ground_truth_panel_agreement.csv    - human assessor votes, consensus, contested atoms")


def fmt(v):
    return f"{v}" if v != "" else "-"


if __name__ == "__main__":
    main()
