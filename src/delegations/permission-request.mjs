export function buildPermissionRequest(graph) {
  return {
    version: "mission-graph/0.1",
    standard: "erc7715-style mission permission request",
    track: "Best Use of Delegations",
    missionId: graph.missionId,
    network: graph.mission.network,
    rootDelegation: {
      delegate: graph.root.role,
      budgetUsdc: graph.root.budgetUsdc,
      maxSubdelegationDepth: graph.root.maxSubdelegationDepth,
      caveats: graph.root.caveats
    },
    subdelegations: graph.nodes.map((node) => ({
      taskId: node.id,
      delegate: node.role,
      budgetUsdc: node.budgetUsdc,
      dependsOn: node.dependsOn,
      caveats: node.caveats
    })),
    designNotes: [
      "The mission root is intent-scoped, not wallet-wide.",
      "Each worker receives only the caveats needed for one task.",
      "Dependency and artifact caveats are the novel permission layer in this repo."
    ]
  };
}
