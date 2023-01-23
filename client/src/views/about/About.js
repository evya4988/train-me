import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="about-container">
        <div className="about-the-project">    
          <div className="about-the-project-title">About the Project</div>
          
          <div><span className="project-name">trainMe </span> is a LIVE & online 1-on-1 personal workouts with your PROs.</div>
          <div>We fit you the best if you are one of these types of person who-</div>
          <div className='aboutTheProject-txt-box'>
            <span className='span-txt'>Needs somebody to push, guide, motivate and cheer you.</span>
            <span className='span-txt'>Is super busy to go to the gym, however, want to exercise consistently and efficiently.</span >
            <span className='span-txt'>Does not know how and where to start in your fitness journey.</ span>
            <span className='span-txt'>Tried 100+ fitness apps and videos and knows all of this
              does not work well without very personal feedback.</span>
            <span className='span-txt'>Tried personal trainer services and liked it.
              However, it is much to pay $70-140 per 60-min session.</ span>
          </div>
          <div>If you are one of these types, then you are at the right place.</div>

          <span style={{ fontSize: "25px", color: "darkred", margin: "0 3em 0 3em", marginBottom: "2em"}}>
            The main goal is to make 1-to-1 training sessions with a professional trainer affordable to everyone
          </span>
        </div>
        <div className="about-us-container">
          <p>
            About Us
            <br />
            <br />
            Hello,
            <br />Our names are Shay Barnea and Evyatar Hale, and we are a students in GO-CODE
            <br />Academy as part of Full Stack Web Development course.
          </p>
          <p>
            As part of our final project we built a system,
            which mediates between physical training coaches and clients interested in these services,<br />
            It allows trainers to create, edit and delete their courses, and clients to view and register for these courses.
          </p>
          <p>
            A lot of effort was given to this project, which is a product of 2 months of hard work that has taught us a lot.
            <br />Enjoy!
          </p>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ display: "flex", marginRight: "6em" }}>
            <button className="go_back_button" onClick={() => navigate("/")}>Home</button>
          </span>
          <span style={{ display: "flex" }}>
            <span className="copyright-style">Copyright 2022 ©</span>
          </span>
        </div>
      </div>
    </>
  )
}

export default About


