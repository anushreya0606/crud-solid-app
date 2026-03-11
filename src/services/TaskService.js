// D: Dependency Inversion — depends on abstraction, not concrete implementation
import IdGenerator from '../utils/idGenerator';

class TaskService {
  constructor(repository) {
    this.repo = repository; // injected dependency
  }
  createTask(data) {
    return this.repo.add({
      ...data,
      id: IdGenerator.generate(),
      status: "active",
      createdAt: new Date().toISOString()
    });
  }
  updateTask(id, patch) { return this.repo.update(id, patch); }
  deleteTask(id) { return this.repo.delete(id); }
  getTasks() { return this.repo.getAll(); }
}

export default TaskService;
