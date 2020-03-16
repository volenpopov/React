import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";

import * as constants from "../../helpers/constants";

import "./UserProfile.css";

const UserEvents = props => {
    const [userEvents, setUserEvents] = useState({});
        
    useEffect(() => {
        const userEventsRequest = axios.get(`${constants.EVENTS_URL}.json?orderBy="creator"&equalTo="${props.userId}"`);
        const bookingsRequest = axios.get(`${constants.BOOKINGS_URL}.json`);

        Promise.all([userEventsRequest, bookingsRequest])
            .then(([events, bookings]) => {
                const userEvents = events.data;
                const allBookings = bookings.data;
                
                if (userEvents) {
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
                    
                    setUserEvents({ ...userEvents });
                }                
            })
            .catch(error => console.log(error));        
    }, [props.userId]);

    const parsedEvents = Object.keys(userEvents).map(key => {
        const event = userEvents[key];
        const attendees = event.totalAttendees ? event.totalAttendees : 0;

        return (
            <div className="eventContainer" key={event.id}>
                <div className="d-flex flex-column align-items-center p-3">
                    <p className="eventTitle text-capitalize">{event.title}</p>                                           
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
            {parsedEvents}                 
        </div> 
    );        
}

const mapStateToProps = state => ({ userId: state.userId });

export default connect(mapStateToProps)(UserEvents);