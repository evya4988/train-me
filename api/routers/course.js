const express = require("express");
const app = express();

const {
    addNewCourse,
    updateCourse,
    // getAllCourses,
    getCourseById,
    deleteCourseById,
    getCourseCustomersData,
    getAllAdminCourses,
    getAllTrainerCourses,
    getAllTrainerCoursesCustomers,
    getAllTrainersCoursesWithoutCustomers,
    getAllCoursesForCustomersPage,
    getAllCustomerCoursesRegistered,
    registerForTheCourse,
    // deleteAllCourses
} = require("../controllers/course");

app.post("/", addNewCourse);
app.post("/courseCustomers", getCourseCustomersData);
app.post("/coursesCustomers", getAllTrainerCoursesCustomers);
app.put("/:courseId", updateCourse);
// app.get("/", getAllCourses);
app.post("/trainerCourses", getAllTrainerCourses);
app.get("/admincourses", getAllAdminCourses);
app.post("/allTrainersCourses", getAllTrainersCoursesWithoutCustomers);
app.get("/:courseId", getCourseById);
app.delete("/:courseId", deleteCourseById);
app.get("/customer/allCoursesForCustomerPage", getAllCoursesForCustomersPage);
app.post("/registeredCourses", getAllCustomerCoursesRegistered);
app.post("/registerToCourse", registerForTheCourse);
// app.delete("/", deleteAllCourses);

module.exports = app;