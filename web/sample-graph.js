window.sampleGraph = {
  mission: {
    title: "Nairobi Build Sprint",
    objective:
      "Run a 48-hour community build sprint with venue, logistics, creative, and attendee support handled by specialized agents without giving any one agent blanket wallet power."
  },
  summary: {
    missionBudgetUsdc: 1200,
    taskCount: 5
  },
  warnings: [],
  root: {
    caveats: [
      { kind: "spend-limit", reason: "Mission budget capped at 1200 USDC." },
      { kind: "expiry", reason: "Planner authority expires at the mission deadline." },
      { kind: "fan-out", reason: "Planner can create at most 5 child delegations." }
    ]
  },
  novelCaveats: [
    "dependency",
    "artifact-hash",
    "fan-out"
  ],
  nodes: [
    {
      id: "reserve-venue",
      role: "venue-agent",
      budgetUsdc: 400,
      caveats: ["target allowlist", "expiry", "artifact hash"]
    },
    {
      id: "catering",
      role: "logistics-agent",
      budgetUsdc: 250,
      caveats: ["dependency", "target allowlist", "expiry"]
    },
    {
      id: "designer-stipend",
      role: "media-agent",
      budgetUsdc: 150,
      caveats: ["artifact hash", "target allowlist", "expiry"]
    },
    {
      id: "publish-recap",
      role: "media-agent",
      budgetUsdc: 100,
      caveats: ["dependency", "artifact hash", "method allowlist"]
    },
    {
      id: "attendee-refunds",
      role: "finance-agent",
      budgetUsdc: 300,
      caveats: ["dependency", "batch transfer", "target allowlist"]
    }
  ],
  simulations: [
    "venue-agent paying 350 USDC to venue.safe: allowed",
    "logistics-agent paying 300 USDC before venue booking: denied",
    "media-agent publishing to unknown.target: denied",
    "finance-agent batching 280 USDC refunds after dependencies: allowed"
  ],
  why: [
    "Intent is the root object, not an allowance popup.",
    "Subdelegations are task-scoped and dependency-aware.",
    "Novel caveats make the permission model more expressive than a flat spend cap."
  ]
};
