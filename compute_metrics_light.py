#!/usr/bin/env python3
"""
Lightweight compliance metrics — ensemble of LLM judge ballots.

Set APP_NAME below. The script:
  1. reads every judge ballot CSV (id,status[,confidence]) in this folder,
  2. reads requirement priority/title from ../requirements_doc/requirements.md,
  3. creates the folder  <APP_NAME>_calculated_metrics  and writes 3 CSVs:
       - metrics.csv                                   (headline numbers)
       - unsatisfied_requirements_by_majority_of_judges.csv
       - unsatisfied_must_requirements.csv
Each CSV has 3 columns: metric_name, metric_data, metric_description.

Pure standard library. Run:  python compute_metrics_light.py
"""

import csv
import os
import re
import sys
from collections import Counter

# ----------------------------------------------------------------------------
APP_NAME = "tetris_react"          # <-- set the name of the app
# ----------------------------------------------------------------------------

HERE = os.path.dirname(os.path.abspath(__file__))
SPEC_PATH = os.path.normpath(os.path.join(HERE, "..", "requirements_doc", "requirements.md"))
OUT_DIR = os.path.join(HERE, f"{APP_NAME}_calculated_metrics")

# requirement status -> compliance score (half credit for partial)
STATUS_SCORE = {"satisfied": 1.0, "partial": 0.5, "not-satisfied": 0.0, "not-found": 0.0}
# tie-break order (lower = more conservative) for the consensus verdict
STATUS_RANK = {"not-satisfied": 0, "not-found": 0, "partial": 1, "satisfied": 2}
# importance weights for weighted_SSR
PRIORITY_WEIGHT = {"must": 3, "should": 2, "could": 1}

SKIP_FILES = {"metrics_result.csv", "ground_truth.csv",
              "metrics.csv", "unsatisfied_requirements_by_majority_of_judges.csv",
              "unsatisfied_must_requirements.csv"}


def parse_spec(path):
    """{id: {priority, title, verify_method}} from the yaml blocks in requirements.md."""
    meta = {}
    if not os.path.exists(path):
        print(f"WARN: spec not found at {path}", file=sys.stderr)
        return meta
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    for block in re.findall(r"```yaml\s*(.*?)```", text, flags=re.DOTALL):
        cur = {}
        for line in block.splitlines():
            m = re.match(r"\s*(id|priority|title|verify_method):\s*(.+?)\s*$", line)
            if m:
                cur[m.group(1)] = m.group(2).strip()
        if "id" in cur:
            meta[cur["id"]] = {
                "priority": cur.get("priority", "unknown").lower(),
                "title": cur.get("title", ""),
                "verify_method": cur.get("verify_method", "unknown"),
            }
    return meta


def load_ballots(folder):
    """{judge_name: {id: status}} for each ballot CSV (must have id + status columns)."""
    ballots = {}
    for fn in sorted(os.listdir(folder)):
        if not fn.lower().endswith(".csv") or fn.lower() in SKIP_FILES:
            continue
        path = os.path.join(folder, fn)
        with open(path, encoding="utf-8-sig", newline="") as fh:
            reader = csv.DictReader(fh)
            header = [h.strip().lower() for h in (reader.fieldnames or [])]
            if "id" not in header or "status" not in header:
                continue
        rows = {}
        with open(path, encoding="utf-8-sig", newline="") as fh:
            for r in csv.DictReader(fh):
                rid = (r.get("id") or "").strip()
                st = (r.get("status") or "").strip().lower()
                if rid and st in STATUS_SCORE:
                    rows[rid] = st
        ballots[os.path.splitext(fn)[0]] = rows
    return ballots


def consensus(statuses):
    """Majority vote; ties broken toward the more conservative (lower) status."""
    cnt = Counter(statuses)
    top = max(cnt.values())
    winners = sorted((s for s, c in cnt.items() if c == top),
                     key=lambda s: STATUS_RANK.get(s, 0))
    return winners[0]


def main():
    meta = parse_spec(SPEC_PATH)
    ballots = load_ballots(HERE)
    if not ballots:
        print("No ballot CSVs found.", file=sys.stderr)
        sys.exit(1)
    judges = list(ballots)

    def prio(r):
        return meta.get(r, {}).get("priority", "unknown")

    def title(r):
        return meta.get(r, {}).get("title", "")

    def vmethod(r):
        return meta.get(r, {}).get("verify_method", "unknown")

    all_ids = sorted({r for b in ballots.values() for r in b})
    # headline scope = code-checkable requirements (atoms absent from spec kept in scope)
    scope = [r for r in all_ids if vmethod(r) in ("llm-judge", "unknown")]

    # per-atom aggregation
    statuses = {r: [ballots[j][r] for j in judges if r in ballots[j]] for r in all_ids}
    cons = {r: consensus(statuses[r]) for r in all_ids}
    score = {r: sum(STATUS_SCORE[s] for s in statuses[r]) / len(statuses[r]) for r in all_ids}

    n = len(scope)
    ssr = sum(score[r] for r in scope) / n
    csr = 1 if all(cons[r] == "satisfied" for r in scope) else 0
    consensus_pass_rate = sum(1 for r in scope if cons[r] == "satisfied") / n
    wnum = sum(PRIORITY_WEIGHT.get(prio(r), 1) * score[r] for r in scope)
    wden = sum(PRIORITY_WEIGHT.get(prio(r), 1) for r in scope)
    weighted_ssr = wnum / wden if wden else float("nan")
    n_violations = sum(1 for r in scope if cons[r] != "satisfied")
    defect_density = n_violations / n
    unsat_must = [r for r in scope if prio(r) == "must" and cons[r] != "satisfied"]
    n_unanimous = sum(1 for r in scope if len(set(statuses[r])) == 1)
    n_contested = n - n_unanimous

    # requirements a strict majority of raters judged worse than 'satisfied'
    majority_unsat = []
    for r in scope:
        sub = sum(1 for s in statuses[r] if s != "satisfied")
        if sub * 2 > len(statuses[r]):
            majority_unsat.append(r)

    # spec coverage
    spec_llm = [rid for rid, m in meta.items() if m.get("verify_method") == "llm-judge"]
    rcr = (sum(1 for r in spec_llm if statuses.get(r)) / len(spec_llm)
           if spec_llm else float("nan"))

    def num(x):
        return round(x, 4) if isinstance(x, float) else x

    # ---- metrics.csv ----
    metric_rows = [
        ("total_seen", len(all_ids),
         "Total number of requirements (with needed human check)."),
        ("checked_requirements", len(scope),
         "How many requirements were checked."),
        ("n_judges", len(judges),
         "Number of models (judges) that tested the code."),
        ("judges", ", ".join(judges),
         "Models (judges) names."),
        ("SSR", num(ssr),
         "Main score: on average, how much of each requirement the app delivered, overall percent of requirements met."),
        ("CSR", csr,
         "A strict pass/fail: it's 1 only if every single requirement is fully met. "
         "One miss makes it zero."),
        ("consensus_pass_rate", num(consensus_pass_rate),
         "The share of requirements the judges agreed are fully done — no half credit, "
         "just done or not."),
        ("weighted_SSR", num(weighted_ssr),
         "Like the main score, but important requirements pull more weight, so missing a "
         "critical one hurts more than missing a minor one."),
        ("failed_requirements", n_violations,
         "The plain count of requirements that aren't fully met."),
        ("unsatisfied_must_count", len(unsat_must),
         "How many of the truly important requirements are missing. These are the blockers."),
        ("majority_unsatisfied_count", len(majority_unsat),
         "Count of the requirements where most judges agreed something's wrong — "
         "the misses we're most sure about."),
        ("all_judges_agreed", n_unanimous,
         "Requirements where all judges said the same thing — we can trust these verdicts."),
        ("all_judges_disagreed", n_contested,
         "Requirements where the judges disagreed — worth a closer look."),
        ("defect_density", num(defect_density),
         "How often the app fails a requirement — the flip side of the score. Lower is better."),
        ("requirement_coverage_rate", num(rcr),
         "Did we actually check the whole spec? This is the share of requirements that got "
         "at least one verdict."),
    ]

    # ---- unsatisfied_requirements_by_majority_of_judges.csv ----
    def vote_str(r):
        c = Counter(statuses[r])
        return (f"satisfied:{c.get('satisfied',0)}, partial:{c.get('partial',0)}, "
                f"not-satisfied:{c.get('not-satisfied',0)}, not-found:{c.get('not-found',0)} "
                f"({len(statuses[r])} judges)")

    majority_rows = [(r, vote_str(r), title(r)) for r in majority_unsat]

    # ---- unsatisfied_must_requirements.csv ----
    must_rows = [(r, cons[r], title(r)) for r in unsat_must]

    os.makedirs(OUT_DIR, exist_ok=True)

    def write_csv(name, rows):
        with open(os.path.join(OUT_DIR, name), "w", newline="", encoding="utf-8-sig") as fh:
            w = csv.writer(fh)
            w.writerow(["metric_name", "metric_data", "metric_description"])
            w.writerows(rows)

    write_csv("metrics.csv", metric_rows)
    write_csv("unsatisfied_requirements_by_majority_of_judges.csv", majority_rows)
    write_csv("unsatisfied_must_requirements.csv", must_rows)

    print(f"App: {APP_NAME}")
    print(f"Judges ({len(judges)}): {', '.join(judges)}")
    print(f"SSR={num(ssr)}  weighted_SSR={num(weighted_ssr)}  CSR={csr}  "
          f"consensus_pass_rate={num(consensus_pass_rate)}")
    print(f"failed={n_violations}  must-blockers={len(unsat_must)}  "
          f"majority-unsatisfied={len(majority_unsat)}  RCR={num(rcr)}")
    print(f"Wrote 3 files to {OUT_DIR}")


if __name__ == "__main__":
    main()
