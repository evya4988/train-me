const express = require("express");
const app = express();

const { getAdmin, signup, login } = require("../controllers/admin");

app.post("/signup", signup);
app.post("/login", login);
app.get("/", getAdmin);

module.exports = app;
