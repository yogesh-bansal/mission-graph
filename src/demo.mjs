import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileMission, renderMissionBrief } from "./core/graph-compiler.mjs";
import { simulateAction } from "./core/policy-engine.mjs";
import { buildPermissionRequest } from "./delegations/permission-request.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const missionPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(projectRoot, "scenarios", "community-sprint-mission.json");
const actionsPath = process.argv[3]
  ? path.resolve(process.cwd(), process.argv[3])
  : path.join(projectRoot, "scenarios", "community-sprint-actions.json");

async function main() {
  const mission = JSON.parse(await fs.readFile(missionPath, "utf8"));
  const actions = JSON.parse(await fs.readFile(actionsPath, "utf8"));

  const graph = compileMission(mission);
  const permissionRequest = buildPermissionRequest(graph);
  const simulations = actions.map((action) => ({
    action,
    result: simulateAction(graph, action)
  }));

  const outputDir = path.join(projectRoot, "output", graph.missionId);
  await fs.mkdir(outputDir, { recursive: true });

  await fs.writeFile(path.join(outputDir, "delegation-graph.json"), JSON.stringify(graph, null, 2));
  await fs.writeFile(
    path.join(outputDir, "permission-request.json"),
    JSON.stringify(permissionRequest, null, 2)
  );
  await fs.writeFile(path.join(outputDir, "mission-brief.md"), renderMissionBrief(graph));
  await fs.writeFile(
    path.join(outputDir, "action-simulations.json"),
    JSON.stringify(simulations, null, 2)
  );

  console.log("Mission Graph demo complete");
  console.log(`Mission ID: ${graph.missionId}`);
  console.log(`Output: ${outputDir}`);
}

main().catch((error) => {
  console.error("Demo failed:", error);
  process.exitCode = 1;
});
