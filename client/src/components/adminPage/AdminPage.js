import React, { useContext, useEffect, useState } from 'react';
import './AdminPage.css';
import '../../customHooks/Loading.css';
import Img from '../../customHooks/Img';
import MyContext from '../../MyContext';
import { Marginer } from '../marginer';
import axios from 'axios';
import '../trainerPage/UpdateModal.css';
import BackToTopBtn from '../../customHooks/BackToTopBtn';

const AdminPage = ({ loading, setLoading, adminAvatar }) => {
  const [contactCardExist, setContactCardExist] = useState(true);
  const [customerCardExist, setCustomerCardExist] = useState(true);
  const [trainerCardExist, setTrainerCardExist] = useState(true);
  const [coursesCardExist, setCoursesCardExist] = useState(true);
  const [courseTrainerData, setCourseTrainerData] = useState([]);
  const [customersModal, setCustomersModal] = useState(false);
  const [courseCustomersData, setCourseCustomersData] = useState([]);

  const [contactUsEmpty, setContactUsEmpty] = useState(false);
  const [customersCardEmpty, setCustomersCardEmpty] = useState(false);
  const [trainersCardEmpty, setTrainersCardEmpty] = useState(false);
  const [coursesCardEmpty, setCoursesCardEmpty] = useState(false);
  const [contactMessageFlag, setContactMessageFlag] = useState(false);
  const [customerMessageFlag, setCustomerMessageFlag] = useState(false);
  const [trainerMessageFlag, setTrainerMessageFlag] = useState(false);
  const [coursesMessageFlag, setCoursesMessageFlag] = useState(false);

  const [toggleFilteredCourses, setToggleFilteredCourses] = useState(true);
  const [trainerLabelID, setTrainerLabelID] = useState('');
  const [isFilteredById, setIsFilteredById] = useState(true);
  const [isFilteredContactsBtnPressed, setIsFilteredContactsBtnPressed] = useState(false);
  const [allContactUsForAllFilteredOption, setAllContactUsForAllFilteredOption] = useState([]);
  const [filteredUserDataEmpty, setFilteredUserDataEmpty] = useState(false);

  const {
    adminName,
    adminId,
    customersData,
    setCustomersData,
    trainersData,
    setTrainersData,
    contactUsData,
    setContactUsData,
    coursesData,
    setCoursesData
  } = useContext(MyContext);

  // Setting the time once, to greet the appropriate greeting.
  const [time, setTime] = useState(0);
  const [isTimeChecked, setIsTimeChecked] = useState(false);
  if (!isTimeChecked) {
    const today = new Date();
    setTime(today.getHours());
    setIsTimeChecked(true);
  }

  useEffect(() => {
    contactUsData.length > 0 && setContactCardExist(false);
    (contactUsData.length === 0 && contactMessageFlag) && setContactUsEmpty(true);

    customersData.length > 0 && setCustomerCardExist(false);
    (customersData.length === 0 && customerMessageFlag) && setCustomersCardEmpty(true);

    trainersData.length > 0 && setTrainerCardExist(false);
    (trainersData.length === 0 && trainerMessageFlag) && setTrainersCardEmpty(true);

    coursesData.length > 0 && setCoursesCardExist(false);
    (coursesData.length === 0 && coursesMessageFlag) && setCoursesCardEmpty(true);

  }, [contactUsData, customersData, trainersData, coursesData]);

  useEffect(() => {
    //Todo
    // AllRegisteredCustomers !== 0 && setAllRegisteredCustomers(0);
    let courseCustomersLengthCounter = 0;
    (AllRegisteredCustomers === 0 && coursesData.length > 0) && coursesData.forEach((course) => {
      Object.keys(course).map((item) => {
        if (item === "customers") {
          console.log("course[item].length: ", course[item].length);
          courseCustomersLengthCounter += course[item].length;
        }
      })
    })
    console.log("courseCustomersLengthCounter: ", courseCustomersLengthCounter);
    setAllRegisteredCustomers(courseCustomersLengthCounter);
  }, [coursesData])
  

  const getContactUsApiAnswer = async (e) => {
    e.preventDefault();

    // Disable 'Contact Us messages' Button when pressed again. Only be able if the filtered button is clicked.
    if (!contactCardExist && !isFilteredContactsBtnPressed) return;

    if (!contactCardExist && (allContactUsForAllFilteredOption.length === contactUsData.length)) {
      setIsFilteredContactsBtnPressed(!isFilteredContactsBtnPressed);
      console.log("isFilteredContactsBtnPressed: ", isFilteredContactsBtnPressed);
    } else {
      setLoading(true);
      try {
        const contactUsUrl = 'http://localhost:8000/contactUs';
        const response = await axios.get(contactUsUrl);
        // console.log(response);
        const data = await response.data;
        setContactUsData(data);
        setAllContactUsForAllFilteredOption(data);
        setContactCardExist(true);
        setContactMessageFlag(true);

        setCustomersData([]);
        setCustomerCardExist(true);
        setCustomersCardEmpty(false);
        setCustomerMessageFlag(false);

        setTrainersData([]);
        setTrainersCardEmpty(false);
        setTrainerCardExist(true);
        setTrainerMessageFlag(false);

        setCoursesData([]);
        setCoursesCardExist(true);
        setCoursesCardEmpty(false);
        setCoursesMessageFlag(false);

        if (isFilteredContactsBtnPressed) {
          // console.log("isFilteredContactsBtnPressed: ", isFilteredContactsBtnPressed);
          setIsFilteredContactsBtnPressed(false);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const closeContactPageHandler = () => {
    setContactCardExist(true);
    setContactUsData([]);
    setContactMessageFlag(false);
    setContactUsEmpty(false);
  }

  const deleteAllContactHandler = async () => {
    try {
      const contactUsUrl = 'http://localhost:8000/contactUs';
      const response = await axios.delete(contactUsUrl);
      console.log(response);
      setContactUsData([]);
      setContactUsEmpty(true);
      setContactCardExist(true);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteContactById = async (id) => {
    try {
      // console.log(id);
      let userKind = "";
      contactUsData.filter((contact) => {
        if (contact._id === id) {
          userKind = contact.user;
        }
      });

      const contactUsUrl = `http://localhost:8000/contactUs/${id}`;
      const response = await axios.delete(contactUsUrl);
      // console.log(response);
      const data = await response.data;
      setAllContactUsForAllFilteredOption(data);
      const tempArr = [];
      for (const i in data) {
        if (data[i].user === userKind) {
          tempArr.push(data[i]);
        }
      }

      console.log(data);
      data.length !== tempArr.length ? setContactUsData(tempArr) : setContactUsData(data);
      setContactUsEmpty(true);
      setContactCardExist(false);

    } catch (error) {
      console.log(error);
    }
  }

  const filterContactUsByTrainers = (e) => {
    e.preventDefault();

    // console.log("allContactUsForAllFilteredOption: ", allContactUsForAllFilteredOption);
    const tempArr = [];
    for (const i in allContactUsForAllFilteredOption) {
      if (allContactUsForAllFilteredOption[i].user === "trainer") {
        tempArr.push(allContactUsForAllFilteredOption[i]);
      }
    }
    setContactUsData(tempArr);
    tempArr.length === 0 && setFilteredUserDataEmpty(true);
    // console.log("tempArr is: ", tempArr);
  }

  const filterContactUsByCustomers = (e) => {
    e.preventDefault();
    const tempArr = [];
    for (const i in allContactUsForAllFilteredOption) {
      if (allContactUsForAllFilteredOption[i].user === "customer") {
        tempArr.push(allContactUsForAllFilteredOption[i]);
      }
    }
    setContactUsData(tempArr);
    tempArr.length === 0 && setFilteredUserDataEmpty(true);
    // console.log("tempArr is: ", tempArr);
  }

  const filterContactUsByVisitors = (e) => {
    e.preventDefault();
    const tempArr = [];
    for (const i in allContactUsForAllFilteredOption) {
      if (allContactUsForAllFilteredOption[i].user === "visitor") {
        tempArr.push(allContactUsForAllFilteredOption[i]);
      }
    }
    setContactUsData(tempArr);
    tempArr.length === 0 && setFilteredUserDataEmpty(true);
    // console.log("tempArr is: ", tempArr);
  }

  const deleteAllFilteredContactHandler = async () => {
    console.log("from delete ------------");
    const contactIdData = [];
    contactUsData.map((contact) => {
      return contactIdData.push(contact._id);
    })
    axios({
      method: 'delete',
      url: "http://localhost:8000/contactUs/allUsers/deleteAllFilteredContactUs",
      headers: { 'content-type': 'application/json' },
      data: contactIdData
    }).then((res) => {
      console.log(res);
      setContactUsData(res.data);
      const data = res.data;
      setAllContactUsForAllFilteredOption(data);
      setContactUsEmpty(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  const getTrainersApiAnswer = async () => {
    // Disable 'List of Trainers' Button when pressed again!
    if (!trainerCardExist) return;

    setLoading(true);
    try {
      const allTrainersUrl = 'http://localhost:8000/trainer';
      const response = await axios.get(allTrainersUrl);
      console.log(response);
      const data = await response.data;
      setTrainersData(data);
      setTrainerMessageFlag(true);
      setTrainerCardExist(true);

      setContactUsData([]);
      setContactCardExist(true);
      setContactUsEmpty(false);
      setContactMessageFlag(false);

      setCustomersData([]);
      setCustomerCardExist(true);
      setCustomersCardEmpty(false);
      setCustomerMessageFlag(false);

      setCoursesData([]);
      setCoursesCardExist(true);
      setCoursesCardEmpty(false);
      setCoursesMessageFlag(false);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  }

  const closeTrainerPageHandler = () => {
    setTrainerCardExist(true);
    setTrainersData([]);
    setTrainerMessageFlag(false);
  }

  const deleteTrainerById = async (id) => {
    try {
      console.log(id);
      const contactUsUrl = `http://localhost:8000/trainer/${id}`;
      const response = await axios.delete(contactUsUrl);
      console.log(response);
      const data = await response.data
      console.log(data);
      setTrainersData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getCustomersApiAnswer = async () => {
    // Disable 'List of Customers' Button when pressed again!
    if (!customerCardExist) return;

    setLoading(true);
    try {
      const allCustomersUrl = "http://localhost:8000/customer";
      const response = await axios.get(allCustomersUrl);
      console.log(response);
      const data = await response.data;
      setCustomersData(data);
      setCustomerCardExist(true);
      setCustomerMessageFlag(true);

      setContactUsData([])
      setContactCardExist(true);
      setContactUsEmpty(false);
      setContactMessageFlag(false);

      setTrainersData([]);
      setTrainerCardExist(true);
      setTrainersCardEmpty(false);
      setTrainerMessageFlag(false);

      setCoursesData([]);
      setCoursesCardExist(true);
      setCoursesCardEmpty(false);
      setCoursesMessageFlag(false);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const closeCustomerPageHandler = () => {
    setCustomerCardExist(true);
    setCustomersData([]);
    setCustomerMessageFlag(false);
  }

  const deleteCustomerById = async (id) => {
    try {
      console.log(id);
      const contactUsUrl = `http://localhost:8000/customer/${id}`;
      const response = await axios.delete(contactUsUrl);
      console.log(response);
      const data = await response.data
      console.log(data);
      setCustomersData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const commonSettingDefinitionForCourses = () => {
    setCoursesCardExist(true);
    setCoursesMessageFlag(true);

    setContactUsData([])
    setContactCardExist(true);
    setContactUsEmpty(false);
    setContactMessageFlag(false);

    setTrainersData([]);
    setTrainerCardExist(true);
    setTrainersCardEmpty(false);
    setTrainerMessageFlag(false);

    setCustomersData([]);
    setCustomerCardExist(true);
    setCustomersCardEmpty(false);
    setCustomerMessageFlag(false);
  }

  const getCoursesApiAnswer = async () => {
    // Disable 'List of Courses' Button when pressed again!
    if (coursesData.length > 0 && toggleFilteredCourses) return;

    setLoading(true);
    try {
      const allCoursesUrl = 'http://localhost:8000/course/admincourses';
      const response = await axios.get(allCoursesUrl);
      console.log(response);
      const data = await response.data;
      // console.log("data: ", data);
      setCoursesData(data[0]);
      // console.log("coursesData: ", coursesData);


      setCourseTrainerData(data[1]);
      // console.log("CourseTrainerData: ", courseTrainerData);
      console.log("data[1]: ", data[1]);

      commonSettingDefinitionForCourses();
      setIsFilteredById(true);
      if (!toggleFilteredCourses) {
        setToggleFilteredCourses(!toggleFilteredCourses)
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const getCourseCustomersData = async (courseItems) => {
    setLoading(true);
    axios({
      method: 'post',
      url: "http://localhost:8000/course/courseCustomers",
      headers: { 'content-type': 'application/json' },
      data: courseItems
    }).then((res) => {
      console.log('Fetching customers ', res.data);
      setCourseCustomersData(res.data);
      setCustomersModal(!customersModal);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    });
  }
  //Todo
  // const deleteCustomerFromCourse = async () => {
  //   setLoading(true);
  //   axios({
  //     method: 'post',
  //     url: "http://localhost:8000/course/courseCustomers",
  //     headers: { 'content-type': 'application/json' },
  //     data: 
  //   }).then((res) => {
  //     console.log('Fetching customers ', res.data);

  //     setLoading(false);
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

  const FilteredCoursesWithCustomers = async () => {
    try {
      const allCoursesUrl = 'http://localhost:8000/course/admincourses';
      const response = await axios.get(allCoursesUrl);
      // console.log(response);
      const data = await response.data;

      const filteredCourses = []
      data[0].map((course) => {
        if (course.customers.length > 0) {
          filteredCourses.push(course);
        }
        return null
      })

      setCourseTrainerData(trainersData);
      setCoursesData(filteredCourses);
      // console.log("coursesData: ", coursesData);

      setCourseTrainerData(data[1]);
      // console.log("CourseTrainerData: ", courseTrainerData);

      commonSettingDefinitionForCourses();
      setIsFilteredById(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const getAllTrainerCoursesHandler = () => {
    // console.log("trainerID: ", trainerLabelID)

    if (trainerLabelID === '') {
      console.log("trainer Label ID must have value!");
      return;
    };
    setLoading(true);

    const id =
    {
      trainerLabelID
    }

    axios({
      method: 'post',
      url: "http://localhost:8000/course/trainerCourses",
      headers: { 'content-type': 'application/json' },
      data: id
    }).then((res) => {
      console.log('Fetching trainer Courses ', res.data);
      setLoading(false);
      setTrainerLabelID('');
      if (res.data.length === 0) {
        console.log("Incorrect ID or no courses!");
        // console.log(res.data);
        setIsFilteredById(false);
      } else {
        setCoursesData(res.data);
        setIsFilteredById(true);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const closeCoursesPageHandler = () => {
    setCoursesCardExist(true);
    setCoursesData([]);
    setCoursesMessageFlag(false);
  }

  const closeMessageHandler = () => {
    setCoursesMessageFlag(false);
    setCoursesCardEmpty(false);
    setContactMessageFlag(false);
    setContactUsEmpty(false);
    setCustomersCardEmpty(false);
    setCustomerMessageFlag(false);
    setTrainersCardEmpty(false);
    setTrainerMessageFlag(false);
  }

  const toggleModal = () => {
    setCustomersModal(!customersModal);
  }

  const toggleFilteredCoursesModal = () => {
    if (toggleFilteredCourses) {
      setLoading(!loading);
      FilteredCoursesWithCustomers();
      setToggleFilteredCourses(!toggleFilteredCourses);
    } else {
      getCoursesApiAnswer();
      setLoading(!loading);
      setToggleFilteredCourses(!toggleFilteredCourses);
    }
  }

  const toggleFilteredContactData = (e) => {
    if (allContactUsForAllFilteredOption.length === contactUsData.length) {
      setIsFilteredContactsBtnPressed(!isFilteredContactsBtnPressed);
    } else {
      getContactUsApiAnswer(e);
    }
  }

  const [AllRegisteredCustomers, setAllRegisteredCustomers] = useState(0);

  return (
    <>
      {
        adminId && adminName &&
        <div className="admin-page-container">
          <div className="admin-actions-container">
            {adminName &&
              <div style={{ display: "flex" }}>
                <div style={{ display: "block" }}>
                  {(time >= 0 && time < 12) && <span className="admin-gretting" >Good Morning</span>}
                  {(time < 16 && time >= 12) && <span className="admin-gretting" >Good AfterNoon</span>}
                  {(time <= 23 && time >= 16) && <span className="admin-gretting" >Good Evening</span>}
                  <div className="userName">{adminName}</div>
                </div>
                {adminAvatar &&
                  <Img adminAvatar={adminAvatar} alt="Admin avatar"></Img>
                }
              </div>}
            <Marginer direction="vertical" margin="1em" />

            <div style={{ width: "12em" }}>
              <button className="actions-btn" onClick={() => getCustomersApiAnswer()}>
                List of Customers
              </button>
              <button className="actions-btn" onClick={() => getTrainersApiAnswer()}>
                List of Trainers
              </button>
              <button className="actions-btn" onClick={() => getCoursesApiAnswer()}>
                List of Courses
              </button>
              <button className="actions-btn" onClick={(e) => getContactUsApiAnswer(e)}>
                Contact Us messages
              </button>
            </div>
          </div>

          <div
            className={
              `${((contactUsData.length > 0 || contactMessageFlag)
                || (customersData.length > 0 || customerMessageFlag)
                || (trainersData.length > 0 || trainerMessageFlag)) ?
                "allCards-container" :
                (coursesData.length > 0 || coursesMessageFlag) ?
                  'allAdminCoursesCards-container' :
                  'admin-image-home-container'}`
            }
          >
            {customersCardEmpty &&
              [<div className="cardEmpty-message">There are not Customers!</div>,
              <span className="close-message" onClick={closeMessageHandler}>✖</span>]
            }
            {!customerCardExist &&
              [
                <div className="innerPage-topBar">
                  <div className="amount-container">Customers Amount:
                    <span className="amount-item">{customersData.length}</span>
                  </div>
                </div>,
                loading && <section className="smooth spinner" >{ }</section>,
                customersData.map((item) =>
                  <div key={item._id} className="card-container">
                    <div style={{ display: "flex", justifyContent: "center" }} alt="Customer Avatar">
                      <Img customersDisplayAvatar={item.profilepic.public_id} alt="Customer avatar"></Img>
                    </div>
                    <Marginer direction="vertical" margin="0.5em" />
                    <div className="titles">First Name: <span className="items">{item.firstname}</span></div>
                    <div className="titles">Last Name: <span className="items">{item.lastname}</span></div>
                    <div className="titles">Email: <span className="numeric-items">{item.email}</span></div>
                    <div className="titles">Phone: <span className="numeric-items">{item.phone}</span></div>
                    <div className="titles">Age: <span className="numeric-items">{item.age}</span></div>
                    <div className="titles">Gender: <span className="items">{item.gender}</span></div>
                    <Marginer direction="vertical" margin="0.5em" />
                    <button onClick={() => { deleteCustomerById(item._id) }} className="item-btn">Remove Customer</button>
                  </div>
                ),
                <BackToTopBtn />
              ]
            }

            {trainersCardEmpty &&
              [<div className="cardEmpty-message">There are not Trainers!</div>,
              <span className="close-message" onClick={closeMessageHandler}>✖</span>]
            }
            {!trainerCardExist &&
              [
                <div className="innerPage-topBar">
                  <button
                    className='sendEmail-btn'
                    onClick={() => window.location = `mailto:${trainersData.map((trainer) => {
                      return trainer.email
                    })}`}>Send E-Mail to All
                  </button>
                  <div className="amount-container">Trainers Amount:
                    <span className="amount-item">{trainersData.length}</span>
                  </div>
                </div>,
                loading && <section className="smooth spinner" >{ }</section>,
                trainersData.map((item) =>
                  <div key={item._id} className="card-container">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Img trainersDisplayAvatar={item.profilepic.public_id} alt="Trainer avatar"></Img>
                    </div>
                    <Marginer direction="vertical" margin="0.5em" />
                    <div className="titles">First Name: <span className="items">{item.firstname}</span></div>
                    <div className="titles">Last Name: <span className="items">{item.lastname}</span></div>
                    <div className="titles">Email: <span className="numeric-items">{item.email}</span></div>
                    <div className="titles">Phone: <span className="numeric-items">{item.phone}</span></div>
                    <div className="titles">Age: <span className="numeric-items">{item.age}</span></div>
                    <div className="titles">Gender: <span className="items">{item.gender}</span></div>
                    <Marginer direction="vertical" margin="0.5em" />
                    <button onClick={() => { deleteTrainerById(item._id) }} className="item-btn">Remove Trainer</button>
                  </div>
                ),
                <BackToTopBtn />
              ]
            }

            {coursesCardEmpty &&
              [
                <div className="cardEmpty-message">There are not Courses!</div>,
                <span className="close-message" onClick={closeMessageHandler}>✖</span>
              ]
            }
            {(!coursesCardExist && courseTrainerData) &&
              [
                loading && <section className="smooth spinner" >{ }</section>,
                <div className="courses-navbar">
                  <button
                    className={toggleFilteredCourses ? "navbar-btn" : "filtered-navbar-btn"}
                    onClick={toggleFilteredCoursesModal}
                  >{toggleFilteredCourses ? "Courses With Customers" : "All Courses"}</button>
                  <button
                    className="navbar-btn"
                    onClick={getAllTrainerCoursesHandler}
                  >Filter by ID <span className="cursor-filter-btn">~&#62;</span>
                  </button>
                  <input
                    type="text"
                    placeholder={isFilteredById ? "Enter the requested ID.." : "Incorrect ID"}
                    className={isFilteredById ? "filterCourses-input" : "filterCourses-err"}
                    value={trainerLabelID}
                    onChange={(e) => { setTrainerLabelID(e.target.value) }}
                  ></input>


                  <div className="amount-container">
                    Courses Amount:
                    <span className="amount-item">{coursesData.length}</span>
                  </div>
                </div>,
                coursesData.map((item) =>
                  <div key={item._id} className="course-card-container">
                    <div className="courseCard-course-section">
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Img courseAvatar={item.picture.public_id} alt="Course avatar"></Img>
                      </div>
                      <Marginer direction="vertical" margin="0.5em" />
                      <div className='courseCard-details-1'>
                        <div className="course-name">{item.name}</div>
                        <div className="course-titles" style={{ marginBottom: "0.5em" }}>Category: <span className="items">{item.category}</span></div>
                        <div className="course-titles"><span className="admin-price">{item.cost} ₪</span></div>
                      </div>
                      <div className="courseCard-details-2">
                        <div className="course-titles">Description: <span className="items">{item.description}</span></div>
                        <div className="course-titles" style={{ marginTop: "1em" }}>Lesson Time: <span className="admin-numeric-items" >{item.lessontime} Minutes</span></div>
                      </div>
                    </div>
                    <div className="course-titles courseUsers-title">
                      {
                        courseTrainerData.map((trainer, index) => {
                          if (trainer._id === item.trainer) {
                            return (
                              <>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                  <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <span style={{ paddingBottom: "0.3em", fontFamily: "Lucida Sans" }}>Trainer</span>
                                    <Img courseTrainerAvatar={trainer.profilepic.public_id} alt="Trainer avatar"></Img>
                                  </div>
                                  <div style={{ display: "block", alignItems: "center", marginLeft: "0.5em" }}>
                                    <div style={{ fontSize: "15px", color: "whitesmoke", marginBottom: "1em", fontFamily: "Lucida Sans", fontWeight: "bold" }}>{trainer.firstname + " " + trainer.lastname}</div>
                                    <div className="course-trainerDetails">
                                      <span style={{ color: "#334598" }}>ID:</span>
                                      <span style={{ fontSize: "12px", color: "white", overflowWrap: "break-word" }}>{trainer._id}</span>
                                      {/* <div style={{ color: "#334598" }}> Rate:
                                        {trainer.rating.rate}
                                      </div>
                                      <div style={{ color: "#334598" }}>Count:
                                        {trainer.rating.count}
                                      </div> */}
                                      <div style={{ color: "#334598" }}> Liked:
                                        {trainer.ratingProviders.length !== 0 ?
                                          `${(trainer.ratingProviders.length / AllRegisteredCustomers) * 100}%` 
                                          : "0%"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )
                          }
                          return null
                        })
                      }
                      <Marginer direction="vertical" margin="0.5em" />

                      <div className="courseCustomer-title">Customers
                        {item.customers.length === 0 ?
                          <div className="course-customer-length"
                            style={{ color: "rgb(226, 98, 98)" }}
                          > {item.customers.length} </div> :
                          [
                            <div
                              className="course-customer-length"
                              style={{ borderRadius: "50%", color: "rgb(54, 169, 71)" }}
                            > {item.customers.length}
                            </div>,
                            <button
                              className="course-customer-btn"
                              onClick={() => { getCourseCustomersData(item.customers) }}
                            >View Customers
                            </button>,
                            (customersModal && courseCustomersData) &&
                            <div className="modal" >
                              <div className="overlay-customers" onClick={toggleModal}></div>
                              <div className="modal-customer-container" >
                                {
                                  courseCustomersData.map((customerData, index) => {
                                    return (
                                      <div key={index} className="customers-modal-card">
                                        <span style={{ fontSize: "15px", color: "white" }}>{customerData.firstname + " " + customerData.lastname}</span>
                                        <Img customersDisplayAvatar={customerData.profilepic.public_id} alt="Customer avatar"></Img>
                                        <button
                                          className="adminPage-customersModalCard-btn"
                                        // onClick={() => { deleteCustomerFromCourse() }}
                                        >
                                          Remove from course
                                        </button>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          ]
                        }
                      </div>

                    </div>

                    {/* <button onClick={() => { deleteCourseById(item._id) }} className="item-btn">Remove Course</button> */}
                  </div>
                )
                ,
                <BackToTopBtn />
              ]
            }

            {(!contactCardExist) &&
              [
                loading && <section className="smooth spinner" >{ }</section>,
                <div className="innerPage-topBar contactUs-topBar">
                  <div style={{ display: 'flex' }}>
                    <button
                      className='sendEmail-btn'
                      onClick={(e) => toggleFilteredContactData(e)}>
                      {!isFilteredContactsBtnPressed ? 'Filter Contact' : 'Unfiltered'}
                    </button>
                    {isFilteredContactsBtnPressed &&
                      [<button onClick={(e) => { filterContactUsByTrainers(e) }} className="contactUs-filtered-btn trainer-filtered-btn">Trainers</button>,
                      <button onClick={(e) => { filterContactUsByCustomers(e) }} className="contactUs-filtered-btn customer-filtered-btn">Customers</button>,
                      <button onClick={(e) => { filterContactUsByVisitors(e) }} className="contactUs-filtered-btn visitor-filtered-btn">Visitors</button>]
                    }
                  </div>
                  <div style={{ display: 'flex' }}>
                    {
                      contactUsData.length !== 0 ?
                        [
                          <button
                            className='sendEmail-btn'
                            onClick={() => window.location = `mailto:${contactUsData.map((contact) => {
                              return contact.email
                            })}?subject=Mail from Train Me`}>Send E-Mail to All
                          </button>,
                          <button
                            onClick={isFilteredContactsBtnPressed ?
                              deleteAllFilteredContactHandler :
                              deleteAllContactHandler}
                            className="deleteAllCards-btn">Delete All
                          </button>
                        ]
                        : null
                    }
                    <div className='amount-container'>Contact Amount:
                      <span className="amount-item">{contactUsData.length}</span>
                    </div>
                  </div>
                </div>,
                contactUsData.map((item) =>
                  <div key={item._id} className="card-container">
                    <div className="titles">First Name: <span className="items">{item.firstname}</span></div>
                    <div className="titles">Last Name: <span className="items">{item.lastname}</span></div>
                    <div className="titles">Email: <span
                      className="numeric-items">
                      <a href={`mailto:${item.email}?subject=Mail from Train Me`}>{item.email}</a>
                    </span>
                    </div>
                    <div className="titles">Phone: <span className="numeric-items">{item.phone}</span></div>
                    <div className="titles">Message Title: <span className="items">{item.messagetitle}</span></div>
                    <div className="titles">Message: <span className="items">{item.message}</span></div>
                    <div className="titles">Gender: <span className="items">{item.gender}</span></div>
                    <div className="titles">Contact Method: <span className="items">{item.contactmethod}</span></div>
                    <div className="titles">Date Created: <span className="items">{item.createdat}</span></div>
                    <button onClick={() => { deleteContactById(item._id) }} className="item-btn" style={{ marginTop: "0.7em" }}>Remove</button>
                    <Marginer direction="vertical" margin="0.5em" />
                  </div>
                ),
                <BackToTopBtn />
              ]
            }
            {(contactUsEmpty && contactUsData.length === 0) &&
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="cardEmpty-message">There are not Contact messages!</div>
              </div>
            }
          </div>

          {
            (!contactCardExist) &&
            <div style={{ display: "block", flexDirection: "row" }}>
              <button onClick={closeContactPageHandler} className="close-card-btn users-close-btn"></button>
            </div>
          }

          {
            (contactUsEmpty && contactUsData.length === 0 && filteredUserDataEmpty && !customerCardExist) &&
            <span className="close-message" onClick={closeMessageHandler}>✖</span>
          }

          {
            (!customerCardExist) &&
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={closeCustomerPageHandler} className="close-card-btn users-close-btn"></button>
            </div>
          }

          {(!trainerCardExist) &&
            <div>
              <button onClick={closeTrainerPageHandler} className="close-card-btn users-close-btn"></button>
            </div>
          }

          {(!coursesCardExist) &&
            <div style={{ width: "2.8em" }}>
              <button
                onClick={closeCoursesPageHandler}
                className="close-card-btn users-close-btn"
              ></button>
            </div>
          }
        </div>
      }
    </>
  )
}

export default AdminPage





