import fs from "fs";
import path from "path";
import { setupProject } from "./setupVite.js";
import { execSync } from "child_process";

export function simpleTodo(projectName) {
  const projectPath = setupProject(projectName);

  // Auto install react-router-dom
  // console.log("📦 Installing react-router-dom...");
  // execSync(`cd ${projectPath} && npm install react-router-dom`, {
  //   stdio: "inherit",
  // });

  // Ensure folders
  const compDir = path.join(projectPath, "src", "components");
  const pagesDir = path.join(projectPath, "src", "pages");
  const routesDir = path.join(projectPath, "src", "routes");

  [compDir, pagesDir, routesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // ===== Header.jsx =====
  const headerContent = `
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <header className="header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/todos">Todos</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
    </header>
  );
}
`;
  fs.writeFileSync(path.join(compDir, "Header.jsx"), headerContent);

  // ===== Footer.jsx =====
  const footerContent = `
export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 My Todo App. Built with ❤️ using React.</p>
    </footer>
  );
}
`;
  fs.writeFileSync(path.join(compDir, "Footer.jsx"), footerContent);

  // ===== AddTodo.jsx =====
  const addTodoContent = `
import { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  };

  return (
    <div className="add-todo">
      <input
        type="text"
        placeholder="Enter todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(compDir, "AddTodo.jsx"), addTodoContent);

  // ===== TodoList.jsx =====
  const todoListContent = `
export default function TodoList({ todos, onDelete, onEdit }) {
  return (
    <ul className="todo-list">
      {todos.map((todo, index) => (
        <li key={index}>
          <span>{todo}</span>
          <div>
            <button onClick={() => onEdit(index)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(index)} className="delete-btn">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
`;
  fs.writeFileSync(path.join(compDir, "TodoList.jsx"), todoListContent);

  // ===== Home.jsx =====
  const homeContent = `
export default function Home() {
  return (
    <div className="page">
      <h1>Welcome to My Todo App</h1>
      <p>Manage your tasks with ease. Register or login to get started!</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, "Home.jsx"), homeContent);

  // ===== Login.jsx =====
  const loginContent = `
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/todos");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <span className="link" onClick={() => navigate("/register")}>Register</span>
      </p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, "Login.jsx"), loginContent);

  // ===== Register.jsx =====
  const registerContent = `
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    localStorage.setItem("user", JSON.stringify({ email, password }));
    alert("Registration successful! Please login.");
    navigate("/");
  };

  return (
    <div className="page">
      <h1>Register</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, "Register.jsx"), registerContent);

  // ===== ProtectedRoute.jsx =====
  const protectedRouteContent = `
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? children : <Navigate to="/login" />;
}
`;
  fs.writeFileSync(
    path.join(routesDir, "ProtectedRoute.jsx"),
    protectedRouteContent
  );

  // ===== App.jsx =====
  const appContent = `
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

function TodoPage() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => setTodos([...todos, todo]);
  const deleteTodo = (index) => setTodos(todos.filter((_, i) => i !== index));
  const editTodo = (index) => {
    const newValue = prompt("Edit todo:", todos[index]);
    if (newValue) {
      const updated = [...todos];
      updated[index] = newValue;
      setTodos(updated);
    }
  };

  return (
    <div className="page">
      <h1>Todo App</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onDelete={deleteTodo} onEdit={editTodo} />
    </div>
  );
}

export default function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <Router>
      {isAuthenticated && <Header />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </Router>
  );
}
`;

  fs.writeFileSync(path.join(projectPath, "src", "App.jsx"), appContent);

  // ===== App.css =====
  const cssContent = `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  background: #f9f9f9;
  color: #333;
}

header, footer {
  background: #282c34;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
}

header nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

header nav a, .logout-btn {
  color: white;
  text-decoration: none;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}

.logout-btn:hover, header nav a:hover {
  text-decoration: underline;
}

main {
  min-height: 80vh;
  padding: 2rem;
}

.page {
  width: 100%;
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

input {
  padding: 0.7rem;
  margin: 0.5rem 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.7rem 1.5rem;
  margin: 0.5rem 0.3rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.add-todo {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-todo input {
  flex: 1;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem;
  margin: 0.4rem 0;
  background: #f1f1f1;
  border-radius: 4px;
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.footer {
  text-align: center;
  padding: 1rem;
  background: #282c34;
  color: #aaa;
  width: 100%;
}

`;
  fs.writeFileSync(path.join(projectPath, "src", "App.css"), cssContent);

  console.log(
    `✅ Styled Simple Todo with Auth + Header + Footer created in ${projectName}`
  );
  console.log("👉 Next steps:");
  console.log(`   cd ${projectName}`);
  console.log("   npm run dev");
}
