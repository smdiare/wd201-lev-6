/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path=require("path");

app.use(bodyParser.json());
app.set("view engine", "ejs");


app.get("/", async function (request, response) {
  const allTodos = await Todo.getTodo();
  const s=await Todo.overdue();
  const m=await Todo.dueToday();
  const d=await Todo.dueLater();
  if(request.accepts("html")){
    response.render("index", {allTodos,x:s,y:m,z:d});
  }else{
    response.json({allTodos})
  }
});

app.use(express.static(path.join(__dirname,'public')));


app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...",request.body);
  try {
    const todoItems = await Todo.getTodo();
    response.json(todoItems);
    }
  catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    const deletedTodo = await Todo.deleteTodo(request.params.id);
    return response.send(deletedTodo ? true : false);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

module.exports = app;