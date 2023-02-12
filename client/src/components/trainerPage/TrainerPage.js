import React, { useContext, useState, useRef, useEffect } from 'react';
import './TrainerPage.css';
import Img from '../../customHooks/Img';
import MyContext from '../../MyContext';
import { Marginer } from '../marginer';
import axios from 'axios';
import { FileInput, PreviewPicture } from './styledHelper';
import UpdateModal from './UpdateModal';
import './UpdateModal.css';
import RemoveModal from './RemoveModal';


const TrainerPage = ({ trainerAvatar, setLoading, loading }) => {
  const { trainerName, trainerID } = useContext(MyContext);
  const [mandatoryErrors, setMandatoryErrors] = useState([]);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showTrainerHomePage, setShowTrainerHomePage] = useState(true);
  const [postCoursePage, setPostCoursePage] = useState(false);
  const [myCoursesPage, setMyCoursesPage] = useState(false);
  const [filteredCoursesArr, setFilteredCoursesArr] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [toggleFiltered, setToggleFiltered] = useState(false);
  const [isDataExist, setIsDataExist] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [customersModal, setCustomersModal] = useState(false);
  const [allCustomersPage, setAllCustomersPage] = useState(false);
  const [allCoursesCustomersData, setAllCoursesCustomersData] = useState([]);
  const [allCoursesTrainersData, setAllCoursesTrainersData] = useState([]);
  const [allCoursesPage, setAllCoursesPage] = useState(false);
  let allCustomersCounter = 0;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [cost, setCost] = useState('');

  //setting the time for once, for greeting the appropriate greeting.
  const [time, setTime] = useState(0);
  const [isTimeChecked, setIsTimeChecked] = useState(false);
  if (!isTimeChecked) {
    const today = new Date();
    setTime(today.getHours());
    console.log("Time is: ", time);
    setIsTimeChecked(true);
  }

  useEffect(() => {
    if (filteredCourses.length !== 0) {
      filteredCoursesByExistingCustomer();
    }
  }, [toggleFiltered]);

  let inputFileRef = useRef(null);
  const handlePictureChange = (e) => {
    inputFileRef = e.target.value;
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      previewFiles(file);
    }
  }

  const previewFiles = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPicture(reader.result);
      console.log("image: " + reader.result);
    }
  }

  let isValid = true;
  const handleSubmitCourseAdding = (e) => {
    e.preventDefault();
    let errorsConsole = {};
    setErrors([]);
    setMandatoryErrors([]);
    console.log(e.target.value);
    if ((name && name.length < 2) || name.length > 20) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [name]: "this is redundant" // I need better way to show the error.
      }));
      errorsConsole.name = "Name must be in a range of 2-20 characters!";
      console.log("errors" + errors.name);
    } else if (!name) {
      setMandatoryErrors(prevState => ({ ...prevState, [name]: 'Name feild is mandatory!' }));
      isValid = false;
      errorsConsole.name = "Name feild is mandatory!";
    }
    if ((category && category.length < 2) || category.length > 20) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [category]: "category must be in a range of 2-20 characters!"
      }));
      errorsConsole.lastName = "category must be in a range of 2-10 characters!";
    } else if (!category) {
      isValid = false;
      setMandatoryErrors(prevState => ({ ...prevState, [category]: 'category feild is mandatory!' }));
      errorsConsole.category = "category feild is mandatory!";
    }
    if ((description && description.length < 10) || description.length > 100) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [description]: "description must be in a range of 10-100"
      }));
      errorsConsole.description = "description must be in a range of 10-100";
    } else if (!description) {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [description]: "description feild is mandatory!"
      }));
      errorsConsole.description = "description feild is mandatory!";
    };
    if (!picture) {
      isValid = false;
      errorsConsole.picture = "Picture feild is mandatory!";
      setMandatoryErrors(prevState => ({
        ...prevState,
        [picture]: "Picture feild is mandatory!"
      }));
    };
    if ((lessonTime && lessonTime < 15) || lessonTime > 90) {
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [lessonTime]: "lesson time must be in the range of 15-90 minutes!"
      }));
      errorsConsole.lessonTime = "lesson time must be in the range of 15-90 minutes!"
    } else if (!lessonTime) {
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [lessonTime]: "lesson time feild is mandatory!"
      }));
      errorsConsole.lessonTime = "lesson time feild is mandatory!";
    };
    if ((cost && cost < 0) || cost > 150) {
      console.log("cost ", cost);
      isValid = false;
      setErrors(prevState => ({
        ...prevState,
        [cost]: "price must be in a range of 0-150!"
      }));
      errorsConsole.cost = "price must be lower than 150!"
    }
    else if (!cost) {
      console.log("cost ", cost);
      isValid = false;
      setMandatoryErrors(prevState => ({
        ...prevState,
        [cost]: "price feild is mandatory!"
      }));
      errorsConsole.cost = "price feild is mandatory!";
    };

    if (!isValid || trainerID === "") {
      console.log("trainer ID: ", trainerID)
      console.log('form isn\'t valid!!');
      errorsConsole.isValid = "form isn't valid!!";
      console.warn(errorsConsole);
      return;
    };

    isValid = true;
    setLoading(true);

    const capitalizeFirst = str => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const capitalizedFirstLetterName = capitalizeFirst(name);

    const courseToAddToDB = {
      name: capitalizedFirstLetterName,
      category,
      description,
      pictureToDB: picture,
      lessontime: lessonTime,
      cost,
      trainer: trainerID,
      date: Date.now(),
    };

    console.log(courseToAddToDB)



    setName('');
    setCategory('');
    setDescription('');
    setPicture('');
    setLessonTime('');
    setCost('');
    axios({
      method: 'post',
      url: "http://localhost:8000/course",
      headers: { 'content-type': 'application/json' },
      data: courseToAddToDB
    }).then((res) => {
      console.log('Posting a New Course ', res.data);
      setSubmitted(true);
      resetFileInput(e);
      setLoading(false);
      // const uploadedImg = res.data.cloImageResult;
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleCoursePopup = () => {
    setPostCoursePage(true);
    setShowTrainerHomePage(false);
    setMyCoursesPage(false);
    setIsDataExist(false);
    setAllCustomersPage(false);
    setAllCoursesPage(false);
    setAllCoursesTrainersData([]);
  }

  const closePostCourseHandler = () => {
    setShowTrainerHomePage(true);
    setSubmitted(false);
    setPostCoursePage(false);
    setPicture('');
    setName('');
    setCategory('');
    setDescription('');
    setPicture('');
    setLessonTime('');
    setCost('');
    setErrors([]);
    setMandatoryErrors([]);
  }

  /**
       👇️ Reset the input value of the file after sending, 
       to avoid errors when uploading the file a second time
    */
  const resetFileInput = (e) => {
    e.preventDefault();
    if (inputFileRef.current.value !== null) {
      inputFileRef.current.value = null;
    }
  };

  const getAllTrainerCoursesHandler = (trainerID) => {
    !isDataExist && setLoading(true);
    // console.log("trainerID: ", trainerID)
    if (isDataExist) {
      console.log("return");
      return;
    };
    const id = {
      trainerID
    }

    axios({
      method: 'post',
      url: "http://localhost:8000/course/trainerCourses",
      headers: { 'content-type': 'application/json' },
      data: id
    }).then((res) => {
      console.log('Fetching trainer Customers ', res.data);
      setIsDataExist(true);
      setFilteredCoursesArr(res.data);

      setLoading(false);
      setPostCoursePage(false);
      setShowTrainerHomePage(false);
      setAllCustomersPage(false);
      setAllCoursesPage(false);
      setAllCoursesTrainersData([]);
      setMyCoursesPage(true);
    }).catch((error) => {
      console.log(error);
    });
  }

  const closeMyCoursesPage = () => {
    setShowTrainerHomePage(true);
    setMyCoursesPage(false);
    setToggleFiltered(false);
    setFilteredCourses([]);
    // setFilteredCoursesArr([]);
    setIsDataExist(false);
  }

  const filteredCoursesByExistingCustomer = () => {
    setLoading(true);
    const filtered = [];
    console.log(filteredCoursesArr);
    for (const i in filteredCoursesArr) {
      if (filteredCoursesArr[i].customers.length > 0) {
        filtered.push(filteredCoursesArr[i]);
        setToggleFiltered(true);
      }
    }
    setFilteredCourses(filtered);
    setLoading(false);
    console.log(filteredCourses);
  }

  const unfilteredCourse = () => {
    setLoading(true);
    setToggleFiltered(false);
    setFilteredCourses([]);
    setLoading(false);
  }

  const getCourseCustomers = (customersArr) => {
    setCustomersData([]);
    // console.log("Customers Array: ", customersArr);
    axios({
      method: 'post',
      url: "http://localhost:8000/course/courseCustomers",
      headers: { 'content-type': 'application/json' },
      data: customersArr
    }).then((res) => {
      console.log('Fetching customers ', res.data);
      setCustomersData(res.data);
      toggleCustomersModal(!customersModal);
      // console.log("Customers Data:  ", customersData);
    }).catch((error) => {
      console.log(error);
    });
  }

  const toggleCustomersModal = () => {
    setCustomersModal(!customersModal);
  };

  const getAllCoursesCustomers = (trainerId) => {
    !allCustomersPage && setLoading(true);
    console.log("Data before", allCoursesCustomersData);
    console.log(trainerID);
    const id = {
      trainerId
    }
    axios({
      method: 'post',
      url: "http://localhost:8000/course/coursesCustomers",
      headers: { 'content-type': 'application/json' },
      data: id
    }).then((res) => {
      console.log('Fetching All Courses Customers ', res.data);
      setAllCoursesCustomersData(res.data);
      console.log("Data after", allCoursesCustomersData);

      setLoading(false);
      setPostCoursePage(false);
      setShowTrainerHomePage(false);
      setMyCoursesPage(false);
      setIsDataExist(false);
      setAllCoursesPage(false);
      setAllCoursesTrainersData([]);
      setAllCustomersPage(true);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else if (error.message) {
        console.log(error.message);
      }
    });
  }

  const closeAllCoursesCustomersPage = () => {
    setShowTrainerHomePage(true);
    // setMyCoursesPage(false);
    // setToggleFiltered(false);
    // setFilteredCourses([]);
    // setIsDataExist(false);

    setAllCustomersPage(false);
  }

  // const closeMessageHandler = () => {
  //   setShowTrainerHomePage(true);
  //   setAllCustomersPage(false);
  // }

  const getAllTrainersCoursesHandler = async () => {
    !allCoursesPage && setLoading(true);
    // console.log("loading true: ", loading);
    if (allCoursesTrainersData.length !== 0) {
      console.log("return!!");
      return;
    }

    axios({
      method: 'post',
      url: "http://localhost:8000/course/allTrainersCourses",
      headers: { 'content-type': 'application/json' },
      data: { trainerID }
    }).then((res) => {
      // console.log('Fetching all Trainers Courses ', res.data);
      setAllCoursesTrainersData(res.data)

      setAllCoursesPage(true);
      setLoading(false);
      console.log("loading false: ", loading);
      setPostCoursePage(false);
      setShowTrainerHomePage(false);
      setMyCoursesPage(false);
      setIsDataExist(false);
      setAllCustomersPage(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  const closeAllCoursesPage = () => {
    setShowTrainerHomePage(true);
    setAllCoursesPage(false);
    setAllCoursesTrainersData([]);
  }

  return (
    // <>
    <MyContext.Provider value={{ filteredCoursesArr, setFilteredCoursesArr }}>
      <div className="trainer-page-container">
        {loading && <section className="smooth spinner" >{ }</section>}
        {showTrainerHomePage && <div className="trainer-image-home-container"></div>}
        {postCoursePage &&
          <div className="popup-container">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "1em" }}>
              <button className="close-postCourse-btn" onClick={() => { closePostCourseHandler(); }}>{ }</button>
              {picture && <PreviewPicture src={picture} alt="course-image"></PreviewPicture>}
            </div>
            <form className="postCourse-popup">
              <div style={{ display: "flex", flexDirection: "row", marginBottom: "2.5em" }}>
                <div className="popup-labels">
                  <input
                    className="popupForm-field"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value) }} />
                  {mandatoryErrors[name] ?
                    <span className="error-span">
                      Name field is mandatory!
                    </span> : ''
                  }
                  {errors[name] ?
                    <span className="error-span">
                      Name must be in a range of 2 - 20 characters!
                    </span> : ''
                  }

                  <input
                    className="popupForm-field"
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value) }} />
                  {mandatoryErrors[category] ?
                    <span style={{ fontSize: "12px", color: "red" }}>
                      Category feild is mandatory!
                    </span> : ''
                  }
                  {errors[category] ?
                    <span className="error-span">
                      Category must be in a range of 2 - 20 characters!
                    </span> : ''
                  }

                  <input
                    className="popupForm-field"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }} />
                  {mandatoryErrors[description] ?
                    <span style={{ fontSize: "12px", color: "red" }}>
                      Description feild is mandatory!
                    </span> : ''
                  }
                  {errors[description] ?
                    <span className="error-span">
                      Description must be in a range of 10- 100 characters!
                    </span> : ''
                  }
                </div>
                <div className="popup-labels">
                  <input
                    className="popupForm-field"
                    type="number"
                    placeholder="Lesson Time (minutes)"
                    value={lessonTime}
                    onChange={(e) => { setLessonTime(e.target.value) }} />
                  {mandatoryErrors[lessonTime] ?
                    <span style={{ fontSize: "12px", color: "red" }}>
                      Lesson Time feild is mandatory!
                    </span> : ''
                  }
                  {errors[lessonTime] ?
                    <span className="error-span">
                      Lesson Time must be in the range of 15-90 minutes!
                    </span> : ''
                  }

                  <input
                    className="popupForm-field"
                    type="number"
                    placeholder="Price"
                    value={cost}
                    onChange={(e) => { setCost(e.target.value) }} />
                  {mandatoryErrors[cost] ?
                    <span style={{ fontSize: "12px", color: "red" }}>
                      Price feild is mandatory!
                    </span> : ''
                  }
                  {errors[cost] ?
                    <span style={{ fontSize: "12px", color: "red" }}>
                      price must be in a range of 0-150!
                    </span> : ''
                  }
                  {/* <span style={{ fontSize: '12px', textDecoration: 'underLine', color: 'gray' }}>Upload your picture here:</span> */}

                  <FileInput
                    ref={inputFileRef}
                    className="file-field "
                    type="file"
                    placeholder="Picture"
                    onChange={(e) => { handlePictureChange(e) }}
                    required
                    accept="image/png, image/jpeg, image/jpg, image/jfif"
                  />
                  {mandatoryErrors[picture] ?
                    <span className="error-span">
                      Picture feild is mandatory!
                    </span> : ''
                  }
                </div>
              </div>
              {submitted &&
                <span className="success-posting">
                  Success! Course was added successfully.
                </span>
              }
              <button
                className="btn-popup"
                type="submit"
                onClick={(e) => { handleSubmitCourseAdding(e) }}>
                Upload course
              </button>
            </form>
          </div>
        }

        {
          (myCoursesPage && filteredCoursesArr.length === 0) &&
          <div className="message-emptyArr">
            <span className="close-emptyData-message" onClick={closeMyCoursesPage}>✖</span>
            There are not Courses yet!
          </div>
        }
        {
          (filteredCoursesArr.length > 0 && myCoursesPage) &&
          <div className="my-courses-form" >
            <div className="courses-buttons-div">
              {/* {loading && <section className="smooth spinner" >{ }</section>} */}
              <button className="close-postCourse-btn" onClick={closeMyCoursesPage}>{ }</button>
              <div className="filteredButtons-container">
                {
                  !toggleFiltered
                    ?
                    <button className="filteredButtons" onClick={() => { filteredCoursesByExistingCustomer() }}>Courses with Customers</button>
                    :
                    <button className="filteredButtons" onClick={() => { unfilteredCourse() }}>Unfiltered Courses</button>
                }
              </div>
              <div className="coursesAmount-container">
                Courses Amount
                <span style={{ color: "blue", fontSize: "30px", width: "1em" }}>
                  {filteredCourses.length > 0 ? filteredCourses.length : filteredCoursesArr.length}
                </span>
              </div>
            </div>
            <div className="allCoursesCards-container">
              {
                filteredCourses.length > 0 ?
                  filteredCourses.map((course) =>
                    [
                      <div key={course._id} style={{ display: "flex", flexDirection: "column" }}>
                        <div className="courseCard-container" key={course._id}>
                          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                            <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                          </div>
                          <div className="course-title">Name: <span className="item">{course.name}</span></div>
                          <div className="course-title">Category: <span className="item">{course.category}</span></div>
                          <div className="course-title">Description: <span className="item">{course.description}</span></div>
                          <div className="course-title">Lesson time: <span className="numeric-items">{course.lessontime}</span></div>
                          <div className="course-title">Price: <span className="numeric-items">{course.cost} ₪</span></div>
                          <div className="course-title">Customers:
                            <span className="customers-amount" >{course.customers.length}
                              {/* <div style={{ color: "#334598" }}>Customer/s ID:</div> */}
                            </span>
                            <button className="viewCustomers-btn" onClick={() => { getCourseCustomers(course.customers) }}>
                              View Customer/s
                            </button>

                            {(customersData && customersModal) &&
                              <div className="modal" >
                                <div onClick={toggleCustomersModal} className="overlay-customers"></div>
                                <div className="modal-customer-container" >
                                  {
                                    customersData.map((customer, index) => [
                                      <div key={index} className="customers-modal-card">
                                        <span style={{ fontSize: "15px", color: "white" }}>{customer.firstname + " " + customer.lastname}</span>
                                        <Img customersDisplayAvatar={customer.profilepic.public_id} alt="Customer avatar"></Img>
                                      </div>
                                    ])
                                  }
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="card-actions">
                          <UpdateModal
                            setLoading={setLoading}
                            loading={loading}
                            courseId={course._id}
                            setFilteredCourses={setFilteredCoursesArr}
                            filteredCourses={filteredCoursesArr}
                          />
                          <RemoveModal
                            courseId={course._id}
                            loading={loading}
                            setLoading={setLoading}
                            setIsDataExist={setIsDataExist}
                            setFilteredCoursesArr={setFilteredCoursesArr}
                            toggleFiltered={toggleFiltered}
                            setToggleFiltered={setToggleFiltered}
                          />
                        </div>
                      </div>
                    ]
                  ) :
                  [filteredCoursesArr.map((course) =>
                    <div key={course._id} style={{ display: "flex", flexDirection: "column" }}>
                      <div className="courseCard-container" key={course._id}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                          <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                        </div>
                        <div className="course-title">Name: <span className="item">{course.name}</span></div>
                        <div className="course-title">Category: <span className="item">{course.category}</span></div>
                        <div className="course-title">Description: <span className="item">{course.description}</span></div>
                        <div className="course-title">Lesson time: <span className="numeric-items">{course.lessontime}</span></div>
                        <div className="course-title">Price: <span className="numeric-items">{course.cost} ₪</span></div>
                        <div className="course-title">Customers:
                          {course.customers < 1 ?
                            <span className="numeric-items">{course.customers.length}</span>
                            :
                            [
                              <span className="customers-amount" >{course.customers.length}
                                {/* <div style={{ color: "#334598" }}>Customer/s ID:</div> */}
                              </span>,
                              // <span>
                              //   {course.customers.map((customer, index) =>
                              //     <div style={{ height: "0.7em", display: "flex" }}>
                              //       <span key={index} className="customers-line">{customer}</span>
                              //     </div>
                              //   )}
                              // </span>
                              <button className="viewCustomers-btn" onClick={() => { getCourseCustomers(course.customers) }}>
                                View Customer/s
                              </button>,

                              (customersData && customersModal) &&
                              <div className="modal" >
                                <div onClick={toggleCustomersModal} className="overlay-customers"></div>
                                <div className="modal-customer-container" >
                                  {
                                    customersData.map((customer, index) => [
                                      <div key={index} className="customers-modal-card">
                                        <span style={{ fontSize: "15px", color: "white" }}>{customer.firstname + " " + customer.lastname}</span>
                                        <Img customersDisplayAvatar={customer.profilepic.public_id} alt="Customer avatar"></Img>
                                      </div>
                                    ])
                                  }
                                </div>
                              </div>

                            ]}
                        </div>
                      </div>
                      <div className="card-actions">
                        <UpdateModal courseId={course._id} loading={loading} setLoading={setLoading} />
                        <RemoveModal
                          courseId={course._id}
                          loading={loading}
                          setLoading={setLoading}
                          setIsDataExist={setIsDataExist}
                          setFilteredCoursesArr={setFilteredCoursesArr}
                          toggleFiltered={toggleFiltered}
                          setToggleFiltered={setToggleFiltered}
                        />
                      </div>
                    </div>,
                  ),
                  ]
              }
            </div>
          </div>
        }

        {
          (allCustomersPage && Object.keys(allCoursesCustomersData).length === 0) &&
          <div className="message-emptyArr">
            <span className="close-emptyData-message" onClick={closeAllCoursesCustomersPage}>✖</span>
            There are not Customers yet!</div>
        }
        {
          (allCustomersPage && Object.keys(allCoursesCustomersData).length !== 0) &&
          [
            <div className="my-customers-form">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="close-allCoursesCostomers-container" onClick={closeAllCoursesCustomersPage}>{ }</button>
                <button
                  className="mailToAll-btn"
                  onClick={() => window.location = `mailto:${Object.keys(allCoursesCustomersData).map((keyName) => {
                    return (allCoursesCustomersData[keyName].map((customer) => {
                      return customer.email
                    }));
                  })
                    }?subject=Mail from Train Me: ${trainerName}`}>Send E-Mail to All
                </button>
              </div>
              <div className="allCoursesCustomers-container">
                {
                  [
                    Object.keys(allCoursesCustomersData).map((keyName, keyIndex) => {
                      return (
                        <div key={keyIndex} className="allCardsAndTitlesHolder">
                          <div className="allCoursesCustomers-course-title-holder">
                            {keyName}
                            <div className="customersAmount-insideTitle">{allCoursesCustomersData[keyName].length}</div>
                          </div>
                          <div className="allCoursesCustomers-allCardsHolder">
                            {allCoursesCustomersData[keyName].map((customer, index) => {
                              allCustomersCounter++;
                              return (
                                <div key={index} className="allCoursesCustomers-cardholder">
                                  <div >
                                    <Img courseAvatar={customer.profilepic.public_id} alt="Course avatar"></Img>
                                  </div>
                                  <div className="allCoursesCustomers-card-row">{customer.firstname + " " + customer.lastname}</div>
                                  {/* <div className="allCoursesCustomers-card-row">{customer.email}</div> */}
                                  <div className="allCoursesCustomers-card-row">{customer.phone}</div>
                                  <button className="mail-btn" onClick={() => window.location = `mailto:${customer.email}?subject=Mail from Train Me: ${trainerName} (Course: ${keyName})`}>Send E-Mail</button>
                                </div>
                              )
                            })}
                          </div>
                          <div className="dashed-BorderBetweenCourses"></div>
                        </div>
                      )
                    }),
                    <div className="allCustomers-counter">Total:
                      <span
                        style={{ color: "blue", marginRight: "0.2em", marginLeft: "0.7em", textShadow: "none", textDecoration: "underline" }}>
                        {allCustomersCounter}
                      </span>
                      Customers
                    </div>
                  ]
                }
              </div>
            </div>
          ]
        }

        {allCoursesPage &&
          // <div className="my-courses-form">
          <div className="my-courses-form">
            <div className="myCourses-topBar">
              <button className="close-allCoursesCostomers-container" onClick={closeAllCoursesPage}>{ }</button>
              <div style={{ marginLeft: "auto" }}>
                Total Courses &gt;
                <span style={{ color: "blue", marginLeft: "0.6em" }}>{allCoursesTrainersData.length}</span>
              </div>
            </div>
            <div className="allCoursesCards-container">
              {allCoursesTrainersData.map((course) => {
                return (
                  <div key={course._id} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                    <div className="courseCard-container" key={course._id}>
                      {course.trainer === trainerID &&
                        <div style={{ display: 'flex', justifyContent: "center", color: "lightslategray" }}>My Course</div>
                      }
                      <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                        <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                      </div>
                      <div className="course-title">Name: <span className="item">{course.name}</span></div>
                      <div className="course-title">Category: <span className="item">{course.category}</span></div>
                      <div className="course-title">Description: <span className="item">{course.description}</span></div>
                      <div className="course-title">Lesson time: <span className="numeric-items">{course.lessontime}</span></div>
                      <div className="course-title">Price: <span className="numeric-items">{course.cost} ₪</span></div>
                      {(course.trainer === trainerID && course.customers < 1)
                        ? <div className="course-title">Customers: <span className="numeric-items" style={{ marginBottom: "0.2em" }}>{course.customers}</span></div>
                        : (course.trainer === trainerID && course.customers >= 1) ?
                          <div className="course-title">Customers: <span className="customers-amount" style={{ marginBottom: "0.2em" }}>{course.customers}</span></div> : ""}
                    </div>
                  </div>)
              })}
            </div>
          </div>
          // </div>
        }

        <div className="trainer-actions-container">
          {trainerName &&
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                {(time >= 0 && time < 12) && <span className="trainer-gretting" >Good Morning</span>}
                {(time < 16 && time >= 12) && <span className="trainer-gretting" >Good AfterNoon</span>}
                {(time <= 23 && time >= 16) && <span className="trainer-gretting" >Good Evening</span>}
                <div className="trainer-userName">{trainerName}</div>
              </div>
              {trainerAvatar &&
                <Img trainerAvatar={trainerAvatar} alt="Trainer avatar" style={{marginRight: "0.2em"}}></Img>
              }
            </div>}
          <Marginer direction="vertical" margin="1em" />
          <div className="trainer-action-btns-container">
            <button className="trainer-actions-btn" onClick={() => { handleCoursePopup() }} >
              Add a new Course
            </button>
            <button className="trainer-actions-btn" onClick={() => { getAllTrainerCoursesHandler(trainerID) }} >
              My Courses
            </button>
            <button className="trainer-actions-btn" onClick={() => { getAllCoursesCustomers(trainerID) }} >
              My Customers
            </button>
            <button className="trainer-actions-btn" onClick={getAllTrainersCoursesHandler} >
              All Courses
            </button>
          </div>
        </div>
      </div>
    </MyContext.Provider >
    // </>

  )
}

export default TrainerPage