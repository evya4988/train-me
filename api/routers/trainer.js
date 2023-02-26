const express = require("express");
const app = express();

const {
  signup,
  login,
  getAllTrainers,
  getTrainerById,
  getAllTrainersPartialDataForCustomers,
  updateTrainer,
  deleteTrainerById,
  getAllTrainersForContactUsForm
} = require("../controllers/trainer");

app.post("/signup", signup);
app.post("/login", login);
app.get("/:trainerId", getTrainerById);
app.get("/trainersData/forCustomers", getAllTrainersPartialDataForCustomers);
app.get("/", getAllTrainers);
app.get("/contactUs/trainers", getAllTrainersForContactUsForm);
app.patch("/:trainerId", updateTrainer);
app.delete("/:trainerId", deleteTrainerById);
module.exports = app;
