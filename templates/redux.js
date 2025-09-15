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

  // --- Helper function to create a file ---
  function createFile(filePath, content = "") {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }

  // --- Components ---
  const components = {
    // Button.jsx
    "Button.jsx": `
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow-md',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const classes = \`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
`,

    // Input.jsx
    "Input.jsx": `
import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputClasses = \`
    block w-full rounded-md border-gray-300 shadow-sm
    focus:border-blue-500 focus:ring-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200
    \${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    \${className}
  \`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
`,

    // Navbar.jsx
    "Navbar.jsx": `
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { CheckSquare, Home, Info, Mail, User, LogOut } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <CheckSquare size={28} />
            <span>TodoApp</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={\`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors \${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }\`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              className={\`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors \${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }\`}
            >
              <Info size={18} />
              <span>About</span>
            </Link>

            <Link
              to="/contact"
              className={\`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors \${
                isActive('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }\`}
            >
              <Mail size={18} />
              <span>Contact</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/todos"
                className={\`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors \${
                  isActive('/todos') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }\`}
              >
                <CheckSquare size={18} />
                <span>Todos</span>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-gray-600">
                  <User size={18} />
                  <span>Hello, {user?.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="primary"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap items-center justify-center space-x-4">
            <Link
              to="/"
              className={\`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors \${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }\`}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              className={\`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors \${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }\`}
            >
              <Info size={16} />
              <span>About</span>
            </Link>

            <Link
              to="/contact"
              className={\`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors \${
                isActive('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }\`}
            >
              <Mail size={16} />
              <span>Contact</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/todos"
                className={\`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors \${
                  isActive('/todos') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600'
                }\`}
              >
                <CheckSquare size={16} />
                <span>Todos</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`,

    // PrivateRoute.jsx
    "PrivateRoute.jsx": `
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid, getTokenFromStorage } from '../utils/auth';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const token = getTokenFromStorage();

  // Check if user is authenticated via Redux state or valid token
  const isUserAuthenticated = isAuthenticated || (token && isTokenValid(token));

  if (!isUserAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
`,

    // TodoItem.jsx
    "TodoItem.jsx": `
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTodo, deleteTodo, toggleComplete } from '../redux/slices/todoSlice';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import Button from './Button';
import PropTypes from 'prop-types';

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggleComplete = () => {
    dispatch(toggleComplete(todo.id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(todo.id));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      dispatch(updateTodo({ id: todo.id, updates: { text: editText.trim() } }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={\`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md \${
      todo.completed ? 'border-emerald-400 bg-gray-50' : 'border-blue-400'
    }\`}>
      <div className="flex items-center space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
        />

        {/* Todo Text */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          ) : (
            <span className={\`text-gray-800 \${todo.completed ? 'line-through text-gray-500' : ''}\`}>
              {todo.text}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                variant="secondary"
                size="small"
                disabled={!editText.trim()}
              >
                <Save size={14} />
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="small"
              >
                <X size={14} />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="small"
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={14} />
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="small"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={14} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Created At */}
      <div className="mt-2 text-xs text-gray-500">
        Created: {new Date(todo.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default TodoItem;
`,
  };

  Object.entries(components).forEach(([file, content]) =>
    createFile(path.join(projectPath, "src", "components", file), content)
  );

  // --- Pages ---
  // --- Pages ---
  const pages = {
    "About.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">About TodoApp</h1>
          <p className="text-gray-600 mb-4">
            TodoApp is a simple and intuitive application designed to help you manage your tasks efficiently.
            Built with React, Redux, and Tailwind CSS, it offers a seamless experience for creating, editing,
            and organizing your todos.
          </p>
          <p className="text-gray-600 mb-6">
            Whether you're tracking daily tasks or planning long-term goals, TodoApp provides a clean
            interface and robust functionality to keep you on top of your responsibilities.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
`,

    "Contact.jsx": `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Simulate form submission
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                className={\`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 \${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}\`}
                rows="5"
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                Send Message
              </Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
`,

    "Home.jsx": `
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to TodoApp</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Organize your tasks, boost your productivity, and achieve your goals with TodoApp.
          {isAuthenticated ? ' Manage your todos now!' : ' Get started today!'}
        </p>
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Button onClick={() => navigate('/todos')} variant="primary">
              Go to Todos
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/register')} variant="primary">
                Sign Up
              </Button>
              <Button onClick={() => navigate('/login')} variant="outline">
                Login
              </Button>
            </>
          )}
          <Link to="/about">
            <Button variant="ghost">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
`,

    "Login.jsx": `
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import PropTypes from 'prop-types';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, error, loading } = useSelector(state => state.auth);

  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await dispatch(login({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />
            <div className="flex space-x-4">
              <Button type="submit" variant="primary" loading={loading}>
                Login
              </Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  // No props are passed to this component
};

export default Login;
`,

    "NotFound.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
`,

    "Register.jsx": `
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import PropTypes from 'prop-types';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error, loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />
            <div className="flex space-x-4">
              <Button type="submit" variant="primary" loading={loading}>
                Sign Up
              </Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  // No props are passed to this component
};

export default Register;
`,

    "Todo.jsx": `
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, fetchTodos } from '../redux/slices/todoSlice';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import TodoItem from '../components/TodoItem';
import PrivateRoute from '../components/PrivateRoute';
import PropTypes from 'prop-types';

const Todo = () => {
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { todos, loading, error: todoError } = useSelector(state => state.todo);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError('Todo cannot be empty');
      return;
    }
    await dispatch(addTodo({ text: newTodo }));
    setNewTodo('');
    setError('');
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Todos</h1>
          <form onSubmit={handleAddTodo} className="max-w-lg mx-auto mb-8">
            <div className="flex space-x-4">
              <Input
                name="newTodo"
                value={newTodo}
                onChange={(e) => {
                  setNewTodo(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Add a new todo"
                error={error || todoError}
                className="flex-1"
              />
              <Button type="submit" variant="primary" loading={loading}>
                Add
              </Button>
            </div>
          </form>
          <div className="max-w-2xl mx-auto space-y-4">
            {todos.length === 0 ? (
              <p className="text-center text-gray-600">No todos yet. Add one above!</p>
            ) : (
              todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

Todo.propTypes = {
  // No props are passed to this component
};

export default Todo;
`,
  };

  Object.entries(pages).forEach(([file, content]) =>
    createFile(path.join(projectPath, "src", "pages", file), content)
  );

  // --- Redux ---
  createFile(path.join(projectPath, "src", "redux", "store.js"), "// store.js");
  const slices = ["authSlice.js", "todoSlice.js"];
  slices.forEach((file) =>
    createFile(
      path.join(projectPath, "src", "redux", "slices", file),
      `// ${file}`
    )
  );

  // --- Services ---
  const services = ["authService.js", "todoService.js"];
  services.forEach((file) =>
    createFile(path.join(projectPath, "src", "services", file), `// ${file}`)
  );

  // --- Utils ---
  const utils = ["auth.js", "constants.js"];
  utils.forEach((file) =>
    createFile(path.join(projectPath, "src", "utils", file), `// ${file}`)
  );

  // --- Root src files ---
  const srcFiles = [
    "App.jsx",
    "index.css",
    "index.js",
    "main.jsx",
    "vite-env.d.ts",
  ];
  srcFiles.forEach((file) =>
    createFile(path.join(projectPath, "src", file), `// ${file}`)
  );

  // --- Root-level files ---
  const rootFiles = [
    ".gitignore",
    "eslint.config.js",
    "index.html",
    "package.json",
    "postcss.config.js",
    "tailwind.config.js",
    "tsconfig.app.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "vite.config.ts",
  ];
  rootFiles.forEach((file) =>
    createFile(path.join(projectPath, file), `// ${file}`)
  );

  console.log(`✅ Redux Todo project structure created in ${projectName}`);
  return projectPath;
}
