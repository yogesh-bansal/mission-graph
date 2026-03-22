import crypto from "node:crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeMissionId(mission) {
  const seed = [mission.title, mission.owner, mission.requestedAt, mission.objective].join("|");
  return `mg-${crypto.createHash("sha256").update(seed).digest("hex").slice(0, 10)}`;
}

export function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function totalBudget(tasks) {
  return tasks.reduce((sum, task) => sum + Number(task.budgetUsdc || 0), 0);
}

export function compactLines(lines) {
  return lines.filter(Boolean).join("\n");
}

export function formatBullets(items) {
  return (items || []).map((item) => `- ${item}`).join("\n");
}
