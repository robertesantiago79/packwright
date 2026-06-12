import type { ContextPack, PathRole } from "../schema/types.js";
import { validatePack } from "../schema/validate.js";

const ROLE_HEADINGS: Record<PathRole, string> = {
  orientation: "Orientation",
  deepening: "Deepening",
  comparative: "Comparative",
  synthesis: "Synthesis",
};

function renderList(items: string[]): string {
  return items.length === 0
    ? "_None._"
    : items.map((item) => `- ${item}`).join("\n");
}

export function renderPack(pack: ContextPack): string {
  const validation = validatePack(pack);
  if (!validation.valid) {
    throw new Error(`Cannot render invalid pack:\n${validation.errors.join("\n")}`);
  }

  const resources = new Map(
    pack.resources.map((resource) => [resource.id, resource]),
  );
  const orderedPath = [...pack.path].sort(
    (left, right) => left.position - right.position,
  );
  const pathSections = orderedPath
    .map((item) => {
      const resource = resources.get(item.resourceId);
      if (resource === undefined) {
        throw new Error(`Validated path resource '${item.resourceId}' is missing`);
      }

      return [
        `### ${String(item.position)}. ${ROLE_HEADINGS[item.role]}: ${resource.title}`,
        "",
        `- Type: ${resource.type}`,
        `- Estimated time: ${String(resource.estMinutes)} minutes`,
        `- Source: [${resource.url}](${resource.url})`,
        `- Why it matters: ${resource.rationale}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    `# ${pack.intake.projectName}`,
    "",
    `> ${pack.projectSummary}`,
    "",
    `- Stage: ${pack.intake.stage}`,
    `- Depth: ${pack.intake.depth ?? "medium"}`,
    `- Time budget: ${String(pack.intake.timeBudgetMin ?? 30)} minutes`,
    `- Confidence: ${pack.confidence}`,
    `- Pack ID: ${pack.packId}`,
    `- Created: ${pack.createdAt}`,
    "",
    "## Learning Path",
    "",
    pathSections,
    "",
    "## Extracted Patterns",
    "",
    renderList(pack.extractedPatterns),
    "",
    "## Artifact Guidance",
    "",
    renderList(pack.artifactGuidance),
    "",
    "## Confidence Notes",
    "",
    renderList(pack.confidenceNotes),
    "",
    "## AI Context Block",
    "",
    pack.aiContextBlock,
    "",
  ].join("\n");
}
