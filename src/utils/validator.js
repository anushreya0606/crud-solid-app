// S: Single Responsibility — only validates tasks
const TaskValidator = {
  validate: (task) => {
    if (!task.title?.trim()) return { valid: false, error: "Title is required" };
    if (!task.priority) return { valid: false, error: "Priority is required" };
    return { valid: true, error: null };
  },
};

export default TaskValidator;
