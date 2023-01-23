import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const id = setTimeout(() => {
            navigate('/');
        }, 3000);
        return () => clearTimeout(id)
    }, []);

    return (
        <div className="centered">
            <div>
                <b style={{ color: "burlywood", width: "100%" }}>Error 404</b>
            </div>
            There is no such route, please wait and you will be redirected to <b style={{ color: "burlywood" }}>Home</b> page.</div>
    )
}

export default NotFound