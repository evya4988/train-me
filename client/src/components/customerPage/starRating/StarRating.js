import React, { useState, useEffect } from "react";
import './StarRating.css';

const StarRating = (props) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);


    //Todo
    useEffect(() => {
        props.setStarsAmount(rating);
        // console.log("Stars Amount: ", props.starsAmount);
        console.log("rating: ", rating);
    }, [rating]);

    return (
        <div className="allStars-container">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "on star-button" : "off star-button"}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        onDoubleClick={() => {
                            setRating(0);
                            setHover(0);
                        }}
                    >
                        <span className="stars">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;