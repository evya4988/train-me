const express = require("express");
const app = express();

const {
  signup,
  login,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainerById,
} = require("../controllers/trainer");

app.post("/signup", signup);
app.post("/login", login);
app.get("/", getAllTrainers);
app.get("/:trainerId", getTrainerById);
app.patch("/:trainerId", updateTrainer);
app.delete("/:trainerId", deleteTrainerById);
module.exports = app;
