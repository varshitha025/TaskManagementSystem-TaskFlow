/* =====================================================
   TASKFLOW - COMPLETE JAVASCRIPT
   ===================================================== */


/* =====================================================
   PASSWORD TOGGLE
   ===================================================== */

function togglePassword(id) {

    let input = document.getElementById(id);

    if (!input) {
        return;
    }

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


/* =====================================================
   REGISTER
   ===================================================== */

function register(event) {

    event.preventDefault();

    let name =
        document.getElementById("name").value.trim();

    let email =
        document.getElementById("email").value.trim();

    let password =
        document.getElementById("password").value;

    let confirmPassword =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match!");
        return;

    }


    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    let existingUser =
        users.find(function(user) {

            return user.email === email;

        });


    if (existingUser) {

        alert("This email is already registered!");
        return;

    }


    let user = {

        name: name,
        email: email,
        password: password

    };


    users.push(user);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    /* Keep old user storage working too */

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    alert("Registration successful!");

    window.location.href = "index.html";
}


/* =====================================================
   LOGIN
   ===================================================== */

function login(event) {

    event.preventDefault();

    let email =
        document.getElementById("loginEmail").value.trim();

    let password =
        document.getElementById("loginPassword").value;


    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    let user =
        users.find(function(user) {

            return (
                user.email === email &&
                user.password === password
            );

        });


    /* Check old saved user also */

    if (!user) {

        let oldUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        if (
            oldUser &&
            oldUser.email === email &&
            oldUser.password === password
        ) {

            user = oldUser;

        }

    }


    if (!user) {

        alert("Invalid email or password!");
        return;

    }


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    localStorage.setItem(
        "loggedIn",
        "true"
    );


    window.location.href =
        "user-dashboard.html";
}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    let overlay = document.createElement("div");

    overlay.className = "logout-confirm-overlay";

    overlay.innerHTML = `

        <div class="logout-confirm-box">

            <div class="logout-confirm-icon">
                ✓
            </div>

            <h2>
                TaskFlow
            </h2>

            <p class="logout-question">
                Do you want to logout?
            </p>

            <p class="logout-message">
                You can login again anytime.
            </p>

            <div class="logout-buttons">

                <button
                    type="button"
                    class="logout-no">

                    No

                </button>

                <button
                    type="button"
                    class="logout-yes">

                    Yes

                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);


    /* NO */

    overlay
        .querySelector(".logout-no")
        .addEventListener("click", function() {

            overlay.remove();

        });


    /* YES */

    overlay
        .querySelector(".logout-yes")
        .addEventListener("click", function() {

            localStorage.removeItem("loggedInUser");

            localStorage.removeItem("loggedIn");

            window.location.href = "index.html";

        });

}


/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

function resetPassword(event) {

    event.preventDefault();


    let email =
        document.getElementById("resetEmail").value.trim();


    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    let user =
        users.find(function(user) {

            return user.email === email;

        });


    if (!user) {

        alert(
            "No account found with this email."
        );

        return;

    }


    alert(
        "Password reset request received. " +
        "For this project demo, please contact the administrator."
    );

}


/* =====================================================
   ADMIN LOGIN
   ===================================================== */

function adminLogin(event) {

    event.preventDefault();


    let email =
        document.getElementById("adminEmail").value.trim();

    let password =
        document.getElementById("adminPassword").value;


    if (
        email === "admin@taskflow.com" &&
        password === "admin123"
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        window.location.href =
            "admin-dashboard.html";

    } else {

        alert(
            "Invalid admin email or password!"
        );

    }

}


/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

function adminLogout() {

    localStorage.removeItem(
        "adminLoggedIn"
    );


    window.location.href =
        "admin-login.html";
}


/* =====================================================
   SHOW TASK FORM
   ===================================================== */

function showTaskForm() {

    let form =
        document.getElementById("taskForm");


    if (form) {

        form.style.display = "block";

    }

}


/* =====================================================
   HIDE TASK FORM
   ===================================================== */

function hideTaskForm() {

    let form =
        document.getElementById("taskForm");


    if (form) {

        form.style.display = "none";

    }

}


/* =====================================================
   ADD TASK
   ===================================================== */

function addTask() {

    let title =
        document.getElementById("taskTitle").value.trim();

    let date =
        document.getElementById("taskDate").value;

    let priority =
        document.getElementById("taskPriority").value;

    let projectSelect =
        document.getElementById("taskProject");


    if (
        title === "" ||
        date === "" ||
        projectSelect.value === ""
    ) {

        alert(
            "Please enter the task title, deadline and project."
        );

        return;

    }


    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    let project =
        projects.find(function(project) {

            return String(project.id) ===
                   String(projectSelect.value);

        });


    if (!project) {

        alert("Please select a valid project.");
        return;

    }


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    let task = {

        id: Date.now(),

        title: title,

        date: date,

        priority: priority,

        projectId: project.id,

        projectName: project.name,

        completed: false

    };


    tasks.push(task);


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    document.getElementById(
        "taskTitle"
    ).value = "";


    document.getElementById(
        "taskDate"
    ).value = "";


    document.getElementById(
        "taskPriority"
    ).value = "Low";


    document.getElementById(
        "taskProject"
    ).value = "";


    hideTaskForm();

    displayTasks();

    displayProjects();

    updateStats();

    showDeadlineNotifications();

}


/* =====================================================
   DISPLAY TASKS
   ===================================================== */

function displayTasks() {

    let taskList =
        document.getElementById("taskList");


    if (!taskList) {
        return;
    }


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    taskList.innerHTML = "";


    if (tasks.length === 0) {

        taskList.innerHTML = `

            <div class="empty-task">

                <div>✓</div>

                <h3>No tasks yet</h3>

                <p>
                    Click "+ Add Task" to create your first task.
                </p>

            </div>

        `;

        return;

    }


    tasks.forEach(function(task) {

        let taskItem =
            document.createElement("div");


        taskItem.className =
            "task-item";


        taskItem.innerHTML = `

            <div>

                <h3>
                    ${task.title}
                </h3>

                <p>
                    Due: ${task.date}
                </p>

                <span class="priority">
                    ${task.priority}
                </span>

                <span class="task-project">
                    ${task.projectName || "No Project"}
                </span>

            </div>


            <div class="task-buttons">

                <button
                    type="button"
                    class="edit-btn"
                    onclick="editTask(${task.id})">

                    Edit

                </button>


                <button
                    type="button"
                    onclick="completeTask(${task.id})">

                    ${
                        task.completed
                        ? "Completed ✓"
                        : "Mark Complete"
                    }

                </button>


                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    Delete

                </button>

            </div>

        `;


        if (task.completed) {

            taskItem.classList.add(
                "task-completed"
            );

        }


        taskList.appendChild(taskItem);

    });


    updateStats();

}


/* =====================================================
   COMPLETE TASK
   ===================================================== */

function completeTask(id) {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    tasks.forEach(function(task) {

        if (String(task.id) === String(id)) {

            task.completed = true;

        }

    });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayTasks();

    displayProjects();

    updateStats();

    showDeadlineNotifications();

}


/* =====================================================
   EDIT TASK
   ===================================================== */

function editTask(id) {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    let task =
        tasks.find(function(task) {

            return String(task.id) ===
                   String(id);

        });


    if (!task) {
        return;
    }


    let newTitle =
        prompt(
            "Enter new task title:",
            task.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {

        return;

    }


    task.title =
        newTitle.trim();


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayTasks();

    showDeadlineNotifications();

}


/* =====================================================
   DELETE TASK
   ===================================================== */

function deleteTask(id) {

    let overlay =
        document.createElement("div");


    overlay.className =
        "task-confirm-overlay";


    overlay.innerHTML = `

        <div class="task-confirm-box">

            <div class="confirm-logo">
                ✓
            </div>

            <h2>
                TaskFlow
            </h2>

            <p class="confirm-question">
                Delete this task?
            </p>

            <p class="confirm-text">
                This action cannot be undone.
            </p>

            <div class="confirm-buttons">

                <button
                    type="button"
                    class="confirm-cancel">

                    Cancel

                </button>


                <button
                    type="button"
                    class="confirm-delete">

                    Delete

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    overlay
        .querySelector(".confirm-cancel")
        .onclick = function() {

            overlay.remove();

        };


    overlay
        .querySelector(".confirm-delete")
        .onclick = function() {

            let tasks =
                JSON.parse(
                    localStorage.getItem("tasks")
                ) || [];


            tasks =
                tasks.filter(function(task) {

                    return String(task.id) !==
                           String(id);

                });


            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            overlay.remove();


            displayTasks();

            displayProjects();

            updateStats();

            showDeadlineNotifications();

        };

}


/* =====================================================
   SHOW PROJECT FORM
   ===================================================== */

function showProjectForm() {

    let form =
        document.getElementById("projectForm");


    if (form) {

        form.style.display =
            "block";

    }

}


/* =====================================================
   HIDE PROJECT FORM
   ===================================================== */

function hideProjectForm() {

    let form =
        document.getElementById("projectForm");


    if (form) {

        form.style.display =
            "none";

    }

}


/* =====================================================
   ADD PROJECT
   ===================================================== */

function addProject() {

    let name =
        document.getElementById(
            "projectName"
        ).value.trim();


    let description =
        document.getElementById(
            "projectDescription"
        ).value.trim();


    if (name === "") {

        alert(
            "Please enter a project name."
        );

        return;

    }


    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    projects.push({

        id: Date.now(),

        name: name,

        description: description

    });


    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );


    document.getElementById(
        "projectName"
    ).value = "";


    document.getElementById(
        "projectDescription"
    ).value = "";


    hideProjectForm();

    displayProjects();

    loadProjectOptions();

}


/* =====================================================
   DISPLAY PROJECTS
   ===================================================== */

function displayProjects() {

    let projectList =
        document.getElementById(
            "projectList"
        );


    if (!projectList) {
        return;
    }


    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    projectList.innerHTML = "";


    if (projects.length === 0) {

        projectList.innerHTML = `

            <div class="empty-task">

                <div>▣</div>

                <h3>No projects yet</h3>

                <p>
                    Create a project to organize your tasks.
                </p>

            </div>

        `;

        loadProjectOptions();

        return;

    }


    projects.forEach(function(project) {

        let projectTasks =
            tasks.filter(function(task) {

                return String(task.projectId) ===
                       String(project.id);

            });


        let completed =
            projectTasks.filter(function(task) {

                return task.completed;

            }).length;


        let totalTasks =
            projectTasks.length;


        let percentage = 0;


        if (totalTasks > 0) {

            percentage =
                Math.round(
                    (completed / totalTasks) * 100
                );

        }


        let card =
            document.createElement("div");


        card.className =
            "project-card";


        card.innerHTML = `

            <h3>
                ${project.name}
            </h3>

            <p>
                ${
                    project.description ||
                    "No description added."
                }
            </p>


            <div class="project-progress-info">

                <span>
                    Progress
                </span>

                <strong>
                    ${percentage}%
                </strong>

            </div>


            <div class="project-progress-bar">

                <div
                    class="project-progress-fill"
                    style="width:${percentage}%">
                </div>

            </div>


            <p class="project-task-count">

                ${completed} of ${totalTasks}
                tasks completed

            </p>


            <div class="project-card-buttons">

                <button
                    type="button"
                    class="project-edit"
                    onclick="editProject(${project.id})">

                    Edit

                </button>


                <button
                    type="button"
                    class="project-delete"
                    onclick="deleteProject(${project.id})">

                    Delete

                </button>

            </div>

        `;


        projectList.appendChild(card);

    });


    loadProjectOptions();

}


/* =====================================================
   EDIT PROJECT
   ===================================================== */

function editProject(id) {

    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    let project =
        projects.find(function(project) {

            return String(project.id) ===
                   String(id);

        });


    if (!project) {
        return;
    }


    let newName =
        prompt(
            "Enter new project name:",
            project.name
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;

    }


    let oldName =
        project.name;


    project.name =
        newName.trim();


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    tasks.forEach(function(task) {

        if (
            String(task.projectId) ===
            String(id)
        ) {

            task.projectName =
                project.name;

        }

    });


    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayProjects();

    displayTasks();

}


/* =====================================================
   DELETE PROJECT
   ===================================================== */

function deleteProject(id) {

    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    let project =
        projects.find(function(project) {

            return String(project.id) ===
                   String(id);

        });


    if (!project) {
        return;
    }


    let confirmDelete =
        confirm(
            "Delete project '" +
            project.name +
            "' and its tasks?"
        );


    if (!confirmDelete) {
        return;
    }


    projects =
        projects.filter(function(project) {

            return String(project.id) !==
                   String(id);

        });


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    tasks =
        tasks.filter(function(task) {

            return String(task.projectId) !==
                   String(id);

        });


    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayProjects();

    displayTasks();

    loadProjectOptions();

    updateStats();

}


/* =====================================================
   LOAD PROJECT OPTIONS
   ===================================================== */

function loadProjectOptions() {

    let select =
        document.getElementById(
            "taskProject"
        );


    if (!select) {
        return;
    }


    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    select.innerHTML = `

        <option value="">
            Select Project
        </option>

    `;


    projects.forEach(function(project) {

        let option =
            document.createElement("option");


        option.value =
            project.id;


        option.textContent =
            project.name;


        select.appendChild(option);

    });

}


/* =====================================================
   UPDATE STATISTICS
   ===================================================== */

function updateStats() {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    let completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    let pending =
        tasks.length - completed;


    let totalElement =
        document.getElementById(
            "totalTasks"
        );


    let pendingElement =
        document.getElementById(
            "pendingTasks"
        );


    let completedElement =
        document.getElementById(
            "completedTasks"
        );


    if (totalElement) {

        totalElement.textContent =
            tasks.length;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    let percentage = 0;


    if (tasks.length > 0) {

        percentage =
            Math.round(
                (completed / tasks.length) * 100
            );

    }


    let progressText =
        document.getElementById(
            "progressPercentage"
        );


    let progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressText) {

        progressText.textContent =
            percentage + "%";

    }


    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }

}


/* =====================================================
   DEADLINE POPUP
   ===================================================== */

function showDeadlineNotifications() {

    let notificationBox =
        document.getElementById(
            "deadlineNotifications"
        );


    if (!notificationBox) {
        return;
    }


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    let today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let upcomingTasks =
        tasks.filter(function(task) {

            if (task.completed) {
                return false;
            }


            let deadline =
                new Date(task.date);


            deadline.setHours(
                0,
                0,
                0,
                0
            );


            let days =
                (
                    deadline - today
                ) /
                (1000 * 60 * 60 * 24);


            return (
                days >= 0 &&
                days <= 2
            );

        });


    /* No upcoming deadline */

    if (upcomingTasks.length === 0) {

        notificationBox.innerHTML = "";

        notificationBox.style.display =
            "none";

        return;

    }


    let task =
        upcomingTasks[0];


    let deadline =
        new Date(task.date);


    deadline.setHours(
        0,
        0,
        0,
        0
    );


    let days =
        Math.round(
            (
                deadline - today
            ) /
            (1000 * 60 * 60 * 24)
        );


    let dueText;


    if (days === 0) {

        dueText =
            "Due today";

    } else if (days === 1) {

        dueText =
            "Due tomorrow";

    } else {

        dueText =
            "Due in " +
            days +
            " days";

    }


    notificationBox.innerHTML = `

        <div class="deadline-popup">

            <div class="deadline-popup-icon">
                🔔
            </div>

            <h2>
                Deadline Reminder
            </h2>

            <p class="deadline-popup-description">

                You have an upcoming task deadline.

            </p>


            <div class="deadline-task">

                <h3>
                    ${task.title}
                </h3>

                <p>
                    ${dueText} • ${task.date}
                </p>

            </div>


            <div class="deadline-popup-buttons">

                <button
                    type="button"
                    id="closeDeadlineButton"
                    class="deadline-close-btn">

                    Close

                </button>


                <button
                    type="button"
                    id="viewDeadlineButton"
                    class="deadline-view-btn">

                    View Tasks

                </button>

            </div>

        </div>

    `;


    /* Show overlay ONLY when popup exists */

    notificationBox.style.display =
        "flex";


    /* CLOSE */

    document
        .getElementById(
            "closeDeadlineButton"
        )
        .onclick = function() {

            notificationBox.innerHTML =
                "";

            notificationBox.style.display =
                "none";

        };


    /* VIEW TASKS */

    document
        .getElementById(
            "viewDeadlineButton"
        )
        .onclick = function() {

            notificationBox.innerHTML =
                "";

            notificationBox.style.display =
                "none";


            let taskSection =
                document.getElementById(
                    "tasks"
                );


            if (taskSection) {

                taskSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        };

}


/* =====================================================
   LOAD USER DASHBOARD
   ===================================================== */

function loadDashboard() {

    let user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (!user) {

        /* Support old login system */

        user =
            JSON.parse(
                localStorage.getItem("user")
            );

    }


    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    let userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            user.name;

    }


    displayTasks();

    displayProjects();

    loadProjectOptions();

    updateStats();

    showDeadlineNotifications();

}


/* =====================================================
   LOAD ADMIN DASHBOARD
   ===================================================== */

function loadAdminDashboard() {

    let adminLoggedIn =
        localStorage.getItem(
            "adminLoggedIn"
        );


    if (adminLoggedIn !== "true") {

        window.location.href =
            "admin-login.html";

        return;

    }


    displayAdminUsers();

    displayAdminTasks();

    displayAdminProjects();

    updateAdminStats();

}


/* =====================================================
   ADMIN STATISTICS
   ===================================================== */

function updateAdminStats() {

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];


    let projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];


    let userElement =
        document.getElementById(
            "adminUsers"
        );


    let taskElement =
        document.getElementById(
            "adminTasks"
        );


    let projectElement =
        document.getElementById(
            "adminProjects"
        );


    if (userElement) {

        userElement.textContent =
            users.length;

    }


    if (taskElement) {

        taskElement.textContent =
            tasks.length;

    }


    if (projectElement) {

        projectElement.textContent =
            projects.length;

    }

}


/* =====================================================
   ADMIN USERS
   ===================================================== */

function displayAdminUsers() {

    let userList =
        document.getElementById(
            "userList"
        );


    if (!userList) {
        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    userList.innerHTML = "";


    if (users.length === 0) {

        userList.innerHTML =
            "<p>No registered users.</p>";

        return;

    }


    users.forEach(function(user, index) {

        let item =
            document.createElement("div");


        item.className =
            "admin-list-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${user.name}
                </strong>

                <p>
                    ${user.email}
                </p>

            </div>


            <button
                type="button"
                onclick="deleteUser(${index})">

                Delete

            </button>

        `;


        userList.appendChild(item);

    });

}


/* =====================================================
   DELETE USER
   ===================================================== */

function deleteUser(index) {

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    if (
        !confirm(
            "Delete this user?"
        )
    ) {

        return;

    }


    users.splice(
        index,
        1
    );


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    displayAdminUsers();

    updateAdminStats();

}


/* =====================================================
   ADMIN TASKS
   ===================================================== */

function displayAdminTasks() {

    let taskList = document.getElementById("adminTaskList");

    if (!taskList) {
        return;
    }

    let tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML =
            "<p>No tasks available.</p>";

        return;
    }

    tasks.forEach(function(task, index) {

        let item = document.createElement("div");

        item.className = "admin-list-item";

        item.innerHTML = `

            <div>

                <strong>
                    ${task.title}
                </strong>

                <p>
                    Project:
                    ${task.projectName || "No Project"}
                </p>

                <p>
                    Deadline:
                    ${task.date}
                </p>

                <p>
                    Status:
                    ${task.completed ? "Completed" : "Pending"}
                </p>

            </div>

            <div class="admin-task-actions">

                <button
                    type="button"
                    class="admin-complete-btn"
                    onclick="toggleAdminTask(${index})">

                    ${task.completed ? "Pending" : "Complete"}

                </button>

                <button
                    type="button"
                    class="admin-edit-btn"
                    onclick="editAdminTask(${index})">

                    Edit

                </button>

                <button
                    type="button"
                    class="admin-delete-btn"
                    onclick="deleteAdminTask(${index})">

                    Delete

                </button>

            </div>

        `;

        taskList.appendChild(item);

    });

}

function toggleAdminTask(index) {

    let tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    if (!tasks[index]) {
        return;
    }

    tasks[index].completed =
        !tasks[index].completed;

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    displayAdminTasks();

    updateAdminStats();
}


function editAdminTask(index) {

    let tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    if (!tasks[index]) return;

    let task = tasks[index];

    let overlay = document.createElement("div");

    overlay.className = "admin-modal-overlay";

    overlay.innerHTML = `
        <div class="admin-modal">

            <button
                type="button"
                class="admin-modal-close">
                ×
            </button>

            <div class="admin-modal-icon">
                ✓
            </div>

            <h2>Edit Task</h2>

            <p class="admin-modal-subtitle">
                Update the task details below.
            </p>

            <div class="admin-modal-form">

                <label>Task Title</label>

                <input
                    type="text"
                    id="adminEditTaskTitle"
                    value="${task.title || ""}"
                >

                <label>Deadline</label>

                <input
                    type="date"
                    id="adminEditTaskDate"
                    value="${task.date || ""}"
                >

                <div class="admin-modal-buttons">

                    <button
                        type="button"
                        class="admin-modal-cancel">
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="admin-modal-save">
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".admin-modal-close")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-modal-cancel")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-modal-save")
        .addEventListener("click", function() {

            let title =
                document.getElementById(
                    "adminEditTaskTitle"
                ).value.trim();

            let date =
                document.getElementById(
                    "adminEditTaskDate"
                ).value;

            if (title === "") {
                alert("Task title cannot be empty.");
                return;
            }

            tasks[index].title = title;
            tasks[index].date = date;

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            overlay.remove();

            displayAdminTasks();
        });
}


function deleteAdminTask(index) {

    let tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    if (!tasks[index]) return;

    let overlay = document.createElement("div");

    overlay.className = "admin-modal-overlay";

    overlay.innerHTML = `
        <div class="admin-modal delete-modal">

            <button
                type="button"
                class="admin-modal-close">
                ×
            </button>

            <div class="admin-delete-icon">
                !
            </div>

            <h2>Delete Task?</h2>

            <p class="admin-modal-subtitle">
                Are you sure you want to delete
                <strong>${tasks[index].title}</strong>?
            </p>

            <p class="admin-warning">
                This action cannot be undone.
            </p>

            <div class="admin-modal-buttons">

                <button
                    type="button"
                    class="admin-modal-cancel">
                    Cancel
                </button>

                <button
                    type="button"
                    class="admin-delete-confirm">
                    Delete
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".admin-modal-close")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-modal-cancel")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-delete-confirm")
        .addEventListener("click", function() {

            tasks.splice(index, 1);

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            overlay.remove();

            displayAdminTasks();
            updateAdminStats();
        });
}


/* =====================================================
   ADMIN PROJECTS
   ===================================================== */

function displayAdminProjects() {

    let projectList =
        document.getElementById("adminProjectList");

    if (!projectList) {
        return;
    }

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    projectList.innerHTML = "";

    if (projects.length === 0) {

        projectList.innerHTML =
            "<p>No projects available.</p>";

        return;
    }

    projects.forEach(function(project, index) {

        let item = document.createElement("div");

        item.className = "admin-list-item";

        item.innerHTML = `

            <div>

                <strong>
                    ${project.name}
                </strong>

                <p>
                    ${project.description || "No description"}
                </p>

            </div>

            <div class="admin-project-actions">

                <button
                    type="button"
                    class="admin-edit-btn"
                    onclick="editAdminProject(${index})">

                    Edit

                </button>

                <button
                    type="button"
                    class="admin-delete-btn"
                    onclick="deleteAdminProject(${index})">

                    Delete

                </button>

            </div>

        `;

        projectList.appendChild(item);

    });

}

function editAdminProject(index) {

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    if (!projects[index]) return;

    let project = projects[index];

    let overlay = document.createElement("div");

    overlay.className = "admin-modal-overlay";

    overlay.innerHTML = `
        <div class="admin-modal">

            <button
                type="button"
                class="admin-modal-close">
                ×
            </button>

            <div class="admin-modal-icon">
                ▣
            </div>

            <h2>Edit Project</h2>

            <p class="admin-modal-subtitle">
                Update the project details below.
            </p>

            <div class="admin-modal-form">

                <label>Project Name</label>

                <input
                    type="text"
                    id="adminEditProjectName"
                    value="${project.name || ""}"
                >

                <label>Description</label>

                <textarea
                    id="adminEditProjectDescription"
                    rows="4"
                >${project.description || ""}</textarea>

                <div class="admin-modal-buttons">

                    <button
                        type="button"
                        class="admin-modal-cancel">
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="admin-modal-save">
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".admin-modal-close")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-modal-cancel")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-modal-save")
        .addEventListener("click", function() {

            let name =
                document.getElementById(
                    "adminEditProjectName"
                ).value.trim();

            let description =
                document.getElementById(
                    "adminEditProjectDescription"
                ).value.trim();

            if (name === "") {
                alert("Project name cannot be empty.");
                return;
            }

            projects[index].name = name;
            projects[index].description = description;

            localStorage.setItem(
                "projects",
                JSON.stringify(projects)
            );

            overlay.remove();

            displayAdminProjects();
        });
}


function deleteAdminProject(index) {

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    if (!projects[index]) return;

    let overlay = document.createElement("div");

    overlay.className = "admin-modal-overlay";

    overlay.innerHTML = `
        <div class="admin-modal delete-modal">

            <button
                type="button"
                class="admin-modal-close">
                ×
            </button>

            <div class="admin-delete-icon">
                !
            </div>

            <h2>Delete Project?</h2>

            <p class="admin-modal-subtitle">
                Are you sure you want to delete
                <strong>${projects[index].name}</strong>?
            </p>

            <p class="admin-warning">
                This action cannot be undone.
            </p>

            <div class="admin-modal-buttons">

                <button
                    type="button"
                    class="admin-modal-cancel">
                    Cancel
                </button>

                <button
                    type="button"
                    class="admin-delete-confirm">
                    Delete
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".admin-modal-close")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-modal-cancel")
        .addEventListener("click", function() {
            overlay.remove();
        });

    overlay.querySelector(".admin-delete-confirm")
        .addEventListener("click", function() {

            projects.splice(index, 1);

            localStorage.setItem(
                "projects",
                JSON.stringify(projects)
            );

            overlay.remove();

            displayAdminProjects();
            updateAdminStats();
        });
}
/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        let page =
            window.location.pathname;


        /*
           ONLY run dashboard code
           on dashboard pages.
        */

        if (
            page.includes(
                "user-dashboard.html"
            )
        ) {

            loadDashboard();

        }


        if (
            page.includes(
                "admin-dashboard.html"
            )
        ) {

            loadAdminDashboard();

        }

    }
);
/* =====================================================
   SEPARATE USER PAGES
   ===================================================== */

function checkUserLogin() {

    let user =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!user) {

        window.location.href = "index.html";

        return null;
    }

    return user;
}


/* MY TASKS PAGE */

function loadTasksPage() {

    let user = checkUserLogin();

    if (!user) {
        return;
    }

    displayTasks();
    loadProjectOptions();
    showDeadlineNotifications();
}


/* PROJECTS PAGE */

function loadProjectsPage() {

    let user = checkUserLogin();

    if (!user) {
        return;
    }

    displayProjects();
}


/* PROGRESS PAGE */

function loadProgressPage() {

    let user = checkUserLogin();

    if (!user) {
        return;
    }

    updateStats();
}


/* PAGE LOADING */

document.addEventListener("DOMContentLoaded", function() {

    let page =
        window.location.pathname;

    if (
        page.includes("user-dashboard.html")
    ) {

        loadDashboard();

    }

    else if (
        page.includes("my-tasks.html")
    ) {

        loadTasksPage();

    }

    else if (
        page.includes("projects.html")
    ) {

        loadProjectsPage();

    }

    else if (
        page.includes("progress.html")
    ) {

        loadProgressPage();

    }

});
/* ============================= */
/* PROFILE */
/* ============================= */

function openProfile() {

    let user =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!user) {
        return;
    }

    document.getElementById("profileName").textContent =
        user.name || "User";

    document.getElementById("profileEmail").textContent =
        user.email || "";

    document.getElementById("profileNameDetail").textContent =
        user.name || "User";

    document.getElementById("profileEmailDetail").textContent =
        user.email || "";

    let savedImage =
        localStorage.getItem("profileImage");

    let picture =
        document.getElementById("profilePicture");

    if (savedImage) {

        picture.innerHTML =
            `<img src="${savedImage}" alt="Profile Picture">`;

    } else {

        picture.innerHTML = "👤";

    }

    document.getElementById("profileOverlay").style.display =
        "flex";
}


/* CLOSE PROFILE */

function closeProfile() {

    document.getElementById("profileOverlay").style.display =
        "none";

}


/* CHANGE PROFILE PICTURE */

function changeProfilePicture(event) {

    let file =
        event.target.files[0];

    if (!file) {
        return;
    }

    let reader =
        new FileReader();

    reader.onload = function(e) {

        localStorage.setItem(
            "profileImage",
            e.target.result
        );

        document.getElementById("profilePicture").innerHTML =
            `<img src="${e.target.result}" alt="Profile Picture">`;
            updateProfileCircle();

    };

    reader.readAsDataURL(file);

}


/* CHANGE PASSWORD */

function changePassword() {

    let newPassword =
        document.getElementById("newPassword").value;

    let confirmPassword =
        document.getElementById("confirmNewPassword").value;

    if (
        newPassword === "" ||
        confirmPassword === ""
    ) {

        alert("Please enter and confirm your new password.");

        return;
    }

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    let loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!loggedInUser) {
        return;
    }


    /* Update logged-in user */

    loggedInUser.password =
        newPassword;

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
    );


    /* Update users list */

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    users =
        users.map(function(user) {

            if (
                user.email ===
                loggedInUser.email
            ) {

                user.password =
                    newPassword;
            }

            return user;

        });


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";


    alert("Password changed successfully.");

}
/* ============================= */
/* DASHBOARD PROFILE PICTURE */
/* ============================= */

function updateProfileCircle() {

    let profileCircle =
        document.querySelector(".profile-circle");

    if (!profileCircle) {
        return;
    }

    let savedImage =
        localStorage.getItem("profileImage");

    if (savedImage) {

        profileCircle.innerHTML =
            `<img src="${savedImage}" alt="Profile Picture">`;

    } else {

        profileCircle.innerHTML = "👤";

    }

}
/* Update when dashboard opens */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateProfileCircle();

    }
);