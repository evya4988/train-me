import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MyContext from '../../../MyContext';
import Img from '../../../customHooks/Img';
import './CourseDetailsInMyCourses.css';
import './CourseDetailsInAllCourses.css';
import axios from 'axios';
import StarsRating from '../starsRating/StarsRating';

const CourseDetailsInMyCourses = () => {
    const { customerMyCoursesDataForCoursePage, setCustomerMyCoursesDataForCoursePage, customerID } = useContext(MyContext);

    const { id } = useParams();
    const navigate = useNavigate();
    const [singleCourse, setSingleCourse] = useState({});
    const [thumbsState, setThumbsState] = useState(false);

    const { state } = useLocation();
    const [scrollPositionToSentBack, setScrollPositionToSentBack] = useState(-1);

    const [starsAmount, setStarsAmount] = useState(0);
    const [isCustomerHasRate, setIsCustomerHasRate] = useState(false);

    const [trainerData, setTrainerData] = useState({});
    const getTrainerById = async (id) => {
        try {
            const allTrainersUrl = `http://localhost:8000/trainer/${id}`;
            const response = await axios.get(allTrainersUrl);
            // console.log("response", response);
            const data = await response.data;
            console.log("data: ", data);
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
            // console.log(itemPage.rate.ratingProviders);
            // console.log(customerID);
            itemPage.rate.ratingProviders.forEach((ratersId) => {
                if (ratersId === customerID) {
                    return (setIsCustomerHasRate(true))
                }
            })

            // console.log("customerMyCoursesDataForCoursePage: ", customerMyCoursesDataForCoursePage);
        }

        /** Setting a state with the scroll position of the prev page to locate it and navigate to it. */
        if (state !== null) {
            // console.log("State: ", state);
            setScrollPositionToSentBack(state.scrollPosition);
            // scrollPositionToSentBack !== -1 && console.log("State from CustomerPage component!!  ", scrollPositionToSentBack);
        }
        // console.log("starsAmount: ", starsAmount);

    }, [customerMyCoursesDataForCoursePage, id, state, scrollPositionToSentBack, setIsCustomerHasRate]);


    const rateTheCourse = (starsAmount) => {
        if (starsAmount === 0) return;
        // console.log("starsAmount: ", starsAmount);

        const dataToServer = {
            starsAmount,
            courseId: id,
            customerId: customerID,
        }

        axios({
            method: 'post',
            url: "http://localhost:8000/course/rateCourse",
            headers: { 'content-type': 'application/json' },
            data: dataToServer
        }).then((res) => {
            console.log('result ', res.data);
            setIsCustomerHasRate(true);
        }).catch((error) => {
            console.log(error);
        });
    }

    const giveTrainerThumbsUp = () => {
        const dataToServer = {
            trainerId: singleCourse.trainer_id,
            customerID,
        }
        axios({
            method: 'post',
            url: "http://localhost:8000/trainer/rateTrainerThumbsUp",
            headers: { 'content-type': 'application/json' },
            data: dataToServer
        }).then((res) => {
            console.log('result ', res.data);
            setThumbsState(true)
        }).catch((error) => {
            error.response.data.message === "You have already rated the Trainer!"
                ? console.log(error.response.data.message) :
                console.log(error);
        });
    }

    const giveTrainerThumbsDown = () => {
        const dataToServer = {
            trainerId: singleCourse.trainer_id,
            customerID,
        }
        axios({
            method: 'post',
            url: "http://localhost:8000/trainer/rateTrainerThumbsDown",
            headers: { 'content-type': 'application/json' },
            data: dataToServer
        }).then((res) => {
            console.log('result ', res.data);
            setThumbsState(true)
        }).catch((error) => {
            error.response.data.message === "You have already rated the Trainer!"
                ? console.log(error.response.data.message) :
                console.log(error);
        });
    }

    /** update the ratingProviders inside my 
     * courses to prevent from customer 
     * to rate the course again. */
    const getMyCourses = async () => {
        const customerId = {}
        customerId.customerId = customerID
        axios({
            method: 'post',
            url: "http://localhost:8000/Course/registeredCourses",
            headers: { 'content-type': 'application/json' },
            data: customerId
        }).then((res) => {
            console.log(res);
            // console.log("res.data: ", res.data);
            // console.log("myCourses: ", myCourses);
            setCustomerMyCoursesDataForCoursePage(res.data);
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

    return (
        singleCourse.picture !== undefined ?
            <div className="courseDetailsPage-container">
                <div className="courseDetails-container">
                    <div className="coursePage-allTitles">
                        <div className='courseName-outerDiv'>
                            <div className="coursePage-courseName">{singleCourse.name}</div>
                        </div>
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

                        {
                            !isCustomerHasRate ?
                                <div className="coursePage-rate-courseTitle" >
                                    Rate the Course
                                    <StarsRating setStarsAmount={setStarsAmount} />
                                    <button
                                        className="rateCourse-btn"
                                        onClick={() => { rateTheCourse(starsAmount) }}>Confirm
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="confirmBtn-smile">&#9737;</span>
                                            <span className="confirmBtn-smile">&#9737;</span>
                                        </div>
                                    </button>
                                    {/* {starsAmount !== 0 && <div style={{ fontSize: '12px' }}>{starsAmount}</div>} */}
                                </div> :
                                <div className="coursePage-courseTitle-succsesMessage" >
                                    You have successfully rated this course
                                </div>

                        }

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
                                    {/* <span className="coursePage-title-name">Click Here</span> */}
                                    <a
                                        className="coursePage-title-name"
                                        href={`mailto:${trainerData.email}?subject=Mail from Train Me customer`}>
                                        {trainerData.email}
                                    </a>
                                </div>
                                <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Age</span>
                                    <span className="coursePage-title-arrow">&gt;</span>
                                    <div className="coursePage-title-name">{trainerData.age}</div>
                                </div>
                                {/* <div className="coursePage-allCourse-trainerTitles-container">
                                    <span className="coursePage-title">Rating</span>
                                    <span className="coursePage-title-arrow">&gt;</span>
                                </div> */}
                                <div className="rate-div">
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        Rate the Trainer
                                    </div>
                                    <div className='txt-and-thumbs'>
                                        {!trainerData.ratingProviders.includes(customerID) ?
                                            !thumbsState ?
                                                <>
                                                    <span
                                                        style={{
                                                            fontSize: "14px",
                                                            fontFamily: "Helvetica",
                                                            textAlign: "center",
                                                            width: "12em"
                                                        }}>
                                                        If you liked the trainer, please click the Like button
                                                    </span>
                                                    <div
                                                        onClick={() => { giveTrainerThumbsUp() }}
                                                        className="rate-container-like-btn"
                                                    >
                                                    </div>
                                                </>
                                                : <div className="rate-container-like-btn-visited">
                                                </div>
                                            :
                                            !thumbsState ?
                                                <>
                                                    <span style={{ fontSize: "14px", fontFamily: "Helvetica", textAlign: "center", width: "12em" }}>
                                                        Changed your mind? Please click the dislike button
                                                    </span>
                                                    <div
                                                        onClick={() => { giveTrainerThumbsDown() }}
                                                        className="rate-container-dislike-btn"
                                                    >
                                                    </div>
                                                </>
                                                :
                                                <div
                                                    className="rate-container-dislike-btn-visited"
                                                >
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginLeft: "2em", width: "25rem" }}>
                                <Img customerCoursePageAvatar={trainerData.profilepic.public_id} alt="Course avatar"></Img>
                            </div>
                        </div>
                    </div>}
                <button
                    className="coursePage-goBack-btn"
                    onClick={() => { getMyCourses(); navigate('/customer', { state: { customerMyCoursesDataForCoursePage, scrollPositionToSentBack } }) }}>
                    &#171; Back
                </button>
            </div > : null
    )
}

export default CourseDetailsInMyCourses