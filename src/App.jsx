import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import "./App.css";

const priorityOptions = ["High", "Medium", "Low"];
const statusOptions = ["All", "Todo", "In Progress", "Done"];

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
    </article>
  );
}

function TaskItem({ task, onStatusChange, onToggleDone, onDelete }) {
  return (
    <article className={`task-card ${task.status === "Done" ? "task-done" : ""}`}>
      <header>
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description"}</p>
        </div>
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </header>

      <div className="task-meta">
        <span>Due: {task.dueDate || "No date"}</span>
        <select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)}>
          {statusOptions.slice(1).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <footer>
        <button type="button" onClick={() => onToggleDone(task.id)}>
          {task.status === "Done" ? "Mark as Todo" : "Mark as Done"}
        </button>
        <button type="button" className="danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </footer>
    </article>
  );
}

export default function App() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    filteredTasks,
    stats,
    addTask,
    updateStatus,
    toggleDone,
    deleteTask,
    clearDone,
  } = useTasks();

  const onSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    addTask(form);
    setForm({ title: "", description: "", priority: "Medium", dueDate: "" });
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">TaskFlow Pro</p>
          <h1>Task management app for real delivery workflows</h1>
          <p>
            Portfolio project showcasing React state design, advanced filtering, task lifecycle,
            and local persistence.
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Todo" value={stats.todo} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Done" value={stats.done} />
        <StatCard label="Completion" value={`${stats.completionRate}%`} />
      </section>

      <section className="panel-grid">
        <form className="panel" onSubmit={onSubmit}>
          <h2>Create task</h2>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Define API response model"
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Include edge cases and error states"
            />
          </label>

          <div className="inline-fields">
            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, priority: event.target.value }))
                }>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                }
              />
            </label>
          </div>

          <button type="submit">Add task</button>
        </form>

        <section className="panel">
          <div className="panel-header">
            <h2>Filters</h2>
            <button type="button" className="danger" onClick={clearDone}>
              Clear done
            </button>
          </div>

          <label>
            Search
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or description"
            />
          </label>

          <div className="inline-fields">
            <label>
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}>
                {["All", ...priorityOptions].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option>Newest</option>
                <option>Oldest</option>
                <option>Priority</option>
              </select>
            </label>
          </div>
        </section>
      </section>

      <section className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={updateStatus}
              onToggleDone={toggleDone}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <article className="empty-state">
            <h3>No tasks found</h3>
            <p>Try changing filters or add a new task.</p>
          </article>
        )}
      </section>
    </div>
  );
}
