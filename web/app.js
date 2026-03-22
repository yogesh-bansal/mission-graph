const graph = window.sampleGraph;

document.getElementById("mission-title").textContent = graph.mission.title;
document.getElementById("mission-objective").textContent = graph.mission.objective;
document.getElementById("budget").textContent = `${graph.summary.missionBudgetUsdc} USDC`;
document.getElementById("tasks").textContent = String(graph.summary.taskCount);
document.getElementById("warnings").textContent = String(graph.warnings.length);

const rootCaveats = document.getElementById("root-caveats");
graph.root.caveats.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = `${item.kind}: ${item.reason}`;
  rootCaveats.appendChild(li);
});

const novel = document.getElementById("novel-caveats");
graph.novelCaveats.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  novel.appendChild(li);
});

const taskGrid = document.getElementById("task-grid");
graph.nodes.forEach((node) => {
  const card = document.createElement("section");
  card.className = "task";
  card.innerHTML = `
    <header>
      <strong>${node.id}</strong>
      <span class="badge">${node.budgetUsdc} USDC</span>
    </header>
    <p>${node.role}</p>
    <p>${node.caveats.join(", ")}</p>
  `;
  taskGrid.appendChild(card);
});

const simulations = document.getElementById("simulations");
graph.simulations.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  simulations.appendChild(li);
});

const why = document.getElementById("why");
graph.why.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  why.appendChild(li);
});
