import React from "react";
import TaskForm from "./TaskForm";
import SearchBar from "./SearchBar";
import TaskList from "./TaskList";

function App() {
  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm />
      <SearchBar />
      <TaskList />
    </div>
  );
}

export default App;
