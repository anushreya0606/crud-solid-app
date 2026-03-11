// handles all task operations, gets the storage injected so we can swap it easily
import IdGenerator from '../utils/idGenerator';

class TaskService {
  constructor(repository) {
    this.repo = repository;
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