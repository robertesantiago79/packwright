import { describe, expect, it } from "vitest";

import packSchema from "../src/core/schema/pack.schema.json" with {
  type: "json",
};
import { defineUnionMembers } from "../src/core/schema/unionMembers.js";
import type {
  Confidence,
  Depth,
  PathRole,
  ResourceType,
  Stage,
} from "../src/core/schema/types.js";

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

const stages = defineUnionMembers<Stage>()(["discovery", "prd"]);
const roles = defineUnionMembers<PathRole>()([
  "orientation",
  "deepening",
  "comparative",
  "synthesis",
]);
const resourceTypes = defineUnionMembers<ResourceType>()([
  "doc",
  "video",
  "visual",
  "example",
]);
const depths = defineUnionMembers<Depth>()(["light", "medium", "deep"]);
const confidences = defineUnionMembers<Confidence>()([
  "high",
  "medium",
  "low",
]);

describe("JSON Schema and TypeScript enum parity", () => {
  it("keeps stage members aligned", () => {
    expect(sorted(packSchema.$defs.intake.properties.stage.enum)).toEqual(
      sorted(stages),
    );
  });

  it("keeps path role members aligned", () => {
    expect(sorted(packSchema.$defs.pathItem.properties.role.enum)).toEqual(
      sorted(roles),
    );
  });

  it("keeps resource type members aligned", () => {
    expect(sorted(packSchema.$defs.resource.properties.type.enum)).toEqual(
      sorted(resourceTypes),
    );
  });

  it("keeps depth members aligned", () => {
    expect(sorted(packSchema.$defs.intake.properties.depth.enum)).toEqual(
      sorted(depths),
    );
  });

  it("keeps confidence members aligned", () => {
    expect(sorted(packSchema.properties.confidence.enum)).toEqual(
      sorted(confidences),
    );
  });
});
