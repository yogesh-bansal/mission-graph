import { round, totalBudget, compactLines, formatBullets, makeMissionId, nowIso } from "./utils.mjs";
import {
  artifactHashCaveat,
  dependencyCaveat,
  expiryCaveat,
  fanOutCaveat,
  methodAllowlistCaveat,
  spendLimitCaveat,
  targetAllowlistCaveat
} from "../delegations/caveats.mjs";

function missionDeadline(mission) {
  const start = new Date(mission.requestedAt).getTime();
  return new Date(start + mission.durationHours * 60 * 60 * 1000).toISOString();
}

function compileTaskNode(task, deadline) {
  return {
    id: task.id,
    title: task.title,
    role: task.role,
    description: task.description,
    budgetUsdc: task.budgetUsdc,
    dependsOn: task.dependsOn,
    caveats: [
      spendLimitCaveat(task),
      targetAllowlistCaveat(task),
      methodAllowlistCaveat(task),
      expiryCaveat(deadline),
      dependencyCaveat(task),
      artifactHashCaveat(task)
    ],
    allowSubdelegation: Boolean(task.allowSubdelegation)
  };
}

export function compileMission(mission) {
  const missionId = makeMissionId(mission);
  const deadline = missionDeadline(mission);
  const taskBudget = totalBudget(mission.tasks);

  const root = {
    id: "mission-root",
    title: mission.title,
    role: mission.planner.delegate,
    description: mission.objective,
    budgetUsdc: mission.totalBudgetUsdc,
    caveats: [
      spendLimitCaveat({
        budgetUsdc: mission.totalBudgetUsdc,
        allowedTargets: [],
        allowedMethods: []
      }),
      expiryCaveat(deadline),
      fanOutCaveat(mission.planner.maxFanout)
    ],
    maxSubdelegationDepth: mission.planner.maxSubdelegationDepth
  };

  const taskNodes = mission.tasks.map((task) => compileTaskNode(task, deadline));
  const edges = [];

  for (const task of mission.tasks) {
    edges.push({
      from: "mission-root",
      to: task.id,
      label: "subdelegates"
    });
    for (const dependency of task.dependsOn) {
      edges.push({
        from: dependency,
        to: task.id,
        label: "depends-on"
      });
    }
  }

  const warnings = [];
  if (taskBudget > mission.totalBudgetUsdc) {
    warnings.push("Task budgets exceed the mission-wide budget envelope.");
  }
  if (mission.tasks.length > mission.planner.maxFanout) {
    warnings.push("Task count exceeds planner fan-out caveat.");
  }

  return {
    missionId,
    createdAt: nowIso(),
    mission,
    summary: {
      deadline,
      taskBudgetUsdc: round(taskBudget),
      missionBudgetUsdc: mission.totalBudgetUsdc,
      taskCount: mission.tasks.length
    },
    root,
    nodes: taskNodes,
    edges,
    warnings
  };
}

export function renderMissionBrief(graph) {
  return compactLines([
    `# Mission Brief — ${graph.mission.title}`,
    "",
    `- Mission ID: \`${graph.missionId}\``,
    `- Owner: ${graph.mission.owner}`,
    `- Objective: ${graph.mission.objective}`,
    `- Network: ${graph.mission.network}`,
    `- Deadline: ${graph.summary.deadline}`,
    "",
    "## Why this is safer than flat spending",
    "",
    formatBullets([
      `One planner delegation fans out into ${graph.summary.taskCount} bounded worker delegations`,
      `Total mission budget: ${graph.summary.missionBudgetUsdc} USDC`,
      `Task budget total: ${graph.summary.taskBudgetUsdc} USDC`,
      "Every worker node has target, method, expiry, and dependency caveats"
    ]),
    "",
    "## Tasks",
    "",
    formatBullets(
      graph.nodes.map(
        (node) => `${node.id} (${node.role}) — ${node.budgetUsdc} USDC`
      )
    ),
    "",
    "## Warnings",
    "",
    graph.warnings.length ? formatBullets(graph.warnings) : "- No structural warnings."
  ]);
}
