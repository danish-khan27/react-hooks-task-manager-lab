import React, { useContext, useRef } from "react";
import { TaskContext } from "../context/TaskContext";

function SearchBar() {
  // useRef: persist the input node without re-rendering on every keystroke
  const inputRef = useRef(null);
  const { setSearch } = useContext(TaskContext);

  function handleChange() {
    // read from ref; store search in context
    setSearch(inputRef.current?.value || "");
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search tasks..."
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
