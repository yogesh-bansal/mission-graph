import express from "express";
import { z } from "zod";
import { compileMission, renderMissionBrief } from "../core/graph-compiler.mjs";
import { simulateAction } from "../core/policy-engine.mjs";
import { buildPermissionRequest } from "../delegations/permission-request.mjs";

const missionSchema = z.object({
  title: z.string(),
  owner: z.string(),
  network: z.string(),
  requestedAt: z.string(),
  objective: z.string(),
  totalBudgetUsdc: z.number().positive(),
  durationHours: z.number().positive(),
  token: z.string(),
  planner: z.object({
    delegate: z.string(),
    maxFanout: z.number().int().positive(),
    maxSubdelegationDepth: z.number().int().nonnegative()
  }),
  roles: z.array(
    z.object({
      id: z.string(),
      label: z.string()
    })
  ),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      role: z.string(),
      budgetUsdc: z.number().nonnegative(),
      dependsOn: z.array(z.string()),
      allowedTargets: z.array(z.string()),
      allowedMethods: z.array(z.string()),
      requiresArtifactHash: z.boolean(),
      allowSubdelegation: z.boolean(),
      description: z.string()
    })
  )
});

const actionSchema = z.object({
  taskId: z.string(),
  role: z.string(),
  target: z.string(),
  method: z.string(),
  amountUsdc: z.number().nonnegative(),
  completedTaskIds: z.array(z.string()).default([]),
  proofHash: z.string().optional(),
  now: z.string().optional()
});

export function createApp() {
  const app = express();
  const missions = new Map();

  app.use(express.json());

  app.get("/healthz", (_req, res) => {
    res.json({ ok: true, service: "mission-graph" });
  });

  app.post("/api/missions", (req, res) => {
    const mission = missionSchema.parse(req.body);
    const graph = compileMission(mission);
    missions.set(graph.missionId, graph);
    res.json({ missionId: graph.missionId, graph });
  });

  app.get("/api/missions/:missionId", (req, res) => {
    const graph = missions.get(req.params.missionId);
    if (!graph) {
      res.status(404).json({ error: "mission not found" });
      return;
    }
    res.json({
      missionId: graph.missionId,
      summary: graph.summary,
      brief: renderMissionBrief(graph)
    });
  });

  app.get("/api/missions/:missionId/graph", (req, res) => {
    const graph = missions.get(req.params.missionId);
    if (!graph) {
      res.status(404).json({ error: "mission not found" });
      return;
    }
    res.json(graph);
  });

  app.get("/api/missions/:missionId/permission-request", (req, res) => {
    const graph = missions.get(req.params.missionId);
    if (!graph) {
      res.status(404).json({ error: "mission not found" });
      return;
    }
    res.json(buildPermissionRequest(graph));
  });

  app.post("/api/missions/:missionId/simulate-action", (req, res) => {
    const graph = missions.get(req.params.missionId);
    if (!graph) {
      res.status(404).json({ error: "mission not found" });
      return;
    }
    const action = actionSchema.parse(req.body);
    res.json(simulateAction(graph, action));
  });

  return app;
}
