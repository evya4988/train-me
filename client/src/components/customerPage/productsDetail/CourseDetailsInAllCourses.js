import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MyContext from '../../../MyContext';
import Img from '../../../customHooks/Img';
import './CourseDetailsInAllCourses.css';


const CourseDetailsInAllCourses = () => {
    const { customerCoursesDataForCoursePage } = useContext(MyContext);

    const { id } = useParams();
    const [singleCourse, setSingleCourse] = useState({});
    const navigate = useNavigate();

    const { state } = useLocation();
    const [scrollPositionToSentBack, setScrollPositionToSentBack] = useState(-1)

    useEffect(() => {
        /** setting and filtering the single course item. */
        // console.log("ID: ", id);
        if (customerCoursesDataForCoursePage.length > 0 && id !== undefined) {
            const itemPage = customerCoursesDataForCoursePage.find((course) => course.id === id);
            setSingleCourse(itemPage);
            // singleCourse.picture !== undefined && console.log("Course: ", singleCourse.picture);
            // console.log("CustomerCoursesDataForCoursePage: ", customerCoursesDataForCoursePage);
        }

        /** Setting a state with the scroll position of the prev page to locate it and navigate to it. */
        if (state !== null) {
            console.log("State: ", state);
            setScrollPositionToSentBack(state.scrollPosition);
            scrollPositionToSentBack !== -1 && console.log("State from CustomerPage component!!  ", scrollPositionToSentBack);
        }
    }, [customerCoursesDataForCoursePage, id, state, scrollPositionToSentBack])

    return (
        singleCourse.picture !== undefined ?
            <div className="courseDetailsPage-container" >
                <div className="courseDetails-container">
                    <div className="coursePage-allTitles">
                        <div className='courseName-outerDiv'><div className="coursePage-courseName">{singleCourse.name}</div></div>
                        <div className="coursePage-title-container">Trainer
                            <span className="coursePage-title-arrow">&gt;</span>
                            <span className="coursePage-title">{singleCourse.trainer}</span>
                        </div>
                        <div className="coursePage-title-container">Price
                            <span className="coursePage-title-arrow">&gt;
                            </span> <span className="coursePage-title">{singleCourse.cost}$</span>
                        </div>
                        <div className="coursePage-title-container">Lesson Time
                            <span className="coursePage-title-arrow">&gt;</span>
                            <span className="coursePage-title">{singleCourse.lessontime} Minutes</span>
                        </div>
                        <div className="coursePage-title-container">Description
                            <span className="coursePage-title-arrow">&gt;</span>
                            <div className="coursePage-title">{singleCourse.description}</div>
                        </div>
                    </div>
                    <div style={{ marginLeft: "2em" }}>
                        <Img customerCoursePageAvatar={singleCourse?.picture.public_id} alt="Course avatar"></Img>
                    </div>
                </div>
                <button className="coursePage-goBack-btn" onClick={() => navigate('/customer', { state: { customerCoursesDataForCoursePage, scrollPositionToSentBack } })}>Back to All Courses</button>
            </div> : null
    )
}

export default CourseDetailsInAllCourses