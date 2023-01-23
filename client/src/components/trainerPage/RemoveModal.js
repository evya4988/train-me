import React, { useState } from "react";
import "./RemoveModal.css";
import axios from 'axios';

const RemoveModal = ({ 
    courseId,
    loading,
    setLoading,
    setIsDataExist,
    setFilteredCoursesArr,
    toggleFiltered,
    setToggleFiltered}) => {

    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };

    const removeCourseHandler = async (id) => {
        setLoading(true);
        setIsDataExist(false);
        try {
            setLoading(true);
            const deleteCourseUrl = `http://localhost:8000/course/${id}`;
            const response = await axios.delete(deleteCourseUrl);
            const data = await response.data;
            console.log("data After removed: ", data);
            setFilteredCoursesArr(data)
            if (toggleFiltered) {
                setToggleFiltered(false);
            }
            setModal(!modal);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <button onClick={toggleModal} className="remove-btn-modal" >
                Remove
            </button>

            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="removeBtn-modal-content-container">
                        {loading && <section className="smooth spinner" >{ }</section>}
                        <span className="close-remove-modal-container">
                            <div>
                                Are you sure
                                <span style={{ color: "red" }}> ?</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: 'row' }}>
                                <button className="remove-modal" onClick={() => { removeCourseHandler(courseId) }}>
                                    REMOVE
                                </button>
                                <button className="remove-close-modal" onClick={toggleModal}>
                                    CLOSE
                                </button>
                            </div>
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

export default RemoveModal;