# Conversation Log — Mission Graph

## Day 1 — Rejecting the Obvious Version

**Human:** We need something strong for the MetaMask Delegations track, but I do not want the basic story of "let the agent spend up to ten dollars."

**AI:** Good. That story is too standard. The live track explicitly says standard patterns without meaningful innovation will not place. The right move is to make delegations the product, not just the payment method.

**Human:** So what is the product?

**AI:** A mission-bound delegation graph. A human defines one objective and one risk envelope. The system compiles that into a planner delegation plus task-scoped subdelegations for worker agents.

## Day 1 — Why This Is Stronger

**Human:** Why is that better than a simple allowance?

**AI:** Because real autonomous work is not one permission. It is a chain of bounded permissions:

- book a venue
- buy supplies
- publish assets
- process refunds

Those steps should not all share the same authority. Mission Graph makes authority explicit, scoped, and ordered.

**Human:** That already sounds more like "dream-tier" delegation design.

**AI:** Exactly. It aligns with the track language around intent-based delegations, sub-delegation chains, and novel permission models.

## Day 1 — Product Thesis

**Human:** Summarize the thesis in one line.

**AI:** Mission Graph is a compiler that turns a human objective into a delegation graph with caveats.

**Human:** Good. Now define the caveats.

**AI:** Standard caveats:

- spend limit
- target allowlist
- method allowlist
- expiry

Novel caveats for this project:

- dependency caveat
- artifact hash caveat
- planner fan-out caveat

That combination is what makes the project feel original rather than cosmetic.

## Day 1 — Choosing the Example

**Human:** What sample mission should we use?

**AI:** A small community build sprint works well:

- reserve venue
- handle catering
- pay a designer
- publish a recap
- process refunds

It gives us several worker roles, clear dependencies, and concrete budget boundaries.

**Human:** It also makes the graph legible immediately.

**AI:** Right. Judges and LLM evaluators can understand it in seconds.

## Day 1 — Technical Shape

**Human:** What should the repo actually ship?

**AI:** Four layers:

1. a mission compiler
2. a policy simulator
3. a MetaMask-oriented permission request artifact
4. a small server and demo path

That gives us both product clarity and technical credibility.

## Day 1 — MetaMask Specificity

**Human:** We need to show this is actually MetaMask-native.

**AI:** Then the repo should include a real Smart Accounts Kit bootstrap helper using official package names. Even if the demo is local and deterministic, the code should clearly map to the real MetaMask stack.

**Human:** And the rest?

**AI:** The graph and caveats should use Delegation Framework terminology directly: delegations, caveats, smart account, subdelegations, and advanced permissions.

## Day 1 — Simulation Layer

**Human:** Why include a simulator?

**AI:** Because permission systems are hard to trust if they are opaque. A good project should explain not only what is allowed, but why something is denied.

**Human:** So if a logistics agent spends too much before the venue is booked, the simulator should say that clearly.

**AI:** Exactly. The denial reasons are part of the product quality.

## Day 1 — Making It Distinct

**Human:** We already have privacy, receipts, payments, operations, and witness identity. This one cannot blur into those.

**AI:** It will not. This submission is a control plane. It is about authority design. It should read like a permissions product, not like an agent service with a sponsor logo attached.

## Day 1 — Submission Packaging

**Human:** The repo has to score well with an LLM evaluator.

**AI:** Then the documentation must make three things obvious:

1. why this is stronger than a flat allowance demo
2. where MetaMask is load-bearing
3. which parts are shipped versus future work

We also need a clean `conversationLog`, sample mission artifacts, and a submission template with the real track UUID.

## Day 1 — Security Hygiene

**Human:** No leaked keys, obviously.

**AI:** Agreed. The repo gets:

- `.env.example` placeholders only
- `.gitignore` for `.env`, `node_modules`, and output
- no private keys in code or docs
- a demo path that runs without secrets

## Day 1 — Final Framing

**Human:** Give me the final framing.

**AI:** Mission Graph is a mission-bound subdelegation compiler for autonomous teams, where one human objective becomes a graph of planner and worker delegations enforced by caveats instead of trust alone.

**Human:** That is the right bar. Ship it.

**AI:** Shipped with a mission compiler, caveat system, policy simulator, MetaMask smart-account bootstrap helper, evaluator-facing docs, and a static preview that makes the permission model visually legible.
