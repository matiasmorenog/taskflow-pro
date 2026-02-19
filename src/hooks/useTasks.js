import { useMemo, useState } from "react";
import { loadTasks, saveTasks } from "../utils/taskStorage";

const seedTasks = [
  {
    id: crypto.randomUUID(),
    title: "Define MVP scope",
    description: "List core features and prioritize by delivery value.",
    priority: "High",
    status: "Todo",
    dueDate: "",
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    title: "Build filtering system",
    description: "Enable search, status and priority filters.",
    priority: "Medium",
    status: "In Progress",
    dueDate: "",
    createdAt: Date.now() + 1,
  },
  {
    id: crypto.randomUUID(),
    title: "Publish first demo",
    description: "Deploy on Vercel and validate production build.",
    priority: "Low",
    status: "Done",
    dueDate: "",
    createdAt: Date.now() + 2,
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks(seedTasks));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const upsertTasks = (nextTasks) => {
    setTasks(nextTasks);
    saveTasks(nextTasks);
  };

  const addTask = (payload) => {
    const newTask = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      priority: payload.priority,
      status: "Todo",
      dueDate: payload.dueDate,
      createdAt: Date.now(),
    };

    upsertTasks([newTask, ...tasks]);
  };

  const updateStatus = (taskId, nextStatus) => {
    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: nextStatus } : task,
    );

    upsertTasks(nextTasks);
  };

  const toggleDone = (taskId) => {
    const nextTasks = tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      return {
        ...task,
        status: task.status === "Done" ? "Todo" : "Done",
      };
    });

    upsertTasks(nextTasks);
  };

  const deleteTask = (taskId) => {
    const nextTasks = tasks.filter((task) => task.id !== taskId);
    upsertTasks(nextTasks);
  };

  const clearDone = () => {
    const nextTasks = tasks.filter((task) => task.status !== "Done");
    upsertTasks(nextTasks);
  };

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchQuery =
        q.length === 0 ||
        `${task.title} ${task.description}`.toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || task.status === statusFilter;
      const matchPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchQuery && matchStatus && matchPriority;
    });

    const sortMap = {
      Newest: (a, b) => b.createdAt - a.createdAt,
      Oldest: (a, b) => a.createdAt - b.createdAt,
      Priority: (a, b) => {
        const rank = { High: 0, Medium: 1, Low: 2 };
        return rank[a.priority] - rank[b.priority];
      },
    };

    return filtered.sort(sortMap[sortBy]);
  }, [tasks, query, statusFilter, priorityFilter, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "Done").length;
    const inProgress = tasks.filter((task) => task.status === "In Progress").length;
    const todo = tasks.filter((task) => task.status === "Todo").length;

    return {
      total,
      done,
      inProgress,
      todo,
      completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [tasks]);

  return {
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
  };
}
