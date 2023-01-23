import React, { useEffect, useState } from "react";
import './BackToTopBtn.css';

const BackToTopBtn = () => {
    const [backToTopBtn, setBackToTopBtn] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 700) {
                setBackToTopBtn(true);
            } else {
                setBackToTopBtn(false);
            }
        })
    }, [])

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }
    return <div>
        {backToTopBtn && (
            <button
                className="backToBtn-container"
                onClick={scrollUp}
            >^</button>
        )}
    </div>;
}

export default BackToTopBtn;



