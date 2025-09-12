import fs from "fs";
import path from "path";
import { setupProject } from "./setupVite.js";

export function hooksTodo(projectName) {
  const projectPath = setupProject(projectName);

  const hookContent = `
import { useState } from "react";

export function useTodos() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    if (!todo.trim()) return;
    setTodos([...todos, todo]);
  };

  return { todos, addTodo };
}
`;

  const appContent = `
import { useState } from "react";
import { useTodos } from "./useTodos";

export default function App() {
  const [input, setInput] = useState("");
  const { todos, addTodo } = useTodos();

  return (
    <div>
      <h1>Custom Hooks Todo</h1>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={() => { addTodo(input); setInput(""); }}>Add</button>
      <ul>
        {todos.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(projectPath, "src", "useTodos.js"), hookContent);
  fs.writeFileSync(path.join(projectPath, "src", "App.jsx"), appContent);

  console.log(`✅ Custom Hooks Todo created in ${projectName}`);
}
