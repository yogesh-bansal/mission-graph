# Mission Graph

**A mission-bound delegation compiler for autonomous teams.**

Mission Graph turns one human objective into a bounded subdelegation tree. A planner agent receives mission-scoped authority, compiles task nodes for specialist agents, and attaches caveats for budget, target allowlists, function allowlists, expiry, dependencies, and proof-of-completion. The result is not just "an agent can spend money." It is a structured authorization graph for multi-agent execution.

This is intentionally not another wallet abstraction demo. It is a permission design product where the main artifact is the delegation graph itself.

## Track Alignment

### Primary: Best Use of Delegations

Track UUID: `0d69d56a8a084ac5b7dbe0dc1da73e1d`

| Track requirement | How Mission Graph fits |
|---|---|
| Creative, meaningful use of delegations | One human mission becomes a delegation graph rather than a single allowance |
| Intent-based delegations as a core pattern | The user describes an objective and risk envelope, and the compiler turns that into bounded authorities |
| Sub-delegations / coordination chains | Planner authority fans out into task-scoped worker delegations |
| Novel permission model | The repo introduces dependency caveats, artifact-hash caveats, and fan-out limits on top of standard spend/target/expiry restrictions |
| Standard patterns alone will not place | This repo is explicitly about mission-scoped delegation design, not a thin spending-cap example |

### Secondary: Synthesis Open Track

Track UUID: `fdb76d08812b43f6a5f454744b66f590`

Why it fits:

- It is a distinct agentic coordination system with real technical depth.
- It gives the portfolio an authorization / control-plane lane rather than another content or payment agent.

## Problem

Giving an agent blanket authority is unsafe. Giving it one flat spending cap is usually too crude.

Real autonomous work is multi-step:

- one agent books the venue
- another procures supplies
- another publishes assets
- another handles refunds or payouts

Those agents should not all inherit the same permissions. They need mission-specific, task-specific, and time-specific authority, with clear dependencies between steps.

## Solution

Mission Graph lets a human define:

- the objective
- the overall budget
- the time window
- the allowed targets
- the worker roles
- the dependency order

The compiler then creates:

1. a root planner delegation
2. worker subdelegations for each task
3. caveats for scope and safety
4. an evaluator-friendly permission request artifact
5. a simulation layer that explains whether a proposed action should be allowed

The product is a graph compiler for authority, not just a task planner.

## What Is Shipped

- A mission compiler in [`src/core/graph-compiler.mjs`](./src/core/graph-compiler.mjs)
- A policy simulator in [`src/core/policy-engine.mjs`](./src/core/policy-engine.mjs)
- Caveat generators in [`src/delegations/caveats.mjs`](./src/delegations/caveats.mjs)
- A permission request builder in [`src/delegations/permission-request.mjs`](./src/delegations/permission-request.mjs)
- A MetaMask smart-account bootstrap helper in [`src/delegations/metamask-account.mjs`](./src/delegations/metamask-account.mjs)
- A small server in [`src/server/app.mjs`](./src/server/app.mjs)
- A local demo in [`src/demo.mjs`](./src/demo.mjs)
- Example outputs in [`examples/`](./examples)
- A static visual preview in [`web/index.html`](./web/index.html)
- Submission scaffolding in [`submission.template.json`](./submission.template.json)
- A judged build log in [`conversationLog.md`](./conversationLog.md)

## Why MetaMask Is Load-Bearing

Without the Delegation Framework, this is just an internal mission planner.

With MetaMask Delegations:

- the human can delegate authority offchain in bounded form
- planner authority can subdelegate to specialist agents
- caveats become the core safety mechanism
- the execution graph becomes enforceable rather than advisory

That is why the MetaMask track is the primary home.

## Caveat Model

Mission Graph combines standard and novel caveats:

- **Spend limit caveat**: max amount per task
- **Target allowlist caveat**: only approved recipients or contracts
- **Method allowlist caveat**: only approved call types
- **Expiry caveat**: delegation expires automatically
- **Dependency caveat**: task cannot execute until prerequisite tasks are complete
- **Artifact hash caveat**: a proof-of-completion hash is required before redemption
- **Fan-out caveat**: the planner can only create a limited number of child delegations

The novel part is the dependency-aware delegation graph. It turns permissions into a workflow primitive.

## Product Model

```text
Human mission
    |
    v
+---------------------------+
| Root planner delegation   |
| overall budget + expiry   |
| max fan-out               |
+-------------+-------------+
              |
   +----------+-----------+-----------+-----------+
   |                      |                       |
   v                      v                       v
+-------------+   +---------------+   +------------------+
| Venue agent |   | Logistics     |   | Media / Finance  |
| target list |   | depends on    |   | proof hash /     |
| spend cap   |   | venue task    |   | batch transfer   |
+-------------+   +---------------+   +------------------+
              \________ policy simulation + permission request ________/
```

## Demo Scenario

The included sample mission is a 48-hour community build sprint:

- reserve venue
- handle catering
- pay a designer stipend
- publish a recap
- process attendee refunds

Every node has its own budget, allowed target set, allowed methods, dependencies, and optional proof requirements.

Run the local demo:

```bash
npm install
npm run demo
```

The demo writes:

- `output/<mission-id>/delegation-graph.json`
- `output/<mission-id>/permission-request.json`
- `output/<mission-id>/mission-brief.md`
- `output/<mission-id>/action-simulations.json`

Prebuilt artifacts also live in [`examples/`](./examples).

The static preview in [`web/`](./web) is intentionally sample-data driven. It is there to make the delegation graph legible to judges quickly, not to imply that this repo already ships a production wallet UI.

## Server Routes

The included server exposes the product shape:

- `POST /api/missions`
- `GET /api/missions/:missionId`
- `GET /api/missions/:missionId/graph`
- `GET /api/missions/:missionId/permission-request`
- `POST /api/missions/:missionId/simulate-action`

These routes are enough for an evaluator to understand the system as a real product rather than a loose concept.

## Security

The submission is intentionally clean:

- no private keys are committed
- `.env` is ignored
- `.env.example` contains placeholders only
- the demo works without secrets
- the policy layer explains denials instead of silently allowing or rejecting actions

If deployed live, keep actual MetaMask owner keys and RPC URLs in environment variables only.

## Repo Structure

```text
mission-graph/
├── .env.example
├── .gitignore
├── agent.json
├── conversationLog.md
├── examples/
│   ├── action-simulations.json
│   ├── delegation-graph.json
│   ├── mission-brief.md
│   └── permission-request.json
├── package.json
├── README.md
├── scenarios/
│   ├── community-sprint-actions.json
│   └── community-sprint-mission.json
├── submission.template.json
├── src/
│   ├── core/
│   │   ├── graph-compiler.mjs
│   │   ├── policy-engine.mjs
│   │   └── utils.mjs
│   ├── delegations/
│   │   ├── caveats.mjs
│   │   ├── metamask-account.mjs
│   │   └── permission-request.mjs
│   ├── demo.mjs
│   ├── index.mjs
│   └── server/
│       └── app.mjs
└── web/
    ├── app.js
    ├── index.html
    ├── sample-graph.js
    └── styles.css
```

## Honest Scope

What is implemented:

- a mission compiler
- caveat generation
- subdelegation graph output
- a policy simulator
- a MetaMask smart-account bootstrap helper

What is not claimed:

- no production wallet UI
- no live onchain redemption flow in this repo
- no custom caveat enforcer contracts deployed

That is deliberate. The repo shows a strong delegation design system without pretending the whole stack is production-complete.
