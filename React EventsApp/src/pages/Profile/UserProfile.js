import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";

import ThemeContext from "../../context/theme-context";
import * as constants from "../../helpers/constants";

import "./UserProfile.css";

const UserEvents = props => {
    const themeContext = useContext(ThemeContext);

    const [userEvents, setUserEvents] = useState({});
    const [noEventsMessage, setNoEventsMessage] = useState(null);
        
    useEffect(() => {
        if (props.userId && props.token) {
            const userEventsRequest = axios.get(`${constants.EVENTS_URL}.json?orderBy="creator"&equalTo="${props.userId}"`);
            const bookingsRequest = axios.get(`${constants.BOOKINGS_URL}.json?auth=${props.token}`);
    
            Promise.all([userEventsRequest, bookingsRequest])
                .then(([events, bookings]) => {
                    if (props.userId && props.token) {
                        const userEvents = events.data;
                        const allBookings = bookings.data;
                        
                        if (userEvents && Object.keys(userEvents).length) {
                            if (allBookings) {
                                Object.keys(allBookings).forEach(key => {
                                    const bookingEventId = allBookings[key].eventId;                                
                                    
                                    if (userEvents[bookingEventId]) {
                                        if (userEvents[bookingEventId].totalAttendees) {
                                            userEvents[bookingEventId].totalAttendees++;
                                        } else {
                                            userEvents[bookingEventId].totalAttendees = 1;
                                        }                                       
                                    };
                                });
                            }      
                            setUserEvents({ ...userEvents });              
                        } else {
                            setNoEventsMessage(constants.NO_EVENTS_MESSAGE);
                        }
                    }                                
                })
                .catch(error => error);   
        }                
    }, [props.userId, props.token]);

    const deleteEventHandler = (eventId) => {
        axios.delete(`${constants.EVENTS_URL}/${eventId}.json?auth=${props.token}`)
            .then(() => {
                const updatedEvents = Object.keys(userEvents)
                    .reduce((obj, key) => {
                        if (key !== eventId) {
                            obj[key] = { ...userEvents[key] };
                        }                        

                        return obj;
                    }, {});
                    
                setUserEvents(updatedEvents);

                if (!Object.keys(updatedEvents).length) {
                    setNoEventsMessage(constants.NO_EVENTS_MESSAGE);
                }
            })
            .catch(error => error);
    };

    const noEvents = <p style={{ fontSize: "1.3rem" }}>{noEventsMessage}</p>;

    const parsedEvents = Object.keys(userEvents).map(key => {
        const event = userEvents[key];
        const attendees = event.totalAttendees ? event.totalAttendees : 0;
        
        return (
            <div key={key} className="eventContainer">
                <div className="d-flex align-items-center p-3">
                    <button 
                        className={`btn btn-${themeContext.themeColor}`}
                        onClick={() => deleteEventHandler(key)}    
                    >
                        X
                    </button>
                    <p 
                        className="eventTitle text-capitalize ml-3"
                        style={{ width: "auto" }}
                    >{event.title}</p>                                           
                </div>
                <div className="attendeesContainer">
                    <p>Total Attendees: {attendees}</p>
                </div>                            
            </div>  
        );
    });        
    
    return (
        <div className="pageHeaderContainer w-100 align-self-start d-flex flex-column align-items-center text-center mt-5">
            <h1 className="mb-4">Your Events:</h1> 
            <div className="parsedItemsContainer">
                {parsedEvents.length ? parsedEvents : noEvents}  
            </div>                           
        </div> 
    );        
}

const mapStateToProps = state => ({ 
    userId: state.userId,
    token: state.token
});

export default connect(mapStateToProps)(UserEvents);