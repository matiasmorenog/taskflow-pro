const TASKS_KEY = "taskflow_pro_tasks";

export function loadTasks(seedTasks) {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      return seedTasks;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedTasks;
  } catch {
    return seedTasks;
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
