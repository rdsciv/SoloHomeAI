# SoloHomeAI × Jev — decision fuel

Jev (TypeSafe System One) is the fast typed decision layer that fuels SoloHomeAI's permissioned agent loop. Local LLM drafts and explains. Jev judges. Code enforces and executes. Humans take Ask / Never cases.

## Roles

| Layer | Owns |
| --- | --- |
| Local LLM (Hermes / Ollama / MLX on Mac) | Plan, natural-language reply, fill tool arguments |
| Jev | Bounded judgments: Choice, Score, Noul — 70–500ms |
| Application code | Permissions table, HA tool execution, hard Never blocks, step limits |
| Human | Confirm Ask; Never is never auto |

## Product mapping

SoloHomeAI Always / Ask / Never is policy in **code**. Jev supplies the fuzzy inputs that policy thresholds on.

### Per proposed HA tool call (gate)

State (sanitized — entity ids + intent, no camera frames / PII dumps):

- `task` — user utterance or agent goal
- `tool` — HA service / domain
- `arguments` — named fields only
- `permission` — Always | Ask | Never from the user's table
- `zone` / `entity_id` — where it acts

Questions (one round trip):

1. **Choice `blast_radius`** — entity | room | house | external
2. **Score `reversibility`** — trivially reversible → irreversible / security-sensitive
3. **Noul `destructive`** — locks, alarms, garage, unlocks, camera access
4. **Noul `outside_scope`** — drifts from the stated task
5. **Noul `needs_confirm`** — calibrated "should a human see this?"

Code policy (sketch):

```
if permission == Never: block
if permission == Ask: ask_user
if blast_radius in {house, external}: ask_user
if reversibility > 1.5: ask_user
if destructive > 0.6: ask_user   # belt + suspenders with hard Never list
if any confidence < 0.5: ask_user
else: auto
```

Hard Never stays in code forever: unlock, garage, alarm disarm, camera stream, door open. Jev never overrides Never.

### Tool / skill selection

- **Choice `tool`** over the filtered catalogue (permissions already applied)
- **Noul `needs_a_tool`** so we can answer with no tool (Choice always picks a winner)

### Model routing (cost / latency)

- **Choice `model_tier`** — local_fast | local_mid | frontier_cloud
- Prefer local; escalate only when Jev says complexity needs it

### Loop supervision (every N steps)

- **Noul `looping`**, **Score `progress`**, **Noul `complete`**
- Hard step limit in code always wins

## Security

- Jev is hosted — never send raw camera, voice audio, or household PII in state
- Pass tool args as named fields, not concatenated prompt text
- Log full probability distributions for every gate decision
- Injection test set: args that argue for their own safety

## Build order

1. Stub `screen_tool_call` + policy unit tests (no live HA)
2. Wire Always/Ask/Never table → filter catalogue before Choice
3. Live Jev key; record calibration set from Ryan's real Ask decisions
4. Loop supervisor + model router
5. Only then connect live HA tools behind the gate

## API

- Model: `jev-1.13.0` (confirm current)
- SDK: `typesafe_sdk` / Vercel AI Gateway / OpenRouter
- Env: `TYPESAFE_API_KEY` or gateway key

House lives if the model dies. Jev is a guest judge on the control path, not the brain of the house.
