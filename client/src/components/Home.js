import './Home.css';
// import '../images/thumbs-up.png';

function Home() {
  return (
    <>
      <div className="home-page-container">
        <div className="detailAndImage-container">
          <div className="allPersonalTrainers-Details-container">
            <div>
              <div className="PersonalTrainersDetailes-title">Online</div>
              <span className="PersonalTrainersDetailes-title">Personal Trainer</span>
            </div>
            <span className="PersonalTrainers-Detailes">
              {/* <img src="images/icons8-thumbs-up-48.png" alt="v-icon"></img> */}
              Live 1-on-1 workouts with a personal trainer
            </span>
            <span className="PersonalTrainers-Detailes">
              Online. At home, outside, or on the go
            </span>
            <span className="PersonalTrainers-Detailes">
              Try your first session for free!
            </span>
            <button className="PersonalTrainers-btn">Try for Free</button>
          </div>
          <div>
            <img className="PersonalTrainersImage" alt="Personal trainers" src="https://thumb.tildacdn.com/tild3230-6238-4332-a666-346439383934/-/format/webp/680-min.jpg"></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
