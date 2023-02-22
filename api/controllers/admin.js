const Admin = require("../models/admin");
const { allowedUpdates } = require('../../constants/allowedUpdates');
const serverResponse = require('../utils/serverResponse');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../../cloudinary/cloudinary");



module.exports = {
  signup: async (req, res) => {
    const { firstname, lastname, profilepic, email, password } = req.body;
    const allAdmin = await Admin.find({});
    if (allAdmin.length > 0) {
      console.log('admin is: error ');
      return res.status(422).json({ error: "There is Admin already!" });
    };

    let cloImageResult = '';
    await cloudinary.uploader.upload(profilepic,
      {
        folder: "trainme_admin_avatar",
        upload_preset: 'unsigned_upload_admin',
        public_id: `${email}_avatar`,
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

      const admin = new Admin({
        firstname: firstname,
        lastname: lastname,
        profilepic: cloImageResult.secure_url,
        email: email,
        password: hash,
      });
      // console.log("admin is: " + admin);

      try {
        admin.save();
        console.log("Admin created");
        return serverResponse(res, 201, { cloImageResult });
      } catch (error) {
        return serverResponse(res, 500, { message: "internal error occured" + error })
      }
    });

  },

  login: (req, res) => {
    const { email, password } = req.body
    console.log('password: ', password);
    try {
       Admin.findOne({ email })
        .then(adminUser => {
          if (!adminUser) {
            return res.status(422).json({ error: "Invalid email or password" })
          }
          bcrypt.compare(password, adminUser.password)
            .then(doMatch => {
              if (doMatch) {
                // res.json({message:"SignIn successfull"})
                // const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                // const { _id, name, email, role } = savedUser
                // res.json({ token, user: { _id, email, name, role } })
                return res.status(200).json({
                  message: "Welcome Admin",
                  name: `${adminUser.firstname} ${adminUser.lastname}`,
                  id: `${adminUser._id}`
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

  getAdmin: async (req, res) => {
    try {
      const allAdmin = await Admin.find({});
      return serverResponse(res, 200, allAdmin);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

};
