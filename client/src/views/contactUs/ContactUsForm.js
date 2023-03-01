import React, { useState, useEffect, useContext } from 'react';
import './ContactUsForm.css';
import axios from 'axios';
import MyContext from '../../MyContext';

const ContactUsForm = () => {
  const { customerID, trainerID } = useContext(MyContext);
  const [customerDetails, setCustomerDetails] = useState({});
  const [trainerDetails, setTrainerDetails] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [message, setMessage] = useState('');
  const [gender, setGender] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  const [mandatoryErrors, setMandatoryErrors] = useState([]);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  let isValid = true;
  const handleSubmitContactAdding = (async (event) => {
    event.preventDefault();

    let errorsConsole = {};
    setErrors([]);
    setMandatoryErrors([]);

    if (!firstName) {
      setMandatoryErrors(prev => [...prev, 'Name feild is mandatory!']);
      isValid = false;
      errorsConsole.firstName = "Name feild is mandatory!";
    } else if ((firstName && firstName.length < 2) || firstName.length > 20) {
      setErrors(prevState => ({
        ...prevState,
        [firstName]: "this is redundant" // I need better way to show the error.
      }));
      isValid = false;
      console.log("errors" + errors.firstName);
    }

    if (!lastName) {
      isValid = false;
      let updatedValue = {};
      updatedValue = { "lastName": "Last Name feild is mandatory!" };
      setMandatoryErrors(prevState => ({
        ...prevState,
        ...updatedValue
      }));
      errorsConsole.lastName = "Last Name feild is mandatory!";
    } else if ((lastName && lastName.length < 2) || lastName.length > 20) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [lastName]: "Last Name must be in a range of 2-20 characters!"
      }));
      errorsConsole.lastName = "Last Name must in a range of 2-20 characters!";
    }

    if (!email) {
      errorsConsole.email = "Email feild is mandatory!";
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [email]: "Email feild is mandatory!"
      }));
    } else if (!isValidEmail(email)) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [email]: "This is not a valid email!"
      }));
      errorsConsole.email = "This is not a valid email!";
    };

    if (!phone) {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [phone]: "Phone feild is mandatory!"
      }));
      errorsConsole.phone = "Phone feild is mandatory!";
    } else if ((phone && phone.length < 7) || phone.length > 12) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [phone]: "Phone numbers must be in a range of 7-12"
      }));
      errorsConsole.phone = "Phone numbers must be in a range of 7-12";
    }

    if (gender === "" || gender === "Choose your Gender please") {
      console.log(gender);
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [gender]: "Gender field is mandatory!"
      }));
      // setErrors(prevState => ({
      //   ...prevState,
      //   [gender]: "Gender field is mandatory!"
      // }));
      errorsConsole.gender = "Gender feild is mandatory!";
    }

    if ((messageTitle && messageTitle.length < 3) || messageTitle.length > 20) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [messageTitle]: "Message Title must be in a range of 3-20"
      }));
      errorsConsole.messageTitle = "Message Title must be in a range of 3-20";
    } else if (!messageTitle) {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [messageTitle]: "Message Title feild is mandatory!"
      }));
      errorsConsole.messageTitle = "Message Title feild is mandatory!";
    };

    if ((message && message.length < 10) || message.length > 150) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [message]: "Message must be in a range of 10-150"
      }));
      errorsConsole.message = "Message must be in a range of 10-150";
    } else if (!message) {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [message]: "Message feild is mandatory!"
      }));
      errorsConsole.message = "Message feild is mandatory!";
    };

    if (contactMethod === "" || contactMethod === "Choose your Preferred contact method please") {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [contactMethod]: "contactMethod field is mandatory!"
      }));
      // setErrors(prevState => ({
      //   ...prevState,
      //   [contactMethod]: "contactMethod field is mandatory!"
      // }));
      errorsConsole.contactMethod = "contactMethod feild is mandatory!";
    }

    if (!isValid) {
      console.log('form isn\'t valid!!');
      errorsConsole.isValid = "form isn't valid!!";
      console.warn(errorsConsole);
      return;
    };
    isValid = true;

    const capitalizeFirstLowercaseRest = str => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const contactToAddToDB = {
      firstname: capitalizeFirstLowercaseRest(firstName),
      lastname: capitalizeFirstLowercaseRest(lastName),
      email: email,
      phone: phone,
      messagetitle: messageTitle,
      message: message,
      gender: gender,
      contactmethod: contactMethod,
      user: currentUser === 'trainer' ? "trainer" : currentUser === 'customer' ? "customer" : "visitor"
    };
    console.log(contactToAddToDB);

    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessageTitle('');
    setMessage('');
    setGender('');
    setContactMethod('');

    axios({
      method: 'post',
      url: "http://localhost:8000/contactUs",
      headers: { 'content-type': 'application/json' },
      data: contactToAddToDB
    })
      .then(res => {
        console.log('Posting a New Contact ', res.data);
        setSubmitted(true);
      })
      .catch(err => console.log(err));
  });

  const gatAllCustomersData = async () => {
    try {
      const allCustomersUrl = 'http://localhost:8000/customer/contactUs/customers';
      const response = await axios.get(allCustomersUrl);
      console.log(response);
      const data = await response.data;
      data.map((customer) => {
        return customer.id === customerID && setCustomerDetails(customer);
      })
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const gatAllTrainersData = async () => {
    try {
      const allTrainersUrl = 'http://localhost:8000/trainer/contactUs/trainers';
      const response = await axios.get(allTrainersUrl);
      console.log(response);
      const data = await response.data;
      console.log("Trainer ID: ", trainerID);
      data.map((trainer) => {
        return trainer.id === trainerID && setTrainerDetails(trainer);
      })
    } catch (error) {
      console.log("error: ", error);
    }
  }

  useEffect(() => {
    customerID !== "" && gatAllCustomersData();
    trainerID !== "" && gatAllTrainersData();

    const id = setTimeout(() => {
      setSubmitted(false);
    }, 3000);
    return () => clearTimeout(id)
  }, [submitted]);



  useEffect(() => {
    if (trainerDetails) {
      setFirstName(trainerDetails.firstName);
      setLastName(trainerDetails.lastName);
      setEmail(trainerDetails.email);
      setPhone(trainerDetails.phone);
      setGender(trainerDetails.gender);
      trainerDetails.firstName && setCurrentUser("trainer");
    }
  }, [trainerDetails])

  useEffect(() => {
    if (customerDetails) {
      setFirstName(customerDetails.firstName);
      setLastName(customerDetails.lastName);
      setEmail(customerDetails.email);
      setPhone(customerDetails.phone);
      setGender(customerDetails.gender);
      customerDetails.firstName && setCurrentUser("customer");
    }
  }, [customerDetails]);

  return (
    <div className="form-container">
      <div className="images-container">
        <img className="imageSize imageSize-m-queries" src="https://thumb.tildacdn.com/tild3565-6466-4861-b364-396363393665/-/resize/916x/-/format/webp/Frame_522-min.jpg" alt="workout pic"></img>
      </div>
      <form className="contactUs-form">
        <input
          className={(customerID || trainerID) ? "form-field existUser-field" : "form-field"}
          type="text"
          placeholder="First Name"
          value={
            trainerID
              ? trainerDetails.firstName
              : customerID
                ? customerDetails.firstName
                : firstName
          }
          onChange={
            trainerID || customerID
              ? null
              : (e) => {
                setFirstName(e.target.value);
              }
          }
        />
        {mandatoryErrors[firstName] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Name feild is mandatory!
          </p> : ''
        }
        {errors[firstName] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Name must be in a range of 2 - 20 characters!
          </p> : ''
        }

        <input
          className={(customerID || trainerID) ? "form-field existUser-field" : "form-field"}
          type="text"
          placeholder="Last Name"
          value={
            customerID
              ? customerDetails.lastName
              : trainerID
                ? trainerDetails.lastName
                : lastName
          }
          onChange={
            (customerID || trainerID)
              ? null
              : (e) => {
                setLastName(e.target.value);
              }
          }
        />
        {mandatoryErrors[lastName] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Last Name feild is mandatory!
          </p> : ''
        }
        {errors[lastName] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Last Name must be in a range of 2 - 20 characters!
          </p> : ''
        }

        <input
          className={(customerID || trainerID) ? "form-field existUser-field" :"form-field"}
          type="email"
          placeholder="Email"
          value={
            customerID
              ? customerDetails.email
              : trainerID
                ? trainerDetails.email
                : email
          }
          onChange={
            (customerID || trainerID)
              ? null
              : (e) => {
                setEmail(e.target.value);
              }
          }
        />
        {mandatoryErrors[email] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Email feild is mandatory!
          </p> : ''
        }
        {errors[email] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            This is not a valid email!
          </p> : ''
        }

        <input
          className={(customerID || trainerID) ? "form-field existUser-field" : "form-field"}
          type="number"
          placeholder="Phone"
          value={
            customerID
              ? customerDetails.phone
              : trainerID
                ? trainerDetails.phone
                : phone
          }
          onChange={
            (customerID || trainerID)
              ? null
              : (e) => {
                setPhone(e.target.value);
              }
          }
        />
        {mandatoryErrors[phone] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Phone feild is mandatory!
          </p> : ''
        }
        {errors[phone] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Phone number must be in a range of 7 - 12 numbers!
          </p> : ''
        }

        <input
          className="form-field"
          type="text"
          placeholder="Message Title"
          value={messageTitle}
          onChange={(e) => { setMessageTitle(e.target.value) }} />
        {mandatoryErrors[messageTitle] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Message Title feild is mandatory!
          </p> : ''
        }
        {errors[messageTitle] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Message Title must be in a range of 3-20 characters!
          </p> : ''
        }

        <textarea
          rows={3}
          className="form-field"
          // type="textarea"
          placeholder="Message"
          value={message}
          onChange={(e) => { setMessage(e.target.value) }} />
        {mandatoryErrors[message] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Message feild is mandatory!
          </p> : ''
        }
        {errors[message] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Message must be in a range of 10-150 characters!
          </p> : ''
        }

        <select
          className="label-select-holder"
          type="text"
          placeholder="Preferred contact method"
          value={contactMethod}
          onChange={(e) => { setContactMethod(e.target.value) }}>
          <option>Choose your Preferred contact method please</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        {mandatoryErrors[contactMethod] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Contact Method feild is mandatory!
          </p> : ''
        }

        <select
          className={(customerID || trainerID) ? "existUser-field-gender-label" : "label-select-holder"}
          type="text"
          placeholder="Gender"
          value={
            customerID
              ? customerDetails.gender
              : trainerID
                ? trainerDetails.gender
                : gender
          }
          onChange={
            (customerID || trainerID)
              ? null
              : (e) => {
                setGender(e.target.value);
              }
          }
        >
          <option>Choose your Gender please</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {mandatoryErrors[gender] ?
          <p style={{ fontSize: "12px", color: "red", paddingLeft: "0.3em", marginTop: "0" }}>
            Gender feild is mandatory!
          </p> : ''
        }

        <div style={{ display: 'flex', justifyContent: "center" }}>
          <button
            className="btn-container"
            type="submit" onClick={(handleSubmitContactAdding)}>Send Us a Message</button>
        </div>
        {submitted &&
          <p className="success-message">
            Success! Thank you for contacting us, We'll contact you back as soon as possible.
          </p>}
      </form>
    </div>
  )
}

export default ContactUsForm