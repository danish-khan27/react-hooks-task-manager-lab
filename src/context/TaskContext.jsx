import React, { createContext, useEffect, useMemo, useState } from "react";

export const TaskContext = createContext(null);

const API = "http://localhost:6001/tasks";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  // Load tasks on mount
  useEffect(() => {
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load tasks");
        return r.json();
      })
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]));
  }, []);

  // ---- Mutations ------------------------------------------------------------

  // Add a task (POST) with optimistic update and safe fallback
  function addTask(title) {
    const payload = { title, completed: false };

    // optimistic insert (temp id so UI updates immediately)
    const temp = { id: Date.now(), title, completed: false };
    setTasks((prev) => [...prev, temp]);

    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to create task");
        return r.json();
      })
      .then((created) => {
        setTasks((prev) => {
          // drop temp
          const withoutTemp = prev.filter((t) => t.id !== temp.id);
          // ensure created has a title; if not, keep the temp
          const safeCreated =
            created && typeof created.title === "string"
              ? created
              : temp;
          return [...withoutTemp, safeCreated];
        });
        return created;
      })
      .catch(() => {
        // rollback optimistic insert on failure
        setTasks((prev) => prev.filter((t) => t.id !== temp.id));
      });
  }

  // Toggle completion (PATCH) — optimistic with revert on failure
  function toggleComplete(id) {
    const current = tasks.find((t) => t && t.id === id);
    if (!current) return;

    const nextCompleted = !current.completed;

    // optimistic
    setTasks((prev) =>
      prev.map((t) =>
        t && t.id === id ? { ...t, completed: nextCompleted } : t
      )
    );

    return fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: nextCompleted }),
    }).catch(() => {
      // revert on failure
      setTasks((prev) =>
        prev.map((t) =>
          t && t.id === id ? { ...t, completed: current.completed } : t
        )
      );
    });
  }

  const filteredTasks = useMemo(() => {
    const q = (search || "").toLowerCase();
    return tasks.filter((t) => {
      const title = t && typeof t.title === "string" ? t.title : "";
      return title.toLowerCase().includes(q);
    });
  }, [tasks, search]);

  const value = {
    tasks,
    filteredTasks,
    addTask,
    toggleComplete,
    search,
    setSearch,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
