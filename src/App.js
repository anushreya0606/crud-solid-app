import { useState, useCallback } from "react";
import InMemoryTaskRepository from "./repository/InMemoryTaskRepository";
import TaskService from "./services/TaskService";
import useTaskFilter from "./hooks/useTaskFilter";
import useTaskForm from "./hooks/useTaskForm";
import DateFormatter from "./utils/dateFormatter";

// color mapping for priority badges
const PRIORITY_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

// color mapping for tag badges
const TAG_COLORS = {
  Feature: "#8b5cf6", Testing: "#6366f1", Refactor: "#ec4899",
  Architecture: "#0ea5e9", Docs: "#14b8a6", Bug: "#ef4444",
};

// solid principles for the panel
const PRINCIPLES = [
  { letter: "S", name: "Single Responsibility", desc: "IdGenerator, TaskValidator, DateFormatter each do just one thing" },
  { letter: "O", name: "Open/Closed", desc: "filterStrategies lets us add new filters without touching old code" },
  { letter: "L", name: "Liskov Substitution", desc: "InMemoryTaskRepository can be swapped for localStorage or an API" },
  { letter: "I", name: "Interface Segregation", desc: "useTaskFilter and useTaskForm are small focused hooks instead of one big one" },
  { letter: "D", name: "Dependency Inversion", desc: "TaskService gets its repository passed in so its not tightly coupled" },
];

// sample tasks
const seedData = [
  { id: "1", title: "Design system architecture", priority: "High", tag: "Architecture", status: "done", notes: "Follow SOLID principles", createdAt: "2025-03-01T09:00:00Z" },
  { id: "2", title: "Write unit tests", priority: "High", tag: "Testing", status: "active", notes: "Cover edge cases", createdAt: "2025-03-05T14:00:00Z" },
  { id: "3", title: "Refactor auth module", priority: "Medium", tag: "Refactor", status: "active", notes: "", createdAt: "2025-03-08T10:00:00Z" },
  { id: "4", title: "Update API docs", priority: "Low", tag: "Docs", status: "active", notes: "Add examples", createdAt: "2025-03-09T11:00:00Z" },
];

const repo = new InMemoryTaskRepository(seedData);
const service = new TaskService(repo);

// small reusable badge
const Badge = ({ label, colorMap }) => (
  <span style={{
    background: `${colorMap[label]}15`, color: colorMap[label],
    border: `1px solid ${colorMap[label]}40`, padding: "2px 10px",
    borderRadius: 99, fontSize: 11, fontWeight: 600, fontFamily: "monospace",
  }}>{label}</span>
);

// sidebar nav item
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer",
    background: active ? "#f1f5f9" : "transparent",
    color: active ? "#0f172a" : "#94a3b8",
    fontWeight: active ? 600 : 400, fontSize: 14,
    transition: "all 0.15s", textAlign: "left",
  }}>
    <span style={{ fontSize: 18 }}>{icon}</span>
    {label}
  </button>
);

export default function App() {
  const [tasks, setTasks] = useState(() => service.getTasks());
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { filter, setFilter, filtered } = useTaskFilter(tasks);
  const refresh = useCallback(() => setTasks(service.getTasks()), []);

  const { form, error, handleChange, handleSubmit, setForm } = useTaskForm((data) => {
    if (editId) { service.updateTask(editId, data); setEditId(null); }
    else service.createTask(data);
    refresh();
    setPage("tasks");
  });

  const startEdit = (task) => {
    setEditId(task.id);
    setForm({ title: task.title, priority: task.priority, tag: task.tag, notes: task.notes });
    setPage("add");
  };
  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: "", priority: "Medium", tag: "Feature", notes: "" });
  };
  const toggleStatus = (task) => {
    service.updateTask(task.id, { status: task.status === "active" ? "done" : "active" });
    refresh();
  };
  const deleteTask = (id) => { service.deleteTask(id); refresh(); };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    active: tasks.filter((t) => t.status === "active").length,
    high: tasks.filter((t) => t.priority === "High" && t.status === "active").length,
  };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "add", icon: "➕", label: "Add Task" },
    { id: "tasks", icon: "📋", label: "Task List" },
    { id: "solid", icon: "🧱", label: "SOLID Principles" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'DM Sans', sans-serif", color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .task-row:hover { background: #f8fafc !important; }
        .nav-btn:hover { background: #f1f5f9 !important; color: #0f172a !important; }
        .action-btn:hover { opacity: 0.8; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 70, minHeight: "100vh",
        background: "#ffffff", borderRight: "1px solid #e2e8f0",
        padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4,
        transition: "width 0.2s", flexShrink: 0,
      }}>
        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 24 }}>
          <span style={{ fontSize: 22 }}>✦</span>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "Space Mono", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Flowdesk</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        {/* nav links */}
        {navItems.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: page === n.id ? "#f1f5f9" : "transparent",
            color: page === n.id ? "#0f172a" : "#94a3b8",
            fontWeight: page === n.id ? 600 : 400, fontSize: 14,
            transition: "all 0.15s", textAlign: "left",
          }} className="nav-btn">
            <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
            {sidebarOpen && n.label}
          </button>
        ))}

        {/* live stats at bottom */}
        {sidebarOpen && (
          <div style={{ marginTop: "auto", padding: "16px 8px", borderTop: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10, fontWeight: 600, letterSpacing: "0.05em" }}>LIVE STATUS</p>
            <div style={{ background: "#fef2f2", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>🔴 {stats.high} High Priority</span>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✅ {stats.done} Completed</span>
            </div>
          </div>
        )}
      </div>

      {/* main content */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* ── DASHBOARD PAGE ── */}
        {page === "dashboard" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>📊 Dashboard</h1>
              <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
                Last updated: {new Date().toLocaleString()} · Flowdesk
              </p>
            </div>
            <div style={{ height: 1, background: "#e2e8f0", marginBottom: 32 }} />

            {/* stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
              {[
                { label: "Total Tasks", value: stats.total, sub: `+${stats.active} active`, color: "#6366f1" },
                { label: "Completed", value: stats.done, sub: "tasks done", color: "#22c55e" },
                { label: "High Priority", value: stats.high, sub: "need attention", color: "#ef4444" },
                { label: "In Progress", value: stats.active, sub: "still active", color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
                  padding: "20px 24px", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{s.label}</p>
                  <p style={{ fontSize: 36, fontWeight: 700, color: s.color, fontFamily: "Space Mono" }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>↑ {s.sub}</p>
                </div>
              ))}
            </div>

            {/* progress bar */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>Overall Progress</p>
                <p style={{ fontSize: 14, color: "#64748b" }}>{stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%</p>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 99, height: 10, overflow: "hidden" }}>
                <div style={{
                  width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%`,
                  height: "100%", background: "linear-gradient(90deg, #22c55e, #16a34a)",
                  borderRadius: 99, transition: "width 0.4s"
                }} />
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>{stats.done} of {stats.total} tasks completed</p>
            </div>

            {/* recent tasks */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Recent Tasks</p>
              {tasks.slice(0, 3).map((task, i) => (
                <div key={task.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                  borderBottom: i < 2 ? "1px solid #f1f5f9" : "none"
                }}>
                  <span style={{ fontSize: 18 }}>{task.status === "done" ? "✅" : "🔵"}</span>
                  <span style={{ flex: 1, fontSize: 14, color: task.status === "done" ? "#94a3b8" : "#0f172a", textDecoration: task.status === "done" ? "line-through" : "none" }}>{task.title}</span>
                  <Badge label={task.priority} colorMap={PRIORITY_COLORS} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADD TASK PAGE ── */}
        {page === "add" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700 }}>{editId ? "✏️ Edit Task" : "➕ Add Task"}</h1>
              <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Fill in the details below</p>
            </div>
            <div style={{ height: 1, background: "#e2e8f0", marginBottom: 32 }} />

            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 32, maxWidth: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Task Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="What needs to be done?"
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#0f172a", background: "#f8fafc", outline: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#0f172a", background: "#f8fafc" }}>
                    {["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Tag</label>
                  <select name="tag" value={form.tag} onChange={handleChange}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#0f172a", background: "#f8fafc" }}>
                    {["Feature", "Bug", "Refactor", "Testing", "Architecture", "Docs"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Notes</label>
                <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any extra notes? (optional)"
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#0f172a", background: "#f8fafc", outline: "none" }} />
              </div>
              {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>⚠ {error}</p>}
              <div style={{ display: "flex", gap: 10 }}>
                {editId && (
                  <button onClick={cancelEdit}
                    style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    Cancel
                  </button>
                )}
                <button onClick={handleSubmit}
                  style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {editId ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TASK LIST PAGE ── */}
        {page === "tasks" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700 }}>📋 Task List</h1>
                <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>{filtered.length} tasks shown</p>
              </div>
              <button onClick={() => setPage("add")}
                style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                + New Task
              </button>
            </div>
            <div style={{ height: 1, background: "#e2e8f0", marginBottom: 24 }} />

            {/* filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["all", "active", "done", "high"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "7px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                  border: `1px solid ${filter === f ? "#0f172a" : "#e2e8f0"}`,
                  background: filter === f ? "#0f172a" : "#fff",
                  color: filter === f ? "#fff" : "#64748b",
                  transition: "all 0.15s", textTransform: "capitalize"
                }}>{f}</button>
              ))}
            </div>

            {/* task rows */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              {/* table header */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 100px 110px 120px 80px", gap: 12, padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {["", "Title", "Priority", "Tag", "Date", "Actions"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                  <p style={{ fontSize: 14 }}>No tasks found</p>
                </div>
              ) : filtered.map((task, i) => (
                <div key={task.id} className="task-row" style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 100px 110px 120px 80px",
                  gap: 12, padding: "14px 20px", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                  background: "#fff", transition: "background 0.15s"
                }}>
                  <button onClick={() => toggleStatus(task)} style={{
                    width: 22, height: 22, borderRadius: 6, cursor: "pointer",
                    border: `2px solid ${task.status === "done" ? "#22c55e" : "#e2e8f0"}`,
                    background: task.status === "done" ? "#22c55e" : "transparent",
                    color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{task.status === "done" ? "✓" : ""}</button>

                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: task.status === "done" ? "#94a3b8" : "#0f172a", textDecoration: task.status === "done" ? "line-through" : "none" }}>{task.title}</p>
                    {task.notes && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>📝 {task.notes.slice(0, 35)}{task.notes.length > 35 ? "…" : ""}</p>}
                  </div>

                  <Badge label={task.priority} colorMap={PRIORITY_COLORS} />
                  <Badge label={task.tag} colorMap={TAG_COLORS} />
                  <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "Space Mono" }}>{DateFormatter.format(task.createdAt)}</span>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="action-btn" onClick={() => startEdit(task)} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>✎</button>
                    <button className="action-btn" onClick={() => deleteTask(task.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 13, color: "#ef4444" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOLID PAGE ── */}
        {page === "solid" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700 }}>🧱 SOLID Principles</h1>
              <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>How this app applies each principle</p>
            </div>
            <div style={{ height: 1, background: "#e2e8f0", marginBottom: 32 }} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {PRINCIPLES.map((p, i) => (
                <div key={p.letter} style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
                  padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  borderTop: `4px solid ${["#6366f1","#22c55e","#f59e0b","#ec4899","#0ea5e9"][i]}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{
                      width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${["#6366f1","#22c55e","#f59e0b","#ec4899","#0ea5e9"][i]}15`,
                      color: ["#6366f1","#22c55e","#f59e0b","#ec4899","#0ea5e9"][i],
                      fontFamily: "Space Mono", fontWeight: 700, fontSize: 18
                    }}>{p.letter}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8" }}>Principle {["One","Two","Three","Four","Five"][i]}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              ))}
            </div>

            {/* code snippet hint */}
            <div style={{ marginTop: 24, background: "#0f172a", borderRadius: 14, padding: 24, color: "#e2e8f0" }}>
              <p style={{ fontFamily: "Space Mono", fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>// folder structure</p>
              <pre style={{ fontFamily: "Space Mono", fontSize: 12, lineHeight: 1.8, color: "#e2e8f0" }}>{`src/
├── utils/        → idGenerator, validator, dateFormatter  (S)
├── filters/      → filterStrategies                       (O)
├── repository/   → InMemoryTaskRepository                 (L)
├── hooks/        → useTaskFilter, useTaskForm              (I)
├── services/     → TaskService                            (D)
└── App.js`}</pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}