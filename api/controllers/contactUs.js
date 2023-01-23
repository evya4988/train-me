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

  PostContact: async (req, res) => {
    try {
      const newPostOfContact = new ContactUs({ ...req.body });
      await newPostOfContact.save();
      return serverResponse(res, 201, newPostOfContact);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  },

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

  deleteAllContactInquiries: async (req, res) => {
    try {
      const allContactUs = await ContactUs.deleteMany({});
      return serverResponse(res, 200, allContactUs);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occurred " + e });
    }
  }
};
