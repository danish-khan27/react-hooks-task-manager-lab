import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskList() {
  const { filteredTasks, toggleComplete } = useContext(TaskContext);

  return (
    <ul>
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <span
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            {task.title}
          </span>
          <button data-testid={task.id} onClick={() => toggleComplete(task.id)}>
            {task.completed ? "Undo" : "Complete"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
