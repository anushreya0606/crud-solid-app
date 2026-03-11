import { useState, useCallback } from "react";
import InMemoryTaskRepository from "./repository/InMemoryTaskRepository";
import TaskService from "./services/TaskService";
import useTaskFilter from "./hooks/useTaskFilter";
import useTaskForm from "./hooks/useTaskForm";
import DateFormatter from "./utils/dateFormatter";

const PRIORITY_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };
const TAG_COLORS = {
  Feature: "#6366f1", Testing: "#8b5cf6", Refactor: "#ec4899",
  Architecture: "#0ea5e9", Docs: "#14b8a6", Bug: "#ef4444",
};

const PRINCIPLES = [
  { letter: "S", name: "Single Responsibility", desc: "IdGenerator, TaskValidator, DateFormatter — each does one thing" },
  { letter: "O", name: "Open/Closed", desc: "filterStrategies: add new filters without modifying existing code" },
  { letter: "L", name: "Liskov Substitution", desc: "InMemoryTaskRepository can be swapped for LocalStorageRepo or ApiRepo" },
  { letter: "I", name: "Interface Segregation", desc: "useTaskFilter and useTaskForm are focused, separate hooks" },
  { letter: "D", name: "Dependency Inversion", desc: "TaskService receives its repository via constructor injection" },
];

const seedData = [
  { id: "1", title: "Design system architecture", priority: "High", tag: "Architecture", status: "done", notes: "Follow SOLID principles", createdAt: "2025-03-01T09:00:00Z" },
  { id: "2", title: "Write unit tests", priority: "High", tag: "Testing", status: "active", notes: "Cover edge cases", createdAt: "2025-03-05T14:00:00Z" },
  { id: "3", title: "Refactor auth module", priority: "Medium", tag: "Refactor", status: "active", notes: "", createdAt: "2025-03-08T10:00:00Z" },
  { id: "4", title: "Update API docs", priority: "Low", tag: "Docs", status: "active", notes: "Add examples", createdAt: "2025-03-09T11:00:00Z" },
];

const repo = new InMemoryTaskRepository(seedData);
const service = new TaskService(repo);

const Badge = ({ label, colorMap }) => (
  <span style={{
    background: `${colorMap[label]}22`, color: colorMap[label],
    border: `1px solid ${colorMap[label]}55`, padding: "2px 10px",
    borderRadius: 99, fontSize: 11, fontWeight: 700,
    letterSpacing: "0.05em", fontFamily: "monospace",
  }}>{label}</span>
);

export default function App() {
  const [tasks, setTasks] = useState(() => service.getTasks());
  const [editId, setEditId] = useState(null);
  const [showPrinciples, setShowPrinciples] = useState(false);
  const { filter, setFilter, filtered } = useTaskFilter(tasks);
  const refresh = useCallback(() => setTasks(service.getTasks()), []);

  const { form, error, handleChange, handleSubmit, setForm } = useTaskForm((data) => {
    if (editId) { service.updateTask(editId, data); setEditId(null); }
    else service.createTask(data);
    refresh();
  });

  const startEdit = (task) => {
    setEditId(task.id);
    setForm({ title: task.title, priority: task.priority, tag: task.tag, notes: task.notes });
  };
  const cancelEdit = () => { setEditId(null); setForm({ title: "", priority: "Medium", tag: "Feature", notes: "" }); };
  const toggleStatus = (task) => { service.updateTask(task.id, { status: task.status === "active" ? "done" : "active" }); refresh(); };
  const deleteTask = (id) => { service.deleteTask(id); refresh(); };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    high: tasks.filter((t) => t.priority === "High" && t.status === "active").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        .task-row:hover { background: #161622 !important; }
        .filter-btn:hover { border-color: #6366f1 !important; color: #a5b4fc !important; }
        .icon-btn:hover { transform: scale(1.15); }
        .principle-card:hover { transform: translateY(-2px); border-color: #6366f1 !important; }
        .add-btn:hover { background: #4f46e5 !important; }
      `}</style>

      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "24px 0", background: "#0d0d15" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: "Space Mono", fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>
              ⬡ TaskForge <span style={{ color: "#6366f1" }}>CRUD</span>
            </h1>
            <p style={{ fontSize: 12, color: "#64748b", fontFamily: "Space Mono" }}>SOLID Principles · Resume Project</p>
          </div>
          <button onClick={() => setShowPrinciples(p => !p)}
            style={{ background: "#13131f", border: "1px solid #2d2d44", borderRadius: 8, padding: "8px 16px", color: "#a5b4fc", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer" }}>
            {showPrinciples ? "HIDE" : "VIEW"} SOLID
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        {showPrinciples && (
          <div style={{ marginTop: 24, background: "#0d0d18", border: "1px solid #1e1e30", borderRadius: 12, padding: 24 }}>
            <p style={{ fontFamily: "Space Mono", fontSize: 11, color: "#6366f1", letterSpacing: "0.12em", marginBottom: 16 }}>SOLID PRINCIPLES</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {PRINCIPLES.map((p) => (
                <div key={p.letter} className="principle-card"
                  style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 10, padding: "16px 18px", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#6366f1" }}>{p.letter}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#c7d2fe" }}>{p.name}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
          {[{ label: "Total Tasks", value: stats.total, color: "#6366f1" }, { label: "Completed", value: stats.done, color: "#22c55e" }, { label: "High Priority", value: stats.high, color: "#ef4444" }].map((s) => (
            <div key={s.label} style={{ background: "#0d0d18", border: "1px solid #1e1e30", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontFamily: "Space Mono", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0d0d18", border: "1px solid #1e1e30", borderRadius: 12, padding: 24, marginTop: 24 }}>
          <p style={{ fontFamily: "Space Mono", fontSize: 11, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 16 }}>{editId ? "✏ EDIT TASK" : "＋ NEW TASK"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, marginBottom: 10 }}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Task title..."
              style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14 }} />
            <select name="priority" value={form.priority} onChange={handleChange}
              style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13 }}>
              {["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
            </select>
            <select name="tag" value={form.tag} onChange={handleChange}
              style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13 }}>
              {["Feature", "Bug", "Refactor", "Testing", "Architecture", "Docs"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)..."
              style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13 }} />
            <div style={{ display: "flex", gap: 8 }}>
              {editId && <button onClick={cancelEdit} style={{ background: "#1e1e2e", borderRadius: 8, padding: "10px 18px", color: "#64748b", fontSize: 13, cursor: "pointer", border: "none" }}>Cancel</button>}
              <button className="add-btn" onClick={handleSubmit}
                style={{ background: "#6366f1", borderRadius: 8, padding: "10px 22px", color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "Space Mono", cursor: "pointer", border: "none", transition: "all 0.15s" }}>
                {editId ? "SAVE" : "ADD"}
              </button>
            </div>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8, fontFamily: "Space Mono" }}>⚠ {error}</p>}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {Object.keys({ all: 1, active: 1, done: 1, high: 1 }).map((f) => (
            <button key={f} className="filter-btn" onClick={() => setFilter(f)}
              style={{ background: filter === f ? "#6366f122" : "transparent", border: `1px solid ${filter === f ? "#6366f1" : "#2a2a3e"}`, borderRadius: 8, padding: "6px 16px", color: filter === f ? "#a5b4fc" : "#64748b", fontSize: 11, fontFamily: "Space Mono", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#475569", fontFamily: "Space Mono", alignSelf: "center" }}>{filtered.length} tasks</span>
        </div>

        <div style={{ marginTop: 12, border: "1px solid #1e1e30", borderRadius: 12, overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#334155" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>◻</div>
              <p style={{ fontFamily: "Space Mono", fontSize: 13 }}>No tasks here</p>
            </div>
          ) : filtered.map((task, i) => (
            <div key={task.id} className="task-row"
              style={{ background: i % 2 === 0 ? "#0d0d18" : "#0a0a14", borderBottom: i < filtered.length - 1 ? "1px solid #1a1a28" : "none", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, transition: "background 0.15s" }}>
              <button className="icon-btn" onClick={() => toggleStatus(task)}
                style={{ background: "none", width: 22, height: 22, borderRadius: 6, border: `2px solid ${task.status === "done" ? "#22c55e" : "#2a2a3e"}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                {task.status === "done" ? "✓" : ""}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: task.status === "done" ? "#475569" : "#e2e8f0", textDecoration: task.status === "done" ? "line-through" : "none" }}>{task.title}</span>
                  <Badge label={task.priority} colorMap={PRIORITY_COLORS} />
                  <Badge label={task.tag} colorMap={TAG_COLORS} />
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#334155", fontFamily: "Space Mono" }}>{DateFormatter.format(task.createdAt)}</span>
                  {task.notes && <span style={{ fontSize: 11, color: "#475569" }}>📝 {task.notes.length > 30 ? task.notes.slice(0, 30) + "…" : task.notes}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="icon-btn" onClick={() => startEdit(task)}
                  style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 6, width: 32, height: 32, color: "#6366f1", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>✎</button>
                <button className="icon-btn" onClick={() => deleteTask(task.id)}
                  style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 6, width: 32, height: 32, color: "#ef4444", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
