const express = require("express");
const app = express();

const { 
    getAllContactInquiries,
    PostContact,
    getContactById,
    deleteContactById,
    deleteAllContactInquiries,
    deleteAllFilteredContactUsHandler,

} = require("../controllers/contactUs");

app.post("/", PostContact);
app.get("/", getAllContactInquiries);
app.get("/:contactId", getContactById);
app.delete("/:contactId", deleteContactById);
app.delete("/", deleteAllContactInquiries);
app.delete("/allUsers/deleteAllFilteredContactUs", deleteAllFilteredContactUsHandler);

module.exports = app;
