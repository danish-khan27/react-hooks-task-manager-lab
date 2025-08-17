import React, { useContext, useId, useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskForm() {
  const { addTask } = useContext(TaskContext);
  const [taskName, setTaskName] = useState("");
  const inputId = useId(); // accessibility + test-friendly

  function handleSubmit(e) {
    e.preventDefault();
    const title = taskName.trim();
    if (!title) return;
    addTask(title);
    setTaskName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={inputId}>New Task:</label>
      <input
        id={inputId}
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
