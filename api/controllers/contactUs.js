const ContactUs = require("../models/contactUs");
const serverResponse = require('../utils/serverResponse');
// const { allowedUpdates } = require('../../constants/allowedUpdates');


module.exports = {
  getAllContactInquiries: async (req, res) => {
    try {
      const allContactUs = await ContactUs.find({});
      return serverResponse(res, 200, allContactUs);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  },
  /** Routing */
  PostContact: async (req, res) => {
    try {
      const newPostOfContact = new ContactUs({ ...req.body });
      console.log("Post:\n", newPostOfContact);
      await newPostOfContact.save();
      return serverResponse(res, 201, newPostOfContact);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  },

  /** Admin Page */
  getContactById: async (req, res) => {
    try {
      console.log(req.params);
      const contactID = req.params.contactId;
      const contact = await ContactUs.findOne({ _id: contactID });
      return serverResponse(res, 200, contact);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  },

  /** Admin Page */
  deleteContactById: async (req, res) => {
    try {
      console.log(req.params);

      await ContactUs.findOneAndDelete({ _id: req.params.contactId });

      const allContactUs = await ContactUs.find({});

      return serverResponse(res, 200, allContactUs);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  },

  /** Admin Page */
  deleteAllContactInquiries: async (req, res) => {
    try {
      const allContactUs = await ContactUs.deleteMany({});
      return serverResponse(res, 200, allContactUs);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  },

  /** Admin Page */
  deleteAllFilteredContactUsHandler: async (req, res) => {
    try {
      const filteredContactToDelete = req.body;
      // console.log("Filtered ContactTo Delete: ", filteredContactToDelete);

      await ContactUs.deleteMany({ _id: { $in: filteredContactToDelete } });
      
      const allContactUsPostDelete = await ContactUs.find({});
      return serverResponse(res, 200, allContactUsPostDelete);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  }
  ,
};
