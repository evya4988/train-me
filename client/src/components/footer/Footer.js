import React from 'react';
import './Footer.css';
import { NavLink } from 'react-router-dom';

const Footer = (props) => {

    return (
        <footer className="footer">
            <NavLink to="/about" className="active-link">About</NavLink>
            © 2022 Copyright
        </footer>
    );
}

export default Footer;