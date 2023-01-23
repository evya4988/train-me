const express = require("express");
const app = express();

const { 
    getAllContactInquiries,
    PostContact,
    getContactById,
    deleteContactById,
    deleteAllContactInquiries
} = require("../controllers/contactUs");

app.post("/", PostContact);
app.get("/", getAllContactInquiries);
app.get("/:contactId", getContactById);
app.delete("/:contactId", deleteContactById);
app.delete("/", deleteAllContactInquiries);

module.exports = app;
