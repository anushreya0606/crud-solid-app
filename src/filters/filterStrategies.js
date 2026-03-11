// each filter is a separate function so its easy to add more later
const filterStrategies = {
  all: () => true,
  active: (t) => t.status === "active",
  done: (t) => t.status === "done",
  high: (t) => t.priority === "High",
};

export default filterStrategies;