import React, { useState, useContext } from 'react';
import './CustomerPage.css';
import Img from '../../customHooks/Img';
import MyContext from '../../MyContext';
import { Marginer } from '../marginer';
import axios from 'axios';

const CustomerPage = ({ customerAvatar }) => {
  const { customerName } = useContext(MyContext);

  //setting the time for once, for greeting the appropriate greeting.
  const [time, setTime] = useState(0);
  const [isTimeChecked, setIsTimeChecked] = useState(false);
  if (!isTimeChecked) {
    const today = new Date();
    setTime(today.getHours());
    console.log("Time is: ", time);
    setIsTimeChecked(true);
  }

  return (
    <>
      <div className="customer-page-container">
        <div className="customer-image-home-container"></div>
        <div className="customer-actions-container">
          {
            customerName &&
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "block" }}>
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
          <div style={{ marginLeft: "2em" }}>
            <button className="customer-actions-btn" onClick={() => { }} >
              My Courses
            </button>
            <button className="customer-actions-btn" onClick={() => { }} >
              All Trainers
            </button>
            <button className="customer-actions-btn" onClick={() => { }} >
              All Courses
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomerPage