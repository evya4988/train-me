import React, { useState, useContext, useEffect } from 'react';
import './CustomerPage.css';
import Img from '../../customHooks/Img';
import MyContext from '../../MyContext';
import { Marginer } from '../marginer';
import axios from 'axios';
import BackToTopBtn from '../../customHooks/BackToTopBtn';
import { useNavigate, useLocation } from 'react-router-dom';
import useScrollPosition from "../../customHooks/useScrollPosition";

const CustomerPage = ({ customerAvatar }) => {
  const {
    customerName,
    customerID,
    setCustomerCoursesDataForCoursePage,
    setCustomerMyCoursesDataForCoursePage } = useContext(MyContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  let scrollPosition = useScrollPosition();
  const [scrollPositionToNavigate, setScrollPositionToNavigate] = useState(0);

  //Setting the time once, to say the appropriate blessing depends on the time of day.
  const [time, setTime] = useState(0);
  const [isTimeChecked, setIsTimeChecked] = useState(false);
  if (!isTimeChecked) {
    const today = new Date();
    setTime(today.getHours());
    setIsTimeChecked(true);
    // console.log("Time is: ", today.getHours());
  }

  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [allTrainersPartialData, setAllTrainersPartialData] = useState([]);
  const [filterTrainersByGender, setFilterTrainersByGender] = useState([]);
  const [isFemale, setIsFemale] = useState(false);
  const [emptyDataMessage, setEmptyDataMessage] = useState("");

  const getMyCourses = async (customerId) => {
    if (myCourses.length > 0) return;
    console.log("id: ", customerId);
    const id = {
      customerId
    }
    axios({
      method: 'post',
      url: "http://localhost:8000/Course/registeredCourses",
      headers: { 'content-type': 'application/json' },
      data: id
    }).then((res) => {
      console.log(res);
      setMyCourses(res.data);
      console.log("res.data: ", res.data);
      // console.log("myCourses: ", myCourses);
      setCustomerMyCoursesDataForCoursePage(res.data);
      setAllCourses([]);
      setAllTrainersPartialData([]);
      setFilterTrainersByGender([]);
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

  const closeMyCoursesPage = () => {
    setMyCourses([]);
  }

  const getAllTrainers = async (e) => {
    e.preventDefault();
    if ((allTrainersPartialData.length > 0 && filterTrainersByGender.length === 0) || customerID === '') return;
    try {
      const allTrainersUrl = 'http://localhost:8000/trainer/trainersData/forCustomers';
      const response = await axios.get(allTrainersUrl);
      console.log(response);
      const data = await response.data;
      setAllTrainersPartialData(data);
      // console.log("allTrainers-PartialData: ", data);
      setAllCourses([]);
      setMyCourses([]);
      setFilterTrainersByGender([]);
    } catch (error) {
      console.log("error: ", error);
      setMyCourses([]);
      setEmptyDataMessage(error.response.data)
    }
  }

  const filterByGender = () => {
    try {
      // if (customerID === '') return;
      if (allTrainersPartialData.length > 0) {
        const tempArr = [];
        if (!isFemale) {
          setIsFemale(!isFemale);
          // console.log("Is Female: ", isFemale);
          allTrainersPartialData.map((trainer) => {
            return trainer.gender !== 'male' ? tempArr.push(trainer) : null
          })
        } else {
          setIsFemale(!isFemale);
          // console.log("Is Female: ", isFemale);
          allTrainersPartialData.map((trainer) => {
            return trainer.gender !== 'female' ? tempArr.push(trainer) : null
          })
        }
        console.log(tempArr);
        setFilterTrainersByGender(tempArr);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closeAllTrainersPage = () => {
    setAllTrainersPartialData([]);
    setFilterTrainersByGender([]);
  }

  const getAllCourses = async () => {
    if (allCourses.length > 0 || customerID === '') return;
    try {
      const allCoursesUrl = 'http://localhost:8000/course/customer/allCoursesForCustomerPage';
      const response = await axios.get(allCoursesUrl);
      // console.log(response);
      const data = await response.data;
      console.log(data);
      setAllCourses(data);
      setCustomerCoursesDataForCoursePage(data);
      setAllTrainersPartialData([]);
      setMyCourses([]);
      setFilterTrainersByGender([]);
    } catch (error) {
      console.log(error);
      setMyCourses([]);
      setEmptyDataMessage(error.response.data);
    }
  }

  const closeAllCoursesPage = () => {
    setAllCourses([]);
  }

  useEffect(() => {
    // Set the initial scroll position when the component mounts.
    if (state !== null) {
      console.log("State: ", state);
      setScrollPositionToNavigate(state.scrollPositionToSentBack);
      state.customerCoursesDataForCoursePage && setAllCourses(state.customerCoursesDataForCoursePage);
      state.customerMyCoursesDataForCoursePage && setMyCourses(state.customerMyCoursesDataForCoursePage);
    }

    // Update the scroll position whenever the state property changes.
    if (state !== null && state.scrollPositionToSentBack !== scrollPosition) {
      setScrollPositionToNavigate(state.scrollPositionToSentBack);
    }
  }, [state]);

  // Use the scrollPosition state to set the scroll position.
  useEffect(() => {
    window.scrollTo(0, scrollPositionToNavigate);
  }, [scrollPositionToNavigate]);

  return (
    <>
      {
        (customerID && customerName) &&
        <div className="customer-page-container">
          {
            myCourses === 'empty' ?
                <div className='emptyData-message'>
                You have not registered for any course yet !
              </div>
              : (myCourses.length > 0 && myCourses !== 'empty') ?
                <div>
                  <div className="allTrainers-topBar">
                    <button className="close-allTrainers-container" onClick={closeMyCoursesPage}></button>
                    <div style={{ display: 'flex' }}>
                      <span className="amount-statement">My Courses Amount</span>
                      <Marginer direction="horizontal" margin="0.3em" />
                      &gt;
                      <Marginer direction="horizontal" margin="0.3em" />
                      {myCourses.length}
                    </div>
                  </div>
                  <div>
                    <div className='allCardsPages-customerPage-container'>
                      {
                        myCourses.map((course) => {
                          return (
                            <div key={course.id} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>

                              <div
                                onClick={() => { navigate(`/customer/mycourses/${course.id}`, { state: { scrollPosition } }) }}
                                className="myCourses-customerPage-container">
                                <div className="my_all_Courses-courseName-title">{course.name}</div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                  <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                                </div>
                                <div className="customer-myCoursesCards-title">Category<span className="data-item">{course.category}</span></div>
                                <div className="customer-myCoursesCards-title">Lesson Time<span className="data-item">{course.lessontime}</span></div>
                                <div className="customer-myCoursesCards-title">Price<span className="data-item">{course.cost}</span></div>
                                <div className="customer-myCoursesCards-title">Description<span className="data-item">{course.description}</span></div>
                                <div style={{ textAlign: 'center', color: "rgb(30, 87, 125)" }}>Trainer</div>
                                <div className="trainerName-data-item">{course.trainer}</div>
                              </div>
                            </div>
                          )
                        })
                      }
                      <BackToTopBtn />
                    </div>
                  </div>
                </div>
                : allTrainersPartialData.length === 0 && emptyDataMessage === 'empty' ?
                    <div className='emptyData-message'>
                      There are not Trainer yet !
                  </div>
                  : allTrainersPartialData.length > 0 ?
                    <div>
                      <div className="allTrainers-topBar">
                        <button className="close-allTrainers-container" onClick={closeAllTrainersPage}></button>
                        <div style={{ display: "flex" }}>
                          <button
                            // className=filterTrainersByGender.length === 0 ?"filterByGender-btn": ""
                            className={`${filterTrainersByGender.length === 0 ? "filterByGender-btn" : isFemale ? "maleGender-btn" : "femaleGender-btn"}`}
                            onClick={filterByGender}>
                            {filterTrainersByGender.length === 0 ? "Sort by Gender" : isFemale ? "Male" : "Female"}
                          </button>
                          <span className='amount-statement'>
                            {filterTrainersByGender.length === 0 ? 'Trainers Amount'
                              : isFemale ? 'Female Trainers Amount' : 'Male Trainers Amount'}
                          </span>
                          <Marginer direction="horizontal" margin="0.3em" />
                          &gt;
                          <Marginer direction="horizontal" margin="0.3em" />
                          <span>
                            {
                              filterTrainersByGender.length > 0 ?
                                filterTrainersByGender.length :
                                allTrainersPartialData.length
                            }
                          </span>
                        </div>
                      </div>
                      <div className='allCardsPages-customerPage-container'>
                        {
                          filterTrainersByGender.length > 0 ?
                            [
                              filterTrainersByGender.map((trainer, index) => {
                                return (
                                  <div key={index} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                                    <div className="allCards-customerPage-container">
                                      <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                        <Img trainersDisplayAvatar={trainer.profilepic.public_id} alt="Trainer avatar"></Img>
                                      </div>
                                      <div className="customer-trainersCards-trainerName">
                                        <span className="customer-allTrainers-trainerName">{trainer.firstname + " " + trainer.lastname}</span>
                                      </div>
                                      {/* <div className="customer-trainersCards-title">Gender: <span className="item">{trainer.gender}</span></div> */}
                                      <div className={`${isFemale ? "customer-trainersCards-title rating-female-title" : "customer-trainersCards-title rating-male-title"}`}>Rating
                                        <div className="trainer-rating-items">
                                          <div>Rate: <span className="item-rating-number">{"njhihihihihihi"}</span></div>
                                          <div>Count: <span className="item-rating-number">{"ijijii jjhiji"}</span></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }),
                              <BackToTopBtn />
                            ]
                            :
                            [
                              allTrainersPartialData.map((trainer, index) => {
                                return (
                                  <div key={index} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                                  {/* {console.log("allTrainersPartialData: ", allTrainersPartialData)} */}
                                    <div className="allCards-customerPage-container">
                                      <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                        <Img trainersDisplayAvatar={trainer.profilepic.public_id} alt="Trainer avatar"></Img>
                                      </div>
                                      <div className="customer-trainersCards-trainerName">
                                        <span className="customer-allTrainers-trainerName">{trainer.firstname + " " + trainer.lastname}</span>
                                      </div>
                                      {/* <div className="customer-trainersCards-title">Gender: <span className="item">{trainer.gender}</span></div> */}
                                      <div className="customer-trainersCards-title">Rating
                                        <div className="trainer-rating-items">
                                          {/* <div >Rate: <span className="item-rating-number">{trainer.rating.rate}</span></div>
                                          <div >Count: <span className="item-rating-number">{trainer.rating.count}</span></div> */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                              ,
                              <BackToTopBtn />
                            ]
                        }
                      </div>
                    </div>
                      : allCourses.length === 0 && emptyDataMessage === 'no courses' ?
                      <div className='emptyData-message'>
                        There are not Courses yet !
                      </div>
                      : allCourses.length > 0 ?
                        <div>
                          <div className="allTrainers-topBar">
                            <button className="close-allTrainers-container" onClick={closeAllCoursesPage}></button>
                            <div style={{ display: "flex" }}>
                              <span className="amount-statement">All Courses Amount</span>
                              <Marginer direction="horizontal" margin="0.3em" />
                              &gt;
                              <Marginer direction="horizontal" margin="0.3em" />
                              {allCourses.length}
                            </div>
                          </div>
                          <div className='allCardsPages-customerPage-container'>
                            {allCourses.map((course) => {
                              return (
                                <div
                                  key={course.id}
                                  style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}
                                  onClick={() => { navigate(`/customer/allcourses/${course.id}`, { state: { scrollPosition } }) }}>
                                  <div className="allCards-customerPage-container allCoursesCards" >
                                    <div className="my_all_Courses-courseName-title">{course.name}</div>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                      <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                                    </div>
                                    <div className="customer-allCoursesCards-title">Lesson Time: <span className="data-item">{course.lessontime}</span></div>
                                    <div className="customer-allCoursesCards-title">Price: <span className="data-item">{course.cost}</span></div>
                                    <div style={{ margin: "0 0.4em 0 0.4em", color: "rgb(136, 116, 116)", display: "flex", flexDirection: "column", alignItems: "center" }}>Description:
                                      <span className="data-item" style={{ marginBottom: "1em" }}>{course.description}
                                      </span>
                                    </div>
                                    <div
                                      className="allCoursesCards-trainerLabel"
                                      style={{ textAlign: "center" }}>Trainer
                                      <span className="trainerName-data-item">{course.trainer}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                            <BackToTopBtn />
                          </div>
                        </div>
                        :
                        <div className="customer-image-home-container"></div>
          }

          <div className="customer-actions-container">
            {
              customerName &&
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {(time >= 0 && time < 12) && <span className="customer-gretting" >Good Morning</span>}
                  {(time < 16 && time >= 12) && <span className="customer-gretting" >Good AfterNoon</span>}
                  {(time <= 23 && time >= 16) && <span className="customer-gretting" >Good Evening</span>}
                  <div className="customer-userName">{customerName}</div>
                </div>
                {customerAvatar &&
                  <Img customerAvatar={customerAvatar} alt="Customer avatar"></Img>
                }
              </div>
            }
            <Marginer direction="vertical" margin="1em" />
            <div className="action-btns-container">
              <button className="customer-actions-btn" onClick={() => { getMyCourses(customerID) }} >
                My Courses
              </button>
              <button className="customer-actions-btn" onClick={(e) => { getAllTrainers(e) }} >
                All Trainers
              </button>
              <button className="customer-actions-btn" onClick={() => { getAllCourses() }} >
                All Courses
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default CustomerPage