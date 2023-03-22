import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MyContext from '../../MyContext';
import Img from '../../customHooks/Img';

const IconNavigate = () => {
    const navigate = useNavigate();
    const { adminAvatar, customerAvatar, trainerAvatar } = useContext(MyContext);

    const isAdminLoggedIn = (adminAvatar !== "" && customerAvatar === "" && trainerAvatar === "");
    const isTrainerLoggedIn = (trainerAvatar !== "" && adminAvatar === "" && customerAvatar === "");
    const isCustomerLoggedIn = (customerAvatar !== "" && adminAvatar === "" && trainerAvatar === "");

    return (
        isAdminLoggedIn ?
            <div className="icon-image-div" onClick={() => navigate('/admin')}>
                <Img className="icon-image" usersIconAvatar={adminAvatar} alt="Admin avatar" ></Img>
            </div>
            : isTrainerLoggedIn ?
                <div className="icon-image-div" onClick={() => navigate('/trainer')}>
                    <Img className="icon-image" usersIconAvatar={trainerAvatar} alt="Trainer avatar"></Img>
                </div>
                : isCustomerLoggedIn ?
                    <div className="icon-image-div" onClick={() => navigate('/customer')}>
                        <Img className="icon-image" usersIconAvatar={customerAvatar} alt="Customer avatar"></Img>
                    </div>
                    : null
    )
}

export default IconNavigate