const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load tasks from task.json
let tasks = [];
try {
    const tasksData = fs.readFileSync(path.join(__dirname, 'task.json'), 'utf8');
    tasks = JSON.parse(tasksData).tasks;
} catch (err) {
    console.error('Error loading tasks:', err);
}

// GET /tasks - Get all tasks with optional filtering and sorting
app.get('/tasks', (req, res) => {
    let filteredTasks = tasks;
    
    // Filter by completion status
    if (req.query.completed !== undefined) {
        const completedFilter = req.query.completed === 'true';
        filteredTasks = filteredTasks.filter(t => t.completed === completedFilter);
    }
    
    // Sort by creation date if requested
    if (req.query.sortBy === 'createdAt') {
        filteredTasks = [...filteredTasks].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateA - dateB;
        });
    }
    
    res.status(200).json(filteredTasks);
});

// GET /tasks/priority/:level - Get tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const priorityLevel = req.params.level.toLowerCase();
    
    // Validate priority level
    if (!['low', 'medium', 'high'].includes(priorityLevel)) {
        return res.status(400).json({ error: 'Invalid priority level. Must be low, medium, or high' });
    }
    
    const priorityTasks = tasks.filter(t => t.priority === priorityLevel);
    res.status(200).json(priorityTasks);
});

// GET /tasks/:id - Get a specific task
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    
    // Validate required fields
    if (title === undefined || description === undefined || completed === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate title and description are not empty
    if (typeof title !== 'string' || typeof description !== 'string' || title.trim() === '' || description.trim() === '') {
        return res.status(400).json({ error: 'Title and description cannot be empty' });
    }
    
    // Validate completed is a boolean
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
    }
    
    // Validate priority if provided
    if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
    }
    
    // Create new task with next available ID
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
    const newTask = {
        id: maxId + 1,
        title,
        description,
        completed,
        priority: priority || 'medium',
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const { title, description, completed, priority } = req.body;
    
    // Validate required fields
    if (title === undefined || description === undefined || completed === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate title and description are not empty
    if (typeof title !== 'string' || typeof description !== 'string' || title.trim() === '' || description.trim() === '') {
        return res.status(400).json({ error: 'Title and description cannot be empty' });
    }
    
    // Validate completed is a boolean
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
    }
    
    // Validate priority if provided
    if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
    }
    
    // Update task preserving createdAt
    const existingTask = tasks[taskIndex];
    tasks[taskIndex] = {
        id: taskId,
        title,
        description,
        completed,
        priority: priority !== undefined ? priority : (existingTask.priority || 'medium'),
        createdAt: existingTask.createdAt || new Date().toISOString()
    };
    
    res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;