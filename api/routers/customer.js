const express = require("express");
const app = express();

const { signup,
    login,
    getAllCustomers,
    getCustomerById,
    // updateCustomer,
    deleteCustomerById,
    getAllCustomersForContactUsForm
} = require("../controllers/customer");


app.post("/signup", signup);
app.post("/login", login);
app.get("/", getAllCustomers);
app.get("/:customerId", getCustomerById);
app.get("/contactUs/customers", getAllCustomersForContactUsForm);
// app.patch("/:customerId", updateCustomer);
app.delete("/:customerId", deleteCustomerById);

module.exports = app;
