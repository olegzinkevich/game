# Recommended Ollama Models for Cross-Model Compliance Audit

For a **cross-model compliance re-audit**, the single most important design choice is
**family diversity**, not raw benchmark rank. The task isn't code generation — it's
*judgment* ("does this code atom satisfy this EARS/Gherkin requirement?"). Independent
verdicts are only meaningful if the models don't share the same lineage/training biases.
The picks below span Qwen, DeepSeek, OpenAI, Meta, Google, Mistral, Microsoft, and IBM.

**Task profile:** reasoning + strict instruction-following + code comprehension + structured
per-atom output, with modest context needs (the Tetris app is a small JS/Vite codebase, so
32K–128K context is plenty).

## Recommended 10 (all `ollama pull`-able)

| #  | Model (pull tag)                  | Params        | Ctx  | Family          | Why for this audit |
|----|-----------------------------------|---------------|------|-----------------|--------------------|
| 1  | `qwen3:30b`                       | 30B MoE       | 256K | Alibaba         | Best all-round local model — strong reasoning + code + tool use. Primary alternate auditor. |
| 2  | `gpt-oss:20b`                     | 21B/3.6B MoE  | 128K | OpenAI          | Adjustable reasoning (~o3-mini), excellent structured output & instruction-following. Runs on 16GB. Totally different lineage = valuable second opinion. |
| 3  | `deepseek-r1:32b`                 | 32B           | 128K | DeepSeek        | Dedicated chain-of-thought reasoner — good at "step through whether the atom is actually met." |
| 4  | `qwen2.5-coder:32b`              | 32B           | 128K | Alibaba (coder) | Best pure code comprehension (92.7% HumanEval). The "code-specialist lens." |
| 5  | `qwen3-coder:30b`                | 30B/3.3B MoE  | 256K | Alibaba (coder) | Repo-scale code understanding + long context if you feed the whole src tree at once. |
| 6  | `devstral` (Devstral Small 24B)  | 24B           | 128K | Mistral         | Agentic SWE-tuned; Mistral-family code lens, distinct from Qwen. |
| 7  | `gemma4:27b`                      | 27B           | 128K | Google          | Strong reasoning + native tool calling; Google lineage diversity. |
| 8  | `phi-4:14b` (or `phi-4-reasoning`)| 14B          | 16K  | Microsoft       | Punches far above its size on structured logic/reasoning-per-GB. Good budget/reasoning verifier. Note the smaller context. |
| 9  | `llama3.3:70b`                    | 70B           | 128K | Meta            | High-tier instruction-following + reasoning. Use if you have ~40GB VRAM. |
| 10 | `granite3.3:8b`                   | 8B            | 128K | IBM             | IBM's enterprise/compliance-oriented family — fitting for a requirements-compliance context, and the most distinct lineage in the set. |

## Additional alternates (lighter / complementary)

| Model (pull tag)      | Params | Ctx  | Family     | Role |
|-----------------------|--------|------|------------|------|
| `mistral:7b`          | 7B     | 32K  | Mistral    | Lightweight baseline; good instruction-following for budget runs |
| `llama3.1:8b`         | 8B     | 128K | Meta       | Lighter Meta option when llama3.3:70b won't fit |
| `qwen3.5:9b`          | 9B     | 128K | Alibaba    | Latest Qwen iteration; `thinking` mode for improved reasoning at small scale |
| `qwen3.5:27b`         | 27B    | 128K | Alibaba    | Mid-size alternative to qwen3:30b with newer training |

## Tiers

### Tier 1 — Reasoning-Heavy
`qwen3`, `deepseek-r1`, `gemma4`, `gpt-oss`
Best for thorough compliance checking with explicit reasoning chains. These models excel at breaking down requirements and tracing them through code systematically.

### Tier 2 — Code-Specialized
`qwen3-coder`, `qwen2.5-coder`, `devstral`
Best for understanding implementation details against requirements. Built specifically for code analysis and agentic workflows.

### Tier 3 — General Purpose Baselines
`phi-4`, `mistral`, `llama3.1`/`llama3.3`, `granite3.3`, `qwen3.5`
Solid baselines for structured audit reports. Good instruction-following and reliable output formatting.

## Hardware Notes

- **≤16GB VRAM:** lean on `gpt-oss:20b`, `phi-4:14b`, `granite3.3:8b`, plus `deepseek-r1:14b` and `qwen3:14b` as lighter swaps for #1/#3.
- **24GB (e.g. RTX 4090):** the 24–32B tier (`qwen3:30b`, `deepseek-r1:32b`, `qwen2.5-coder:32b`, `qwen3-coder:30b`, `devstral`, `gemma4:27b`) is the sweet spot — best quality-per-run for judgment tasks.
- **48GB+ / frontier curiosity:** consider `gpt-oss:120b`, `glm` (GLM-5.x), or `qwen3-coder-next` for a near-frontier reference auditor, but these are overkill for a small Tetris codebase.

## Methodology

- **Run config matters:** for reasoning models (#1, #2, #3), keep "thinking" enabled but cap the reasoning budget so they don't loop; pin context with `-c` so Ollama doesn't silently shrink it.
- **Identical input per model:** give every model the *same* atom list + source bundle + output schema (per-atom `comply / non-comply / partial` + justification), then diff verdicts. Atoms where models disagree are your highest-value review targets.
- Smaller and larger models *catch different violations* — which is exactly why a diverse panel beats one big model.

## Sources

- [Ollama Library](https://ollama.com/library)
- [Best Ollama Models — Morph (June 2026)](https://www.morphllm.com/best-ollama-models)
- [Best Ollama Models 2026 — LocalAIMaster](https://localaimaster.com/blog/best-ollama-models)
- [Ollama Update June 2026 — PromptQuorum](https://www.promptquorum.com/local-llms/top-open-source-models-ollama)
- [Best Open-Source Coding Models 2026 — Kilo Code](https://kilo.ai/open-source-models)
- [Best Open-Source LLMs 2026 — BentoML](https://www.bentoml.com/blog/navigating-the-world-of-open-source-large-language-models)
- [Using Ollama + Claude Code for Local Security Audits](https://jamesachambers.com/using-ollama-claude-code-for-local-security-audits-no-api-costs)
