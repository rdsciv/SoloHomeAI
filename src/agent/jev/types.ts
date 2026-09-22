/** Always / Ask / Never from the homeowner permissions table. Policy lives in code. */
export type Permission = "Always" | "Ask" | "Never";

export type PolicyDecision = "auto" | "ask_user" | "block";

export type BlastRadius = "entity" | "room" | "house" | "external";

/**
 * Hard Never action classes. These stay in application code forever;
 * Jev never overrides them. See docs/jev-harness.md.
 */
export const HARD_NEVER_ACTIONS = [
  "unlock",
  "garage",
  "alarm disarm",
  "camera stream",
  "door open",
] as const;

export type HardNeverAction = (typeof HARD_NEVER_ACTIONS)[number];

/** Jev Choice — picks one label and returns the full distribution. */
export type ChoiceResult<T extends string = string> = {
  kind: "choice";
  name: string;
  value: T;
  confidence: number;
  distribution: Record<T, number>;
};

/** Jev Score — bounded numeric judgment. */
export type ScoreResult = {
  kind: "score";
  name: string;
  value: number;
  confidence: number;
  distribution: Record<string, number>;
};

/** Jev Noul — calibrated mass in [0, 1]. */
export type NoulResult = {
  kind: "noul";
  name: string;
  value: number;
  confidence: number;
  distribution: Record<string, number>;
};

export type GateResult = ChoiceResult | ScoreResult | NoulResult;

/** Per-HA-tool-call Jev questions from the harness design. */
export type ToolCallGates = {
  blast_radius: ChoiceResult<BlastRadius>;
  reversibility: ScoreResult;
  destructive: NoulResult;
  outside_scope: NoulResult;
  needs_confirm: NoulResult;
};

/**
 * Sanitized gate state — entity ids + intent only.
 * Never send camera frames, voice audio, or household PII.
 */
export type HaToolCallState = {
  task: string;
  tool: string;
  /** Named fields only — not concatenated prompt text. */
  arguments: Record<string, string | number | boolean | null>;
  permission: Permission;
  zone?: string;
  entityId?: string;
};

export type ScreenHaToolCallResult = {
  decision: PolicyDecision;
  reasons: string[];
  gates: ToolCallGates;
  hardNever: HardNeverAction | null;
  /**
   * `stub` until TypeSafeClient is wired. Live Jev should still lose to
   * hard Never / permission Never in code.
   */
  judge: "stub";
};
