export function spendLimitCaveat(task) {
  return {
    kind: "spend-limit",
    amountUsdc: task.budgetUsdc,
    token: "USDC",
    reason: `Task budget is capped at ${task.budgetUsdc} USDC.`
  };
}

export function targetAllowlistCaveat(task) {
  return {
    kind: "target-allowlist",
    targets: task.allowedTargets,
    reason: "Only approved targets can receive funds or calls."
  };
}

export function methodAllowlistCaveat(task) {
  return {
    kind: "method-allowlist",
    methods: task.allowedMethods,
    reason: "Only approved method families are executable."
  };
}

export function expiryCaveat(deadline) {
  return {
    kind: "expiry",
    deadline,
    reason: "Authority expires automatically at the mission deadline."
  };
}

export function dependencyCaveat(task) {
  return {
    kind: "dependency",
    dependsOn: task.dependsOn,
    reason: "Task cannot execute until prerequisite tasks are marked complete."
  };
}

export function artifactHashCaveat(task) {
  return {
    kind: "artifact-hash",
    required: Boolean(task.requiresArtifactHash),
    reason: "A proof-of-completion hash is required before redemption."
  };
}

export function fanOutCaveat(limit) {
  return {
    kind: "fan-out",
    limit,
    reason: `Planner can create at most ${limit} child delegations.`
  };
}
