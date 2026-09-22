import { describe, expect, it } from "vitest";
import {
  applyCodePolicy,
  HARD_NEVER_ACTIONS,
  matchHardNever,
  screenHaToolCall,
  stubJevGates,
} from "./screenHaToolCall";
import type { HaToolCallState, ToolCallGates } from "./types";

function state(overrides: Partial<HaToolCallState> = {}): HaToolCallState {
  return {
    task: "dim the great room",
    tool: "light.turn_on",
    arguments: { brightness: 42 },
    permission: "Always",
    zone: "great room",
    entityId: "light.great_room",
    ...overrides,
  };
}

function gates(overrides: Partial<ToolCallGates> = {}): ToolCallGates {
  return { ...stubJevGates(state()), ...overrides };
}

describe("screenHaToolCall", () => {
  it("auto-allows Always lighting with stub Jev gates", () => {
    const result = screenHaToolCall(state());
    expect(result.decision).toBe("auto");
    expect(result.judge).toBe("stub");
    expect(result.hardNever).toBeNull();
    expect(result.gates.blast_radius.value).toBe("entity");
  });

  it("asks the human when permission is Ask", () => {
    const result = screenHaToolCall(state({ permission: "Ask" }));
    expect(result.decision).toBe("ask_user");
    expect(result.reasons).toContain("permission is Ask");
  });

  it("blocks when permission is Never", () => {
    const result = screenHaToolCall(
      state({
        permission: "Never",
        tool: "climate.set_temperature",
        entityId: "climate.west_wing",
      }),
    );
    expect(result.decision).toBe("block");
    expect(result.reasons).toContain("permission is Never");
  });

  it.each([
    ["unlock", { tool: "lock.unlock", entityId: "lock.front_door" }],
    ["garage", { tool: "cover.open", entityId: "cover.garage_door" }],
    ["alarm disarm", { tool: "alarm_control_panel.alarm_disarm", entityId: "alarm_control_panel.house" }],
    ["camera stream", { tool: "camera.play_stream", entityId: "camera.driveway" }],
    ["door open", { tool: "cover.open", entityId: "cover.front_door" }],
  ] as const)("blocks hard Never %s even when permission is Always", (action, fields) => {
    const result = screenHaToolCall(state({ permission: "Always", ...fields }));
    expect(HARD_NEVER_ACTIONS).toContain(action);
    expect(matchHardNever(state({ ...fields }))).toBe(action);
    expect(result.decision).toBe("block");
    expect(result.hardNever).toBe(action);
    expect(result.reasons[0]).toBe(`hard Never: ${action}`);
  });
});

describe("applyCodePolicy", () => {
  it("asks when blast_radius is house or external", () => {
    const house = applyCodePolicy("Always", gates({
      blast_radius: {
        kind: "choice",
        name: "blast_radius",
        value: "house",
        confidence: 0.9,
        distribution: { entity: 0, room: 0, house: 0.9, external: 0.1 },
      },
    }));
    expect(house.decision).toBe("ask_user");
    expect(house.reasons).toContain("blast_radius is house");
  });

  it("asks when reversibility, destructive, or confidence trip thresholds", () => {
    expect(
      applyCodePolicy("Always", gates({
        reversibility: {
          kind: "score",
          name: "reversibility",
          value: 1.6,
          confidence: 1,
          distribution: { "1.6": 1 },
        },
      })).decision,
    ).toBe("ask_user");

    expect(
      applyCodePolicy("Always", gates({
        destructive: {
          kind: "noul",
          name: "destructive",
          value: 0.61,
          confidence: 1,
          distribution: { yes: 0.61, no: 0.39 },
        },
      })).decision,
    ).toBe("ask_user");

    expect(
      applyCodePolicy("Always", gates({
        needs_confirm: {
          kind: "noul",
          name: "needs_confirm",
          value: 0.1,
          confidence: 0.4,
          distribution: { yes: 0.1, no: 0.9 },
        },
      })).decision,
    ).toBe("ask_user");
  });
});
