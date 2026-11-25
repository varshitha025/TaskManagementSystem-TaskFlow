
import { useState } from "react";
import "./App.css";

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

function App() {
  const path = window.location.pathname;
  const isRegister = path === "/register";
  const isAdminLogin = path === "/admin-login";
  const page = path.replace("/", "") || "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  });
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInAdmin"));
    } catch {
      return null;
    }
  });

  const [tasks, setTasks] = useState(() => read("tasks"));
  const [projects, setProjects] = useState(() => read("projects"));
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const saveTasks = (next) => {
    setTasks(next);
    localStorage.setItem("tasks", JSON.stringify(next));
  };

  const saveProjects = (next) => {
    setProjects(next);
    localStorage.setItem("projects", JSON.stringify(next));
  };

  function register(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const users = read("users");
    if (users.some((u) => u.email === email.trim())) {
      alert("This email is already registered!");
      return;
    }

    const newUser = { name: name.trim(), email: email.trim(), password };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("user", JSON.stringify(newUser));
    alert("Registration successful!");
    window.location.href = "/";
  }

  function login(e) {
    e.preventDefault();
    const users = read("users");
    let found = users.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (!found) {
      try {
        const old = JSON.parse(localStorage.getItem("user"));
        if (old?.email === email.trim() && old?.password === password) {
          found = old;
        }
      } catch {}
    }

    if (!found) {
      alert("Invalid email or password!");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(found));
    localStorage.setItem("loggedIn", "true");
    setUser(found);
    window.location.href = "/dashboard";
  }

  function adminLogin(e) {
    e.preventDefault();
    // Demo administrator account
    if (email.trim() !== "admin@taskflow.com" || password !== "admin123") {
      alert("Invalid admin email or password!");
      return;
    }

    const adminUser = { name: "Administrator", email };
    localStorage.setItem("loggedInAdmin", JSON.stringify(adminUser));
    setAdmin(adminUser);
    window.location.href = "/admin";
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInAdmin");
    setUser(null);
    setAdmin(null);
    window.location.href = "/";
  }

  function addTask(e) {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const next = [
      ...tasks,
      {
        id: Date.now(),
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        deadline: taskDeadline,
        completed: false,
        email: user.email,
      },
    ];

    saveTasks(next);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDeadline("");
  }

  function toggleTask(id) {
    saveTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }

  function deleteTask(id) {
    saveTasks(tasks.filter((t) => t.id !== id));
  }

  function addProject(e) {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    saveProjects([
      ...projects,
      {
        id: Date.now(),
        title: projectTitle.trim(),
        description: projectDescription.trim(),
        email: user.email,
      },
    ]);

    setProjectTitle("");
    setProjectDescription("");
  }

  const myTasks = tasks.filter((t) => t.email === user?.email);
  const myProjects = projects.filter((p) => p.email === user?.email);
  const completed = myTasks.filter((t) => t.completed).length;
  const pending = myTasks.length - completed;
  const progress = myTasks.length
    ? Math.round((completed / myTasks.length) * 100)
    : 0;

  // LOGIN AND REGISTRATION
  if (!user && !admin && (page === "login" || isRegister || isAdminLogin)) {
    const registerPage = isRegister;
    const adminPage = isAdminLogin;

    return (
      <div className="page">
        <div className="left">
          <div className="brand">
            <span className="logo">✓</span>
            <div><h1>TaskFlow</h1><p>Plan. Track. Achieve.</p></div>
          </div>
          <div className="illustration">
            <div className="task-board">
              <h3>{registerPage ? "Build Your Workflow" : "Today's Tasks"}</h3>
              {(registerPage
                ? ["✓ Create Tasks", "✓ Set Deadlines", "✓ Organize Projects", "○ Track Progress"]
                : ["✓ Complete Assignment", "✓ Team Meeting", "○ Project Work", "○ Review Tasks"]
              ).map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <h2>{registerPage ? "Everything in One Place" : "Your Tasks, Our Priority"}</h2>
          <p className="description">
            Stay organized, manage your projects, and turn your goals into progress.
          </p>
          <div className="features">
            <div><span>✓</span><p>Manage<br />Tasks</p></div>
            <div><span>📁</span><p>Handle<br />Projects</p></div>
            <div><span>📊</span><p>Track<br />Progress</p></div>
            <div><span>🔔</span><p>Get<br />Reminders</p></div>
          </div>
          <p className="quote">Small steps lead to big goals ♡</p>
        </div>

        <div className="right">
          <div className="form-box">
            <div className="mobile-brand">
              <span className="logo">✓</span><h1>TaskFlow</h1>
              <p>Plan. Track. Achieve.</p>
            </div>

            <h2>
              {registerPage ? "Create Account" : adminPage ? "Admin Login" : "Welcome Back!"}
            </h2>
            <p className="subtext">
              {registerPage ? "Start organizing your work today" : "Log in to continue your journey"}
            </p>

            <form onSubmit={registerPage ? register : adminPage ? adminLogin : login}>
              {registerPage && <>
                <label>Full Name</label>
                <div className="input-box"><span>👤</span>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
                </div>
              </>}

              <label>Email Address</label>
              <div className="input-box"><span>✉</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
              </div>

              <label>Password</label>
              <div className="input-box"><span>🔒</span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button type="button" className="eye" onClick={() => setShowPassword(!showPassword)}>◉</button>
              </div>

              {registerPage && <>
                <label>Confirm Password</label>
                <div className="input-box"><span>🔒</span>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
                </div>
              </>}

              {!registerPage && !adminPage && (
                <div className="options"><label className="remember"><input type="checkbox" /> Remember me</label></div>
              )}

              <button className="main-btn register-btn" type="submit">
                {registerPage ? "Create Account →" : "Login →"}
              </button>

              <p className="account">
                {registerPage ? "Already have an account? " : "Don't have an account? "}
                <a href={registerPage ? "/" : "/register"}>{registerPage ? "Login" : "Register"}</a>
              </p>

              {!registerPage && !adminPage && (
                <div className="admin-login-link">
                  <span>Are you an administrator?</span> <a href="/admin-login">Admin Login</a>
                </div>
              )}
              {adminPage && <p className="account"><a href="/">Back to User Login</a></p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  if (page === "admin" || admin) {
    if (!admin) {
      window.location.href = "/admin-login";
      return null;
    }

    const allUsers = read("users");
    return (
      <div className="dashboard">
        <aside className="sidebar">
          <div className="side-brand"><div className="logo">✓</div><div><h2>TaskFlow</h2><p>Admin Panel</p></div></div>
          <nav>
            <a className="active" href="/admin">▦ Dashboard</a>
            <a href="#users">♙ Users</a>
            <a href="#tasks">✓ Tasks</a>
            <a href="#projects">▣ Projects</a>
          </nav>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </aside>
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div><p className="welcome-small">Welcome back!</p><h1>Administrator</h1><p className="dashboard-subtext">TaskFlow overview and management</p></div>
          </header>
          <section className="stats">
            <div className="stat-card"><div className="stat-icon">♙</div><div><p>Total Users</p><h2>{allUsers.length}</h2></div></div>
            <div className="stat-card"><div className="stat-icon">✓</div><div><p>Total Tasks</p><h2>{tasks.length}</h2></div></div>
            <div className="stat-card"><div className="stat-icon">▣</div><div><p>Total Projects</p><h2>{projects.length}</h2></div></div>
          </section>
          <section className="content-panel" id="users"><h2>Registered Users</h2>
            {allUsers.map(u => <p className="task-row" key={u.email}>{u.name} — {u.email}</p>)}
          </section>
          <section className="content-panel" id="tasks"><h2>All Tasks</h2>
            {tasks.map(t => <p className="task-row" key={t.id}>{t.title} — {t.completed ? "Completed" : "Pending"}</p>)}
          </section>
          <section className="content-panel" id="projects"><h2>All Projects</h2>
            {projects.map(p => <p className="task-row" key={p.id}>{p.title}</p>)}
          </section>
        </main>
      </div>
    );
  }

  // USER DASHBOARD AND MODULES
  if (!user) {
    window.location.href = "/";
    return null;
  }

  const title = page === "tasks" ? "My Tasks"
    : page === "projects" ? "Projects"
    : page === "progress" ? "Progress"
    : "Dashboard";

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="side-brand"><div className="logo">✓</div><div><h2>TaskFlow</h2><p>Plan. Track. Achieve.</p></div></div>
        <nav>
          <a className={page === "dashboard" ? "active" : ""} href="/dashboard"><span>⌂</span> Dashboard</a>
          <a className={page === "tasks" ? "active" : ""} href="/tasks"><span>✓</span> My Tasks</a>
          <a className={page === "projects" ? "active" : ""} href="/projects"><span>▣</span> Projects</a>
          <a className={page === "progress" ? "active" : ""} href="/progress"><span>▥</span> Progress</a>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="welcome-small">Welcome back!</p>
            <h1>{user.name || "User"}</h1>
            <p className="dashboard-subtext">Here's what's happening with your tasks today.</p>
          </div>
          <div className="profile-circle">👤</div>
        </header>

        <section className="stats">
          <div className="stat-card"><div className="stat-icon">✓</div><div><p>Total Tasks</p><h2>{myTasks.length}</h2></div></div>
          <div className="stat-card"><div className="stat-icon">◷</div><div><p>Pending</p><h2>{pending}</h2></div></div>
          <div className="stat-card"><div className="stat-icon">★</div><div><p>Completed</p><h2>{completed}</h2></div></div>
        </section>

        <section className="content-panel">
          <h2>{title}</h2>

          {page === "dashboard" && <>
            <p>Your task completion: <strong>{progress}%</strong></p>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <p>Tasks: {myTasks.length} · Projects: {myProjects.length}</p>
          </>}

          {page === "tasks" && <>
            <form className="module-form" onSubmit={addTask}>
              <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title" required />
              <input value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Description (optional)" />
              <label>Deadline <input type="date" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} /></label>
              <button className="main-btn">Add Task +</button>
            </form>
            {myTasks.map(t => <div className="task-row" key={t.id}>
              <div><strong>{t.title}</strong><p>{t.description} {t.deadline && `· Due ${t.deadline}`}</p></div>
              <button onClick={() => toggleTask(t.id)}>{t.completed ? "Undo" : "Complete"}</button>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </div>)}
            {myTasks.length === 0 && <p>No tasks yet. Add your first task above!</p>}
          </>}

          {page === "projects" && <>
            <form className="module-form" onSubmit={addProject}>
              <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Project name" required />
              <input value={projectDescription} onChange={e => setProjectDescription(e.target.value)} placeholder="Project description" />
              <button className="main-btn">Add Project +</button>
            </form>
            {myProjects.map(p => <div className="task-row" key={p.id}><div><strong>{p.title}</strong><p>{p.description}</p></div></div>)}
            {myProjects.length === 0 && <p>No projects yet. Add your first project above!</p>}
          </>}

          {page === "progress" && <>
            <h3>{progress}% completed</h3>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <p>Total: {myTasks.length} · Completed: {completed} · Pending: {pending}</p>
          </>}
        </section>
      </main>
    </div>
  );
}

export default App;
