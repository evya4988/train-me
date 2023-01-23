const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  picture: 
    {
      image: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ,
  lessontime: { type: Number, required: true },
  cost: { type: Number, required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: 'Not yet registered for course'
    },
  ],
  // location: {}
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

