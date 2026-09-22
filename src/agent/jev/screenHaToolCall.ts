import type {
  BlastRadius,
  HardNeverAction,
  HaToolCallState,
  NoulResult,
  Permission,
  PolicyDecision,
  ScoreResult,
  ScreenHaToolCallResult,
  ToolCallGates,
} from "./types";

export type {
  BlastRadius,
  ChoiceResult,
  GateResult,
  HardNeverAction,
  HaToolCallState,
  NoulResult,
  Permission,
  PolicyDecision,
  ScoreResult,
  ScreenHaToolCallResult,
  ToolCallGates,
} from "./types";
export { HARD_NEVER_ACTIONS } from "./types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[.\-_]+/g, " ").trim();
}

function stateHaystack(state: HaToolCallState): string {
  const argBits = Object.entries(state.arguments).flatMap(([key, value]) => [
    key,
    value == null ? "" : String(value),
  ]);
  return [state.tool, state.entityId ?? "", state.zone ?? "", ...argBits]
    .map(normalize)
    .filter(Boolean)
    .join(" ");
}

/** True when the proposed call matches a hard Never action class. */
export function matchHardNever(state: HaToolCallState): HardNeverAction | null {
  const text = stateHaystack(state);
  if (/\bunlock\b/.test(text)) return "unlock";
  if (/\bgarage\b/.test(text)) return "garage";
  if (/\balarm\b/.test(text) && /\bdisarm\b/.test(text)) return "alarm disarm";
  if (/\bcamera\b/.test(text) && /\bstream\b/.test(text)) return "camera stream";
  if (/\bdoor\b/.test(text) && /\bopen\b/.test(text)) return "door open";
  return null;
}

function blastRadiusRequiresAsk(value: BlastRadius): boolean {
  switch (value) {
    case "entity":
    case "room":
      return false;
    case "house":
    case "external":
      return true;
    default: {
      const _exhaustive: never = value;
      throw new Error(`Unhandled blast_radius: ${_exhaustive}`);
    }
  }
}

function minConfidence(gates: ToolCallGates): number {
  return Math.min(
    gates.blast_radius.confidence,
    gates.reversibility.confidence,
    gates.destructive.confidence,
    gates.outside_scope.confidence,
    gates.needs_confirm.confidence,
  );
}

function stubScore(name: string, value: number, confidence = 1): ScoreResult {
  return {
    kind: "score",
    name,
    value,
    confidence,
    distribution: { [String(value)]: 1 },
  };
}

function stubNoul(name: string, value: number, confidence = 1): NoulResult {
  return {
    kind: "noul",
    name,
    value,
    confidence,
    distribution: { yes: value, no: 1 - value },
  };
}

/**
 * Placeholder Jev judgments. TypeSafeClient plugs in here:
 *
 *   const client = new TypeSafeClient({
 *     apiKey: process.env.TYPESAFE_API_KEY,
 *     model: "jev-1.13.0",
 *   });
 *   const blast_radius = await client.choice("blast_radius", [...], state);
 *   const reversibility = await client.score("reversibility", state);
 *   const destructive = await client.noul("destructive", state);
 *
 * Do not call a live API from this stub. House lives if the model dies.
 */
export function stubJevGates(_state: HaToolCallState): ToolCallGates {
  return {
    blast_radius: {
      kind: "choice",
      name: "blast_radius",
      value: "entity",
      confidence: 1,
      distribution: { entity: 1, room: 0, house: 0, external: 0 },
    },
    reversibility: stubScore("reversibility", 0),
    destructive: stubNoul("destructive", 0),
    outside_scope: stubNoul("outside_scope", 0),
    needs_confirm: stubNoul("needs_confirm", 0),
  };
}

/**
 * SoloHomeAI Always / Ask / Never policy from docs/jev-harness.md.
 * Thresholds apply to Jev outputs; Never and hard Never stay in code.
 */
export function applyCodePolicy(
  permission: Permission,
  gates: ToolCallGates,
): { decision: PolicyDecision; reasons: string[] } {
  switch (permission) {
    case "Never":
      return { decision: "block", reasons: ["permission is Never"] };
    case "Ask":
    case "Always":
      break;
    default: {
      const _exhaustive: never = permission;
      throw new Error(`Unhandled permission: ${_exhaustive}`);
    }
  }

  const reasons: string[] = [];
  if (permission === "Ask") {
    reasons.push("permission is Ask");
  }
  if (blastRadiusRequiresAsk(gates.blast_radius.value)) {
    reasons.push(`blast_radius is ${gates.blast_radius.value}`);
  }
  if (gates.reversibility.value > 1.5) {
    reasons.push(`reversibility ${gates.reversibility.value} > 1.5`);
  }
  if (gates.destructive.value > 0.6) {
    reasons.push(`destructive ${gates.destructive.value} > 0.6`);
  }
  if (minConfidence(gates) < 0.5) {
    reasons.push("a gate confidence is below 0.5");
  }

  if (reasons.length > 0) {
    return { decision: "ask_user", reasons };
  }
  return { decision: "auto", reasons: [] };
}

/**
 * Screen a proposed HA tool call. Stub judge only — no live Jev / HA.
 * Hard Never and permission Never always win over Jev.
 */
export function screenHaToolCall(state: HaToolCallState): ScreenHaToolCallResult {
  const hardNever = matchHardNever(state);
  const gates = stubJevGates(state);

  if (hardNever) {
    return {
      decision: "block",
      reasons: [`hard Never: ${hardNever}`],
      gates,
      hardNever,
      judge: "stub",
    };
  }

  const policy = applyCodePolicy(state.permission, gates);
  return {
    ...policy,
    gates,
    hardNever: null,
    judge: "stub",
  };
}
