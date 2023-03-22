const Customer = require("../models/customer");
const Course = require("../models/course");
const { allowedUpdates } = require('../../constants/allowedUpdates');
const serverResponse = require('../utils/serverResponse');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../cloudinary/cloudinary");


module.exports = {
  signup: async (req, res) => {
    const { firstname, lastname, age, pictureToDB, gender, phone, email, password } =
      req.body;

    const allCustomer = await Customer.find({});
    for (const i in allCustomer) {
      if (allCustomer[i].email === email) {
        return res.status(422).json({ error: "This Email is already taken!" });
      }
    }

    const timestamp = new Date().getTime();
    const publicId = `${email}_${timestamp}_avatar`;
    let cloImageResult = '';
    await cloudinary.uploader.upload(pictureToDB,
      {
        folder: "trainme_customers_avatar",
        upload_preset: 'unsigned_upload_customer',
        public_id: publicId,
        // overwrite: true,
        allowed_formats: ['jpeg, jpg, png, svg, ico, jfif, webp']
      },
      function (error, result) {
        if (error) {
          console.log("error from cloudinary");
          console.log(error);
        } else {
          cloImageResult = result;
          // console.log("result.public_id : " + result.public_id)
          console.log("No Error from cloudinary");
        }

      }
    );

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        return res.status(500).json({
          error,
        });
      }

      const profilepic = {
        image: pictureToDB,
        public_id: cloImageResult.public_id
      }

      const customer = new Customer({
        firstname: firstname,
        lastname: lastname,
        age: age,
        gender: gender,
        phone: phone,
        profilepic,
        email: email,
        password: hash,
      });

      customer
        .save()
        .then((result) => {
          // console.log(result);
          console.log("Customer created");
          res.status(201).json({
            cloImageResult,
            result
          });
        })
        .catch((error) => {
          res.status(500).json({
            error,
          });
        });
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body
    console.log('password: ', password);
    try {
      await Customer.findOne({ email })
        .then(customerUser => {
          if (!customerUser) {
            return res.status(422).json({ error: "Invalid email or password" })
          }
          bcrypt.compare(password, customerUser.password)
            .then(doMatch => {
              if (doMatch) {
                // res.json({message:"SignIn successfull"})
                // const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                // const { _id, name, email, role } = customerUser
                // res.json({ token, user: { _id, email, name, role } })
                return res.status(200).json({
                  message: "Welcome Customer",
                  name: `${customerUser.firstname} ${customerUser.lastname}`,
                  customerUser: `${customerUser._id}`,
                  profilepic: `${customerUser.profilepic.public_id}`
                });
              } else {
                return res.status(422).json({ error: "Invalid Email or Password" })
              }
            }).catch(err => {
              console.log(err);
            })
        }).
        catch(err => {
          console.log(err);
        })

    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  getAllCustomers: async (req, res) => {
    try {
      const allCustomer = await Customer.find({});
      return serverResponse(res, 200, allCustomer);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customerID = req.params.customerId;
      const customer = await Customer.findOne({ _id: customerID });
      return serverResponse(res, 200, customer);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  deleteCustomerById: async (req, res) => {
    try {
      const id = req.params.customerId;
      // console.log("ID: ", id)
      const customer = await Customer.findById(id);
      // console.log(customer)
      const imgId = customer.profilepic.public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }

      const allCourses = await Course.find({});
      // console.log(allCourses);
      for (const x in allCourses) {
        const objWithIdIndex = allCourses[x].customers.findIndex((customerId) => customerId == id);
        // console.log("objWithIdIndex: ", objWithIdIndex);
        if (objWithIdIndex !== -1) {
          // console.log("allCourses[x].customers: ", allCourses[x].customers);
          allCourses[x].customers.splice(objWithIdIndex, 1);
          // console.log("allCourses[x].customers - After: ", allCourses[x].customers);
          await allCourses[x].save();
        }
      }
      await Customer.findOneAndDelete({ _id: customer });

      const allCustomers = await Customer.find({});

      return serverResponse(res, 200, allCustomers);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  getAllCustomersForContactUsForm: async (req, res) => {
    try {
      const allCustomers = await Customer.find({});
      const filteredCustomersData = [];
      allCustomers.map((customer) => {
        const tempObj = {};
        tempObj.id = customer._id;
        tempObj.firstName = customer.firstname;
        tempObj.lastName = customer.lastname;
        tempObj.email = customer.email;
        tempObj.phone = customer.phone;
        tempObj.gender = customer.gender;
        filteredCustomersData.push(tempObj);
      })
      return serverResponse(res, 200, filteredCustomersData);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  // TODO?
  // updateCustomer: (req, res) => {
  //   const customerID = req.params.customerId;

  //   res.status(200).json({
  //     message: "Update Customer - ${customerId}",
  //   });
  // },

};
