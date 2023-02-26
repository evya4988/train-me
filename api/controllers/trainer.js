const Trainer = require("../models/trainer");
const serverResponse = require("../utils/serverResponse");
const { allowedUpdates } = require('../../constants/allowedUpdates');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../cloudinary/cloudinary");


module.exports = {
  signup: async (req, res) => {
    const { firstname, lastname, age, pictureToDB, phone, gender, email, password } =
      req.body;

    const allTrainer = await Trainer.find({});
    for (const i in allTrainer) {
      if (allTrainer[i].email === email) {
        return res.status(422).json({ error: "This Email is already taken!" });
      }
    }

    let cloImageResult = '';
    await cloudinary.uploader.upload(pictureToDB,
      {
        folder: "trainme_trainers_avatar",
        upload_preset: 'unsigned_upload_trainer',
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

      const profilepic = {
        image: pictureToDB,
        public_id: cloImageResult.public_id
      }

      const trainer = new Trainer({
        firstname,
        lastname,
        age,
        phone,
        profilepic,
        gender,
        email,
        password: hash,
      });
      // console.log("trainer is: " + trainer);

      trainer
        .save()
        .then((result) => {
          // console.log(result);
          console.log("Trainer created");
          // result.status(200).json({result}),
          res.status(201).json({
            cloImageResult,
            result
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "internal error occured" + error
          });
        });
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body
    console.log('password: ', password);
    try {
      await Trainer.findOne({ email })
        .then(trainerUser => {
          if (!trainerUser) {
            return res.status(422).json({ error: "Invalid email or password" })
          }
          bcrypt.compare(password, trainerUser.password)
            .then(doMatch => {
              if (doMatch) {
                // res.json({message:"SignIn successfull"})
                // const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                // const { _id, name, email, role } = savedUser
                // res.json({ token, user: { _id, email, name, role } })
                return res.status(200).json({
                  message: "Welcome Trainer",
                  name: `${trainerUser.firstname} ${trainerUser.lastname}`,
                  trainerUser: `${trainerUser._id}`
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

  getAllTrainers: async (req, res) => {
    try {
      const allTrainers = await Trainer.find({});
      return serverResponse(res, 200, allTrainers);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },
  //Shows all trainer colleagues at the Trainer page.
  // getAllTrainersPartialData: async (req, res) => {
  //   try {
  //     const trainerId = req.body
  //     // console.log("Trainer ID: ", trainerId);

  //     const allTrainers = await Trainer.find({});
  //     return serverResponse(res, 200, allTrainers);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  //Shows all trainers Partial Data at the Customer page.
  getAllTrainersPartialDataForCustomers: async (req, res) => {
    try {
      const allTrainers = await Trainer.find({});
      const trainersPartialDataArr = [];
      // console.log(trainersPartialDataArr);
      allTrainers.map((trainer) => {
        const tempObj = {};
        tempObj.firstname = trainer.firstname;
        tempObj.lastname = trainer.lastname;
        tempObj.profilepic = trainer.profilepic;
        tempObj.gender = trainer.gender;
        tempObj.rating = trainer.rating;
        trainersPartialDataArr.unshift(tempObj);
      })
      // console.log(trainersPartialDataArr);
      return serverResponse(res, 200, trainersPartialDataArr);
    } catch (error) {
      console.log(error);
    }
  },

  getTrainerById: async (req, res) => {
    try {
      const trainerID = req.params.trainerId;
      // console.log(trainerID);
      const tempTrainerObj = await Trainer.findOne({ _id: trainerID });
      const trainer = {};
      trainer.firstname = tempTrainerObj.firstname
      trainer.lastname = tempTrainerObj.lastname
      trainer.email = tempTrainerObj.email
      trainer.age = tempTrainerObj.age
      trainer.gender = tempTrainerObj.gender
      trainer.phone = tempTrainerObj.phone
      trainer.profilepic = tempTrainerObj.profilepic
      trainer.rating = tempTrainerObj.rating
      // console.log(trainer);
      return serverResponse(res, 200, trainer);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  deleteTrainerById: async (req, res) => {
    try {
      const id = req.params.trainerId;
      console.log(id)
      const trainerID = await Trainer.findById(id);
      console.log(trainerID)
      const imgId = trainerID.profilepic.public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
      await Trainer.findOneAndDelete({ _id: trainerID });

      const allTrainers = await Trainer.find({});

      return serverResponse(res, 200, allTrainers);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  getAllTrainersForContactUsForm: async (req, res) => {
    try {
      const allTrainers = await Trainer.find({});
      const filteredTrainersData = [];
      allTrainers.map((trainer) => {
        const tempObj = {};
        tempObj.id = trainer._id;
        tempObj.firstName = trainer.firstname;
        tempObj.lastName = trainer.lastname;
        tempObj.email = trainer.email;
        tempObj.phone = trainer.phone;
        tempObj.gender = trainer.gender;
        filteredTrainersData.push(tempObj);
      })
      return serverResponse(res, 200, filteredTrainersData);
    } catch (e) {
      return serverResponse(res, 500, { message: "internal error occured " + e });
    }
  },

  // TODO?
  updateTrainer: (req, res) => {
    const trainerID = req.params.trainerId;

    res.status(200).json({
      message: "Update Trainer - ${trainerId}",
    });
  },

};
