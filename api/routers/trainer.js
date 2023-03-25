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
  getAllTrainersForContactUsForm,
  rateTheTrainer_thumbsUp,
  rateTheTrainer_thumbsDown,
} = require("../controllers/trainer");

app.post("/signup", signup);
app.post("/login", login);
app.get("/:trainerId", getTrainerById);
app.get("/trainersData/forCustomers", getAllTrainersPartialDataForCustomers);
app.get("/", getAllTrainers);
app.get("/contactUs/trainers", getAllTrainersForContactUsForm);
app.patch("/:trainerId", updateTrainer);
app.delete("/:trainerId", deleteTrainerById);
app.post("/rateTrainerThumbsUp", rateTheTrainer_thumbsUp);
app.post("/rateTrainerThumbsDown", rateTheTrainer_thumbsDown);

module.exports = app;
