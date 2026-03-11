// O: Open/Closed — add new filters without changing existing ones
const filterStrategies = {
  all: () => true,
  active: (t) => t.status === "active",
  done: (t) => t.status === "done",
  high: (t) => t.priority === "High",
};

export default filterStrategies;
