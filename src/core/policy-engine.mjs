export function simulateAction(graph, action) {
  const node = graph.nodes.find((item) => item.id === action.taskId);
  if (!node) {
    return {
      allowed: false,
      reasons: ["Unknown task node."]
    };
  }

  const reasons = [];

  if (action.role !== node.role) {
    reasons.push("Role does not match the delegated worker role.");
  }

  if (Number(action.amountUsdc || 0) > Number(node.budgetUsdc || 0)) {
    reasons.push("Requested amount exceeds the task budget caveat.");
  }

  if (!node.caveats.find((item) => item.kind === "target-allowlist")?.targets.includes(action.target)) {
    reasons.push("Target is not in the task allowlist.");
  }

  if (!node.caveats.find((item) => item.kind === "method-allowlist")?.methods.includes(action.method)) {
    reasons.push("Method is not in the task allowlist.");
  }

  const dependency = node.caveats.find((item) => item.kind === "dependency");
  const completed = new Set(action.completedTaskIds || []);
  for (const dep of dependency?.dependsOn || []) {
    if (!completed.has(dep)) {
      reasons.push(`Dependency not met: ${dep}.`);
    }
  }

  const artifactRequirement = node.caveats.find((item) => item.kind === "artifact-hash");
  if (artifactRequirement?.required && !action.proofHash) {
    reasons.push("Proof hash required for this task.");
  }

  const expiry = node.caveats.find((item) => item.kind === "expiry");
  if (expiry?.deadline && action.now && new Date(action.now).getTime() > new Date(expiry.deadline).getTime()) {
    reasons.push("Delegation has expired.");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    taskId: node.id,
    role: node.role
  };
}
