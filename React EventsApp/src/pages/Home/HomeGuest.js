import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import ThemeContext from '../../context/theme-context';

import './HomeGuest.css';

const HomeGuest = () => {
    const themeContext = useContext(ThemeContext);

    return (
        <div className="homeGuestContainer">
            <p>Welcome to EventsApp!</p>
            <p>Please, create an account or log in, in order to create or book an event.</p>
            <Link to="/events" className={`btn btn-${themeContext.themeColor}`}>View Events</Link>
        </div>
    );
};

export default HomeGuest;