require('dotenv').config();

const connectDB = require('./database/db.js');
const express = require('express');
const cors = require('cors');
const logRequest = require('./logger');
const validateTodo = require('./validator.js');
const validatePatchTodo = require('./validatePatch.js');
const errorHandler = require('./errorHandler.js');
const Todo = require("./model/todo.model.js");
const dns = require('dns');
const { any } = require('joi');

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(logRequest);


app.get('/todos', async (req, res, next) => {

    const todos = await Todo.find({});
    res.status(200).json(todos);
});

app.get('/todos/completed', async (req, res, next) => {
    try {
        const completed = await Todo.find({ completed: true })
    res.json(completed);
    } catch (error) {
        next(error);
    }
});

app.get('/todos/:id' , async (req, res, next) => {
    try { 
        
        const todo = await Todo.findById(req.params.id)

        if (!todo) {
           return res.status(404).json({ message: 'Todo not found' });
        }

    res.status(200).json(todo)
    } catch (error) {
        next(error);
    }
});

app.post('/todos', validateTodo, async (req, res, next) => {
    try {
const { task, completed } = req.body;

const newTodo = new Todo({
    task,
    completed,
});

await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});

app.patch("/todos/:id", validatePatchTodo, async (req, res, next) => {
    try {
     const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true
     })
      if (!todo) {
           return res.status(404).json({ message: 'Todo not found' });
        }

res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
});

app.delete("/todos/:id", async (req, res, next) => {
   try {
     
    const todo = await Todo.findByIdAndDelete(req.params.id)
    if (!todo) {
           return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({message: `Todo ${req.params.id} deleted`})
   } catch (error) {
    next(error);
   }
});


app.use(errorHandler);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`APP is listening on Port ${PORT}`);
});



