import React, { useState, useContext } from 'react';
import './CustomerPage.css';
import Img from '../../customHooks/Img';
import MyContext from '../../MyContext';
import { Marginer } from '../marginer';
import axios from 'axios';

const CustomerPage = ({ customerAvatar }) => {
  const { customerName, customerID } = useContext(MyContext);

  //setting the time for once, for greeting the appropriate greeting.
  const [time, setTime] = useState(0);
  const [isTimeChecked, setIsTimeChecked] = useState(false);
  if (!isTimeChecked) {
    const today = new Date();
    setTime(today.getHours());
    console.log("Time is: ", time);
    setIsTimeChecked(true);
  }

  const [allTrainersPartialData, setAllTrainersPartialData] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [filterTrainersByGender, setFilterTrainersByGender] = useState([]);
  const [isFemale, setIsFemale] = useState(false);

  const getMyCourses = async (customerId) => {
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
      console.log("myCourses: ", myCourses);
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
    if (allTrainersPartialData.length > 0) return;
    try {
      const allTrainersUrl = 'http://localhost:8000/trainer/trainersData/forCustomers';
      const response = await axios.get(allTrainersUrl);
      // console.log(response);
      const data = await response.data;
      setAllTrainersPartialData(data);
      console.log(allTrainersPartialData);
      setAllCourses([]);
      setMyCourses([]);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const filterByGender = () => {
    try {
      if (allTrainersPartialData.length > 0) {
        const tempArr = [];
        if (!isFemale) {
          allTrainersPartialData.map((trainer) => {
            if (trainer.gender !== 'male') {
              tempArr.push(trainer);
            }
          });
          setIsFemale(!isFemale);
          // console.log("Is Female: ", isFemale);
        } else {
          allTrainersPartialData.map((trainer) => {
            if (trainer.gender !== 'female') {
              tempArr.push(trainer);
            }
          });
          setIsFemale(!isFemale);
          // console.log("Is Female: ", isFemale);
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
    if (allCourses.length > 0) return;
    try {
      const allCoursesUrl = 'http://localhost:8000/course/coursesForCustomers/dedicatedCourses';
      const response = await axios.get(allCoursesUrl);
      // console.log(response);
      const data = await response.data;
      setAllCourses(data);
      console.log(data);
      setAllTrainersPartialData([]);
      setMyCourses([]);
      setFilterTrainersByGender([]);
    } catch (error) {
      console.log(error);
    }
  }

  const closeAllCoursesPage = () => {
    setAllCourses([]);
  }

  return (
    <>
      <div className="customer-page-container">
        {
          myCourses === 'empty' ?
            <div>
              No courses have been registered yet!
            </div>
            : (myCourses.length > 0 && myCourses !== 'empty') ?
              <div>
                <div className="allTrainers-topBar">
                  <button className="close-allTrainers-container" onClick={closeMyCoursesPage}></button>
                  <span>My Courses Amount &gt; {myCourses.length}</span>
                </div>
                <div>
                  <div className='allCardsPages-customerPage-container'>
                    {
                      myCourses.map((course) => {
                        return (
                          <div key={course._id} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                            <div className="myCourses-customerPage-container">
                              <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                              </div>
                              <div className="trainersCards-title" style={{ textAlign: 'center' }}><span className="data-item" style={{ fontSize: "20px" }}>{course.name}</span></div>
                              <div className="trainersCards-title">Category: <span className="data-item">{course.category}</span></div>
                              <div className="trainersCards-title">Lesson Time: <span className="data-item">{course.lessontime}</span></div>
                              <div className="trainersCards-title">Price: <span className="data-item">{course.cost}</span></div>
                              <div className="trainersCards-title">Description: <span className="data-item">{course.description}</span></div>
                              <div style={{ textAlign: 'center', color: "rgb(30, 87, 125)" }}>Trainer</div>
                              <div style={{ textAlign: 'center', color: "whitesmoke" }} className="data-item">{course.trainer}</div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              : allTrainersPartialData.length > 0 ?
                <div>
                  <div className="allTrainers-topBar">
                    <button className="close-allTrainers-container" onClick={closeAllTrainersPage}></button>
                    <div style={{ display: "flex" }}>
                      <button
                        className="filterByGender-btn"
                        onClick={filterByGender}>
                        {filterTrainersByGender.length === 0 ? "Filter By Gender" : isFemale ? "male" : "female"}
                      </button>
                      <span>Trainers Amount &gt;
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
                        filterTrainersByGender.map((trainer) => {
                          return (
                            <div key={trainer._id} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                              <div className="allCards-customerPage-container">
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                  <Img trainersDisplayAvatar={trainer.profilepic.public_id} alt="Trainer avatar"></Img>
                                </div>
                                <div className="trainersCards-title"><span className="item">{trainer.firstname + " " + trainer.lastname}</span></div>
                                <div className="trainersCards-title">Gender: <span className="item">{trainer.gender}</span></div>
                                <div className="trainersCards-title" style={{ textAlign: "center" }}>Rating:
                                  <div className="item">Rate: {trainer.rating.rate}</div>
                                  <div className="item">Count: {trainer.rating.count}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        :
                        allTrainersPartialData.map((trainer) => {
                          return (
                            <div key={trainer._id} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                              <div className="allCards-customerPage-container">
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                  <Img trainersDisplayAvatar={trainer.profilepic.public_id} alt="Trainer avatar"></Img>
                                </div>
                                <div className="trainersCards-title"><span className="item">{trainer.firstname + " " + trainer.lastname}</span></div>
                                <div className="trainersCards-title">Gender: <span className="item">{trainer.gender}</span></div>
                                <div className="trainersCards-title" style={{ textAlign: "center" }}>Rating:
                                  <div className="item">Rate: {trainer.rating.rate}</div>
                                  <div className="item">Count: {trainer.rating.count}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                    }
                  </div>
                </div>
                : allCourses.length > 0 ?
                  <div>
                    <div className="allTrainers-topBar">
                      <button className="close-allTrainers-container" onClick={closeAllCoursesPage}></button>
                      <span>All Courses Amount &gt; {allCourses.length}</span>
                    </div>
                    <div className='allCardsPages-customerPage-container'>
                      {
                        allCourses.map((course) => {
                          return (
                            <div key={course._id} style={{ display: "flex", flexDirection: "column", padding: "0.2em" }}>
                              <div className="allCards-customerPage-container">
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5em", marginBottom: "0.5em" }}>
                                  <Img courseAvatar={course.picture.public_id} alt="Course avatar"></Img>
                                </div>
                                <div className="trainersCards-title"><span className="data-item">{course.name}</span></div>
                                <div className="trainersCards-title">Lesson Time: <span className="data-item">{course.lessontime}</span></div>
                                <div className="trainersCards-title">Price: <span className="data-item">{course.cost}</span></div>
                                <div className="trainersCards-title">Description: <span className="data-item">{course.description}</span></div>
                                <div className="allCoursesCards-trainerLabel">Trainer: <span className="data-item">{course.trainer}</span></div>
                              </div>
                            </div>
                          )
                        })
                      }
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
    </>
  )
}

export default CustomerPage