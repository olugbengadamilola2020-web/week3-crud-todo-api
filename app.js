require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logRequest = require('./logger');
const validateTodo = require('./validator.js');
const validatePatchTodo = require('./validatePatch.js');
const errorHandler = require('./errorHandler.js');
const { any } = require('joi');
const app = express();
app.use(express.json());

app.use(cors());

app.use(logRequest);

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false},
    { id :2, task: 'Build CRUD API', completed: false},
];

app.get('/todos', (req, res, next) => {
    res.status(200).json(todos);
});

app.get('/todos/active', (req, res, next) => {
    const activeTodos = todo.filter((td) => td.completed === false);

    res.status(200).json(activeTodos);
});

app.get('/todos/:id' , (req, res, next) => {
    try { 
        const id = parseInt(req.params.id);
        const todo = todos.find((t) => t.id === id);

        if (!todo) {
           return res.status(404).json({ message: 'Todo not found' });
        }

    res.status(200).json(todo)
    } catch (error) {
        next(error);
    }
});

app.post('/todos', validateTodo, (req, res, next) => {
    try {
        const { task  } = req.body;

    if (!task) {
        return res.status(400).json({ message: 'Please send the task' });
    }

    const newTodo = { id: todos.length + 1, ...req.body };
    todos.push(newTodo);
    res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});

app.patch("/todos/:id", validatePatchTodo, (req, res, next) => {
    try {
        const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
Object.assign(todo, req.body); 
res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
});

app.delete("/todos/:id", (req, res, next) => {
   try {
     const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);
    if (todos.length === initialLength) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
   } catch (error) {
    next(error);
   }
});

app.get('/todos/completed', (req, res, next) => {
    try {
        const completed = todos.filter((t) => t.completed);
    res.json(completed);
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`APP is listening on Port ${PORT}`);
});



