// Task data in JSON format
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM elements
const addTaskForm = document.getElementById('addTaskForm');
const taskNameInput = document.getElementById('taskName');
const taskDescriptionInput = document.getElementById('taskDescription');
const tasksContainer = document.getElementById('tasksContainer');
const showAllBtn = document.getElementById('showAll');
const showActiveBtn = document.getElementById('showActive');
const showCompletedBtn = document.getElementById('showCompleted');

// Event listeners
addTaskForm.addEventListener('submit', addTask);
showAllBtn.addEventListener('click', () => filterTasks('all'));
showActiveBtn.addEventListener('click', () => filterTasks('active'));
showCompletedBtn.addEventListener('click', () => filterTasks('completed'));

// Initialize the app
renderTasks();

function addTask(e) {
    e.preventDefault();
    
    const taskName = taskNameInput.value.trim();
    const taskDescription = taskDescriptionInput.value.trim();
    
    if (!taskName) return;
    
    const newTask = {
        id: Date.now().toString(),
        name: taskName,
        description: taskDescription,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Reset form
    taskNameInput.value = '';
    taskDescriptionInput.value = '';
    taskNameInput.focus();
}

function renderTasks() {
    tasksContainer.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '<p>No tasks found.</p>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-status">${task.completed ? 'Completed' : 'Pending'}</div>
                <div class="task-id">ID: ${task.id}</div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;
        
        tasksContainer.appendChild(taskElement);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', toggleTaskStatus);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

function toggleTaskStatus(e) {
    const taskId = e.target.getAttribute('data-id');
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(e) {
    const taskId = e.target.getAttribute('data-id');
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    showAllBtn.classList.remove('active');
    showActiveBtn.classList.remove('active');
    showCompletedBtn.classList.remove('active');
    
    if (filter === 'all') showAllBtn.classList.add('active');
    if (filter === 'active') showActiveBtn.classList.add('active');
    if (filter === 'completed') showCompletedBtn.classList.add('active');
    
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize filter buttons
filterTasks('all');