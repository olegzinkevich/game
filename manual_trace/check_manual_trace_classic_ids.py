#!/usr/bin/env python3
"""
Align a judge ballot CSV with the golden-truth atom list (classic tetris).

Reads the golden truth CSV (first column = requirement/atom ID) and a target
CSV (first column = id). Rows in the target whose id is not in the golden truth
are dropped; the result is written next to the target as <name>_edited.csv.
Golden IDs absent from the target are reported as missing.

Pure standard library. Run:  python check_manual_trace_classic_ids.py
"""

import csv
import os
import sys

# ---- EDIT THESE TWO PATHS ---------------------------------------------------
GOLDEN_CSV = r"D:\dev\tetris_games\react_classic_tetris_qwen3_6_27B\compliance_check\manual_trace_with_only_llm_judge_atoms_react_classic_qwen.csv"
TARGET_CSV = r"D:\dev\tetris_games\react_classic_tetris_qwen3_6_27B\compliance_check\claude_opus_4_8.csv"
# -----------------------------------------------------------------------------


def read_rows(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        rows = [r for r in reader if r and any(c.strip() for c in r)]
    if not rows:
        sys.exit(f"ERROR: {path} is empty")
    return rows[0], rows[1:]


def main():
    for path in (GOLDEN_CSV, TARGET_CSV):
        if not os.path.isfile(path):
            sys.exit(f"ERROR: file not found: {path}")

    _, golden_rows = read_rows(GOLDEN_CSV)
    golden_ids = [r[0].strip() for r in golden_rows if r[0].strip()]
    golden_set = set(golden_ids)

    header, rows = read_rows(TARGET_CSV)
    kept, dropped, seen = [], [], set()
    for row in rows:
        rid = row[0].strip()
        if rid in golden_set:
            kept.append(row)
            seen.add(rid)
        else:
            dropped.append(rid)

    base, ext = os.path.splitext(TARGET_CSV)
    out_path = f"{base}_edited{ext}"
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(kept)

    missing = [i for i in golden_ids if i not in seen]

    print(f"golden truth : {os.path.basename(GOLDEN_CSV)}  ({len(golden_set)} ids)")
    print(f"target       : {os.path.basename(TARGET_CSV)}  ({len(rows)} rows)")
    print(f"written      : {os.path.basename(out_path)}  ({len(kept)} rows kept)")

    print(f"\nDropped (not in golden truth) — {len(dropped)}:")
    for rid in dropped:
        print(f"  - {rid}")
    if not dropped:
        print("  (none)")

    print(f"\nMissing (in golden truth, absent from target) — {len(missing)}:")
    for rid in missing:
        print(f"  - {rid}")
    if not missing:
        print("  (none)")


if __name__ == "__main__":
    main()
