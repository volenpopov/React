import React, { useState, useEffect, useContext, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-eventsapp';

import ThemeContext from '../../context/theme-context';

import './Events.css';

const Events = props => {
    const themeContext = useContext(ThemeContext);

    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        axios.get("/events.json")
            .then(response => {
                const fetchedEvents = Object.keys(response.data)
                    .map(key => ({ id: key, ...response.data[key] }))
                
                setEvents([ ...fetchedEvents ]);
            })
            .catch(error => console.log(error));
    }, []);

    const createEventDiv = (
        <div className="createEventContainer w-100 text-center">
            <p>Share your own Events!</p>
            <button className={`btn btn-${themeContext.themeColor}`}>Create Event</button>
        </div>
    );

    const parsedEvents = events.map(event => {
        return (
            <div className="eventContainer">
                <div className="d-flex flex-column align-items-center p-3">
                    <p className={`eventTitle `}>{event.title}</p>
                    <p className={`bg-${themeContext.themeColor} text-white px-2 mb-0 rounded text-center`}>${(+event.price).toFixed(2)} - {event.date.split(" ")[0]}</p>
                </div>
                <div>
                    <button className={`mr-3 btn btn-${themeContext.themeColor}`}>View Details</button>
                </div>
            </div>
        );
    });

    return (
        <Fragment>
            {props.isAuthenticated ? createEventDiv : null}
            <p className="allUpcomingEvents w-100 text-center">All Upcoming Events:</p>
            <div className="flex-grow-1 d-flex flex-column align-items-center">
                {parsedEvents}
            </div>
        </Fragment>        
    );
};

const mapStateToProps = state => {
    return {        
        isAuthenticated: state.token !== null
    };
};

export default connect(mapStateToProps)(Events);