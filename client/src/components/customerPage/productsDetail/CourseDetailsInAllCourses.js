import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MyContext from '../../../MyContext';
import Img from '../../../customHooks/Img';
import './CourseDetailsInAllCourses.css';
import axios from 'axios';

const CourseDetailsInAllCourses = () => {
    const { customerCoursesDataForCoursePage, customerID } = useContext(MyContext);

    const { id } = useParams();
    const navigate = useNavigate();
    const [singleCourse, setSingleCourse] = useState({});

    const { state } = useLocation();
    const [scrollPositionToSentBack, setScrollPositionToSentBack] = useState(-1);

    const [isSuccessRegistered, setIsSuccessRegistered] = useState(false);
    const [unsuccessRegistered, setUnsuccessRegistered] = useState(false);

    const [trainerData, setTrainerData] = useState({});
    const getTrainerById = async (id) => {
        try {
            const allTrainersUrl = `http://localhost:8000/trainer/${id}`;
            const response = await axios.get(allTrainersUrl);
            // console.log("response", response);
            const data = await response.data;
            // console.log("data: ", data);
            setTrainerData(data);

        } catch (error) {
            console.log(error);
        }
    }

    const registerToCourse = () => {

        const dataToServer = {
            courseId: singleCourse.id,
            customerId: customerID
        };
        // console.log(dataToServer);

        axios({
            method: 'post',
            url: "http://localhost:8000/course/registerToCourse",
            headers: { 'content-type': 'application/json' },
            data: dataToServer
        }).then((res) => {
            console.log(res);
            console.log("res.data: ", res.data);
            res.status === 200 && setIsSuccessRegistered(true);
        }).catch((error) => {
            if (error.response) {
                // console.log(error.response)
                error.response.data.message === "The customer has already registered for this course" && setUnsuccessRegistered(true);
            } else if (error.request) {
                console.log(error.request);
            } else if (error.message) {
                console.log(error.message);
            }
        });
    }

    const [counter, setCounter] = useState(0);

    useEffect(() => {
        /** setting and filtering the single course item of a course in all courses. */
        // console.log("ID: ", id);
        if (customerCoursesDataForCoursePage.length > 0 && id !== undefined) {
            const itemPage = customerCoursesDataForCoursePage.find((course) => course.id === id);
            setSingleCourse(itemPage);
            console.log("itemPage: ", itemPage);
            if (counter === 0 && itemPage.trainer_id !== "") {
                getTrainerById(itemPage.trainer_id);
                setCounter(counter + 1);
            }
            // console.log("customerID: ", customerID);
            // console.log("CustomerCoursesDataForCoursePage: ", customerCoursesDataForCoursePage);
        }

        /** Setting a state with the scroll position of the prev page to locate it and navigate to it. */
        if (state !== null) {
            // console.log("State: ", state);
            setScrollPositionToSentBack(state.scrollPosition);
            // scrollPositionToSentBack !== -1 && console.log("State from CustomerPage component!!  ", scrollPositionToSentBack);
        }

        if (isSuccessRegistered) {
            const successId = setTimeout(() => {
                setIsSuccessRegistered(false);
                navigate('/customer', { state: { customerCoursesDataForCoursePage, scrollPositionToSentBack } })
            }, 3000);
            return () => clearTimeout(successId)
        }

        // console.log("isSuccessRegistered: ", isSuccessRegistered);
    }, [customerCoursesDataForCoursePage, id, state, scrollPositionToSentBack, isSuccessRegistered])

    return (
        singleCourse.picture !== undefined ?
            <div className="courseDetailsPage-container" >
                <div className="courseDetails-container">
                    <div className="coursePage-allTitles">
                        <div className='courseName-outerDiv'><div className="coursePage-courseName">{singleCourse.name}</div></div>
                        {/* <div className="coursePage-allCourseTitles-container">
                            <span className="coursePage-title">Trainer</span>
                            <span className="coursePage-title-arrow">&gt;</span>
                            <span className="coursePage-title-name">{singleCourse.trainer}</span>
                        </div> */}
                        <div className="coursePage-allCourseTitles-container">
                            <span className="coursePage-title">Price</span>
                            <span className="coursePage-title-arrow">&gt;</span>
                            <span className="coursePage-title-name">{singleCourse.cost}$</span>
                        </div>
                        <div className="coursePage-allCourseTitles-container">
                            <span className="coursePage-title">Lesson Time</span>
                            <span className="coursePage-title-arrow">&gt;</span>
                            <span className="coursePage-title-name">{singleCourse.lessontime} Minutes</span>
                        </div>
                        <div className="coursePage-allCourseTitles-container">
                            <span className="coursePage-title">Description</span>
                            <span className="coursePage-title-arrow">&gt;</span>
                            <div className="coursePage-title-name">{singleCourse.description}</div>
                        </div>
                    </div>
                    <div style={{ marginLeft: "2em", width: "25rem" }}>
                        <Img customerCoursePageAvatar={singleCourse?.picture.public_id} alt="Course avatar"></Img>
                    </div>
                </div>
                {(trainerData.profilepic !== undefined) &&
                    <div className="coursePage-trainerDetails">
                        <div className="coursePage-trainerDetails-container">
                            <div className="coursePage-allTrainerTitles">
                                <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Trainer</span>
                                    <span className="coursePage-title-arrow">&gt;</span>
                                    <span className="coursePage-title-name">{trainerData.firstname + " " + trainerData.lastname}</span>
                                </div>
                                <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Gender</span>
                                    <span className="coursePage-title-arrow">&gt;
                                    </span> <span className="coursePage-title-name">{trainerData.gender}</span>
                                </div>
                                <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Email</span>
                                    <span className="coursePage-title-arrow">&gt;</span>
                                    <span className="coursePage-title-name">{trainerData.email}</span>
                                </div>
                                <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Age</span>
                                    <span className="coursePage-title-arrow">&gt;</span>
                                    <div className="coursePage-title-name">{trainerData.age}</div>
                                </div>
                                <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Rating</span>
                                    <span className="coursePage-title-arrow">&gt;</span>
                                    {/* <div className="c-rating-elements" ><span>Rate</span> <span style={{ color: "rgb(75, 68, 68)" }}>{trainerData.rating.rate}</span></div>
                                    <div className="c-rating-elements" ><span>Count </span><span style={{ color: "rgb(75, 68, 68)" }}> {trainerData.rating.count}</span></div> */}
                                </div>
                            </div>
                            <div style={{ marginLeft: "2em", width: "25rem" }}>
                                <Img customerCoursePageAvatar={trainerData.profilepic.public_id} alt="Course avatar"></Img>
                            </div>
                        </div>
                    </div>}
                <button
                    className="coursePage-goBack-btn"
                    onClick={() => navigate('/customer', { state: { customerCoursesDataForCoursePage, scrollPositionToSentBack } })}>
                    &#171; Back
                </button>
                <button
                    className="coursePage-register-btn"
                    onClick={registerToCourse}>Register now
                </button>
                {
                    isSuccessRegistered &&
                    <div className="registered-message-alert" style={{ backgroundColor: "lightgreen" }}>
                        You have successfully registered for the course
                    </div>
                }
                {
                    unsuccessRegistered &&
                    <div className="registered-message-alert" style={{ backgroundColor: "lightcoral" }}>
                        You're already registered for this course
                    </div>
                }
            </div> : null
    )
}

export default CourseDetailsInAllCourses