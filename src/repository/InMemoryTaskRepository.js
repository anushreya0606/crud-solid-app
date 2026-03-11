// L: Liskov Substitution — swappable with LocalStorageRepo or ApiRepo
class InMemoryTaskRepository {
  constructor(initialData) {
    this._tasks = initialData;
  }
  getAll() { return [...this._tasks]; }
  add(task) { this._tasks = [...this._tasks, task]; return task; }
  update(id, patch) {
    this._tasks = this._tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    return this._tasks.find((t) => t.id === id);
  }
  delete(id) { this._tasks = this._tasks.filter((t) => t.id !== id); }
}

export default InMemoryTaskRepository;
