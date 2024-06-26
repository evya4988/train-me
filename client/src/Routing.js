import React, { useState } from 'react';
import MyContext from './MyContext';
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
} from 'react-router-dom';
import { useClock } from './customHooks/useClock';
import './Routing.css';
import Logo from './images/Logo.png';
import Home from './components/Home';
import CustomerPage from './components/customerPage/CustomerPage';
import TrainerPage from './components/trainerPage/TrainerPage';
import AdminPage from './components/adminPage/AdminPage';
import { AdminAccountPage } from './components/accountBox/adminAccount/AdminAccountPage';
import About from './views/about/About';
import NotFound from './views/notFound/NotFound';
// import CommonQuestions from './views/commonQuestions/CommonQuestions';
import Contact from './views/contactUs/ContactUsForm';
import { AccountBox } from './components/accountBox/index';
import Popup from 'reactjs-popup';
// import "reactjs-popup/dist/index.css";
import CourseDetailsInAllCourses from './components/customerPage/productsDetail/CourseDetailsInAllCourses';
import CourseDetailsInMyCourses from './components/customerPage/productsDetail/CourseDetailsInMyCourses';
// import Img from './customHooks/Img';
import IconNavigate from './components/usersIconNavigation/IconNavigate';


const Routing = () => {
    const clock = useClock();
    const [loading, setLoading] = useState(true);

    const [adminName, setAdminName] = useState('');
    const [adminAvatar, setAdminAvatar] = useState('');
    const [coursesData, setCoursesData] = useState([]);
    const [contactUsData, setContactUsData] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [customerAvatar, setCustomerAvatar] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [trainersData, setTrainersData] = useState([]);
    const [trainerAvatar, setTrainerAvatar] = useState('');
    const [trainerName, setTrainerName] = useState('');
    const [adminId, setAdminId] = useState('');
    const [trainerID, setTrainerID] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [customerCoursesDataForCoursePage, setCustomerCoursesDataForCoursePage] = useState([]);
    const [customerMyCoursesDataForCoursePage, setCustomerMyCoursesDataForCoursePage] = useState([]);

    const adminAvatarHandler = (publicId) => {
        setAdminAvatar(publicId);
    }

    const customerAvatarHandler = (publicId) => {
        console.log("typeof publicId: ",typeof publicId );
        setCustomerAvatar(publicId);
    }

    const trainerAvatarHandler = (publicId) => {
        setTrainerAvatar(publicId);
        console.log("publicId: ", publicId);
    }



    /* Change left or top value to reposition the popup */
    // const offset = {
    //     left: 50,
    //     top: 50,
    // };

    // const contentStyle = {
    //     position: "fixed",
    //     height: "600px",
    //     width: "400px",
    //     backgroundColor: "red"
    // };


    const providerValues = {
        loading,
        setLoading,
        setCustomersData,
        setTrainersData,
        setContactUsData,
        customersData,
        trainersData,
        contactUsData,
        adminAvatarHandler,
        adminAvatar,
        customerAvatarHandler,
        customerAvatar,
        trainerAvatarHandler,
        trainerAvatar,
        setAdminName,
        adminName,
        setAdminId,
        adminId,
        setCustomerName,
        customerName,
        setCustomerID,
        customerID,
        setTrainerName,
        trainerName,
        setTrainerID,
        trainerID,
        setCoursesData,
        coursesData,
        customerCoursesDataForCoursePage,
        setCustomerCoursesDataForCoursePage,
        customerMyCoursesDataForCoursePage,
        setCustomerMyCoursesDataForCoursePage,
    }

    const isAdminLoggedIn = (adminAvatar !== "" && customerAvatar === "" && trainerAvatar === "")
    const isTrainerLoggedIn = (trainerAvatar !== "" && adminAvatar === "" && customerAvatar === "")
    const isCustomerLoggedIn = (customerAvatar !== "" && adminAvatar === "" && trainerAvatar === "")

    return (
        <MyContext.Provider
            value={{
                ...providerValues
            }}
        >
            <BrowserRouter>
                <div className="container-header">
                    <div className="container-logo-clock">
                        <NavLink to="/" style={{ border: "none" }}>
                            <img className="logo" src={Logo} alt="logo-pic" />
                        </NavLink>
                        <span className="clock">{clock}</span>
                    </div>

                    <span className="container-link">
                        <NavLink to="/" className="active-link">Home</NavLink>
                        {/* <NavLink to="/account" className="active-link">Account</NavLink> */}
                        {isAdminLoggedIn ? null :
                        [<NavLink to="/contact" className="active-link">Contact-Us</NavLink>,
                        <NavLink to="/about" className="active-link">About</NavLink>] }
                        {/* <NavLink to="/questions" className="active-link">Common-Questions</NavLink> */}
                        {
                            (!isAdminLoggedIn && !isTrainerLoggedIn && !isCustomerLoggedIn) ?
                                <Popup trigger={<button className="active-link">Account</button>} position="bottom right">
                                    <AccountBox />
                                </Popup> : <IconNavigate />
                        }
                    </span>
                </div>

                {/* {
                isLoggedIn ? ( */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="customer" element={<CustomerPage loading={loading} setLoading={setLoading} customerAvatar={customerAvatar} />} />
                    <Route path="customer/allcourses/:id" element={<CourseDetailsInAllCourses exact />} />
                    <Route path="customer/mycourses/:id" element={<CourseDetailsInMyCourses exact />} />

                    <Route path="trainer" element={<TrainerPage loading={loading} setLoading={setLoading} trainerAvatar={trainerAvatar} />} />
                    <Route path="admin" element={<AdminPage loading={loading} setLoading={setLoading} adminAvatar={adminAvatar} />} />
                    {/* <Route path="account" element={<AccountBox />} /> */}
                    <Route path="adminaccount" element={<AdminAccountPage />} />
                    <Route path="about" element={<About />} />
                    {/* <Route path="questions" element={<CommonQuestions />} /> */}
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </MyContext.Provider>
    );
}

export default Routing
