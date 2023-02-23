import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MyContext from '../../../MyContext';
import Img from '../../../customHooks/Img';
import './CourseDetailsInMyCourses.css';
import axios from 'axios';

const CourseDetailsInMyCourses = () => {
    const { customerMyCoursesDataForCoursePage } = useContext(MyContext);

    const { id } = useParams();
    const navigate = useNavigate();
    const [singleCourse, setSingleCourse] = useState({});

    const { state } = useLocation();
    const [scrollPositionToSentBack, setScrollPositionToSentBack] = useState(-1)

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

    const [counter, setCounter] = useState(0);

    useEffect(() => {
        /** setting and filtering the single course item of my course. */
        if (customerMyCoursesDataForCoursePage.length > 0 && id !== undefined) {
            const itemPage = customerMyCoursesDataForCoursePage.find((course) => course.id === id);
            // console.log("Item page: ", itemPage);
            setSingleCourse(itemPage);
            if (counter === 0 && itemPage.trainer_id !== "") {
                // console.log("itemPage.trainer_id: ", itemPage.trainer_id);
                getTrainerById(itemPage.trainer_id);
                setCounter(counter + 1);
            }
            // console.log("customerMyCoursesDataForCoursePage: ", customerMyCoursesDataForCoursePage);
        }

        /** Setting a state with the scroll position of the prev page to locate it and navigate to it. */
        if (state !== null) {
            // console.log("State: ", state);
            setScrollPositionToSentBack(state.scrollPosition);
            // scrollPositionToSentBack !== -1 && console.log("State from CustomerPage component!!  ", scrollPositionToSentBack);
        }
    }, [customerMyCoursesDataForCoursePage, id, state, scrollPositionToSentBack])

    return (
        singleCourse.picture !== undefined ?
            <div className="courseDetailsPage-container">
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
                                    <div className="c-rating-elements" ><span>Rate</span> <span style={{ color: "rgb(75, 68, 68)" }}>{trainerData.rating.rate}</span></div>
                                    <div className="c-rating-elements" ><span>Count </span><span style={{ color: "rgb(75, 68, 68)" }}> {trainerData.rating.count}</span></div>
                                </div>
                            </div>
                            <div style={{ marginLeft: "2em", width: "25rem" }}>
                                <Img customerCoursePageAvatar={trainerData.profilepic.public_id} alt="Course avatar"></Img>
                            </div>
                        </div>
                    </div>}
                <button className="coursePage-goBack-btn" onClick={() => navigate('/customer', { state: { customerMyCoursesDataForCoursePage, scrollPositionToSentBack } })}>	&#171; Back</button>
            </div> : null
    )
}

export default CourseDetailsInMyCourses