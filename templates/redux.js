import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { setupProject } from "./setupVite.js";

export function reduxTodo(projectName) {
  const projectPath = setupProject(projectName);

  console.log("📦 Installing Redux Toolkit...");
  execSync(`cd ${projectPath} && npm install @reduxjs/toolkit react-redux`, {
    stdio: "inherit",
  });

  const storeContent = `
import { configureStore, createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => { state.push(action.payload); }
  }
});

export const { addTodo } = todosSlice.actions;
export const store = configureStore({ reducer: { todos: todosSlice.reducer } });
`;

  const appContent = `
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, addTodo } from "./store";
import { useState } from "react";

function TodoApp() {
  const [input, setInput] = useState("");
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Redux Todo</h1>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={() => { if(input.trim()){dispatch(addTodo(input)); setInput("");}}}>Add</button>
      <ul>
        {todos.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}
`;

  fs.writeFileSync(path.join(projectPath, "src", "store.js"), storeContent);
  fs.writeFileSync(path.join(projectPath, "src", "App.jsx"), appContent);

  console.log(`✅ Redux Todo created in ${projectName}`);
}
