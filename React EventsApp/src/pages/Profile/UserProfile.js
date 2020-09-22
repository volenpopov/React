import React, { useEffect, useReducer, useContext } from "react";
import { useSelector } from "react-redux";
import { eventsAppRequester as requester } from "../../axios-eventsapp";

import ThemeContext from "../../context/theme-context";
import * as constants from "../../helpers/constants";

import "./UserProfile.css";

const initialState = {
    userEvents: {},
    noEventsMessage: null
};

const actions = {
    SET_USER_EVENTS: "SET_USER_EVENTS",
    SET_NO_EVENTS_MSG: "SET_NO_EVENTS_MSG"
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.SET_USER_EVENTS:
            return {
                ...state,
                userEvents: action.userEvents                
            };
        case actions.SET_NO_EVENTS_MSG:
            return {
                ...state,
                noEventsMessage: action.message
            };
        default:
            throw new Error("Error: unknown action dispatched to reducer");
    }
}

const UserEvents = props => {
    const themeContext = useContext(ThemeContext);

    const [state, dispatch] = useReducer(reducer, initialState);

    const userId = useSelector((state) => state.userId);
    const token = useSelector((state) => state.token);
        
    const {
        userEvents,
        noEventsMessage
    } = state;

    useEffect(() => {
        if (userId && token) {
            const userEventsRequest = requester.getEventsOrderedByCreator(userId);
            const bookingsRequest = requester.getBookings(token);
    
            Promise.all([userEventsRequest, bookingsRequest])
                .then(([events, bookings]) => {
                    if (userId && token) {
                        const userEvents = events.data;
                        const allBookings = bookings.data;
                        
                        if (userEvents && Object.keys(userEvents).length) {
                            if (allBookings) {
                                Object.keys(userEvents).forEach((eventId) => {
                                    const eventBookingsObj = allBookings[eventId];

                                    if (eventBookingsObj) {
                                        userEvents[eventId].totalAttendees = Object.keys(eventBookingsObj).length;
                                    } else {
                                        userEvents[eventId].totalAttendees = 0;
                                    }                                    
                                });                            
                            }      
                            dispatch({
                                type: actions.SET_USER_EVENTS,
                                userEvents
                            });
                        } else {
                            dispatch({
                                type: actions.SET_NO_EVENTS_MSG,
                                message: constants.NO_EVENTS_MESSAGE
                            });
                        }
                    }                                
                })
                .catch(error => error);   
        }                
    }, [userId, token]);

    const updateEventsAfterDeletion = (eventId) => {
        const updatedEvents = Object.keys(userEvents)
            .reduce((obj, key) => {
                if (key !== eventId) {
                    obj[key] = { ...userEvents[key] };
                }                        

                return obj;
            }, {});
                    
        dispatch({
            type: actions.SET_USER_EVENTS,
            userEvents: updatedEvents
        });

        if (!Object.keys(updatedEvents).length) {
            dispatch({
                type: actions.SET_NO_EVENTS_MSG,
                message: constants.NO_EVENTS_MESSAGE
            });
        }
    };

    const deleteEventHandler = (eventId) => {
        const eventAttendees = userEvents[eventId].totalAttendees;
        
        const deleteEventRequest = requester.deleteEvent(eventId, token);

        if (eventAttendees) {
            const deleteAllEventBookings = requester.deleteAllBookingsForASpecificEvent(eventId, token);
           
            Promise.all([deleteAllEventBookings, deleteEventRequest])
                .then(() => updateEventsAfterDeletion(eventId))
                .catch(error => error);
        } else {
            deleteEventRequest
                .then(() => updateEventsAfterDeletion(eventId))
                .catch(error => error);
        }        
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
                        className="eventTitle ml-3"
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

export default UserEvents;