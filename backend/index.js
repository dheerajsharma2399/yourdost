const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

app.get('/todos', (req, res) => {
    const todos = readDB();
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const todos = readDB();
    const newTodo = {
        id: Date.now(),
        title: req.body.title,
        completed: false
    };
    if (!newTodo.title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    todos.push(newTodo);
    writeDB(todos);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const todos = readDB();
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    if (req.body.title === undefined || req.body.completed === undefined) {
        return res.status(400).json({ message: 'Title and completed status are required' });
    }
    todo.title = req.body.title;
    todo.completed = req.body.completed;
    writeDB(todos);
    res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
    let todos = readDB();
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    writeDB(todos);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
