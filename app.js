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

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
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
    const { title, description, completed } = req.body;
    
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
    
    // Create new task with next available ID
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
    const newTask = {
        id: maxId + 1,
        title,
        description,
        completed
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
    
    const { title, description, completed } = req.body;
    
    // Validate required fields
    if (title === undefined || description === undefined || completed === undefined) {
        return res.status(400).json({ error: 'Invalid data types' });
    }
    
    // Validate title and description are not empty
    if (typeof title !== 'string' || typeof description !== 'string' || title.trim() === '' || description.trim() === '') {
        return res.status(400).json({ error: 'Title and description cannot be empty' });
    }
    
    // Validate completed is a boolean
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid data types' });
    }
    
    // Update task
    tasks[taskIndex] = {
        id: taskId,
        title,
        description,
        completed
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