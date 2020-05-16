import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";

import ThemeContext from "../../context/theme-context";
import * as constants from "../../helpers/constants";

import "./UserBookings.css";

const UserBookings = props => {
    const themeContext = useContext(ThemeContext);

    const [userBookings, setUserBookings] = useState([]);
    const [noBookingsMessage, setNoBookingsMessage] = useState(null);
    
    useEffect(() => {
        if (props.userId && props.token) {
            const userBookingsRequest = axios.get(`${constants.BOOKINGS_URL}.json?auth=${props.token}`);
            const eventsRequest = axios.get(`${constants.EVENTS_URL}.json`);
        
            Promise.all([userBookingsRequest, eventsRequest])
                .then(([bookings, events]) => {
                    const bookingsByEvents = bookings.data;
                    const allEvents = events.data;

                    const userBookings = [];

                    Object.keys(bookingsByEvents).forEach((event) => {
                        const eventBookings = bookingsByEvents[event];

                        Object.keys(eventBookings).forEach((bookingKey) => {
                            const booking = eventBookings[bookingKey];
                            
                            if (booking.userId === props.userId) {                                                                
                                const eventDate = allEvents[booking.eventId].date;
                                
                                userBookings.push({
                                    id: bookingKey,
                                    eventDate,
                                    ...booking
                                });
                            }
                        }); 
                    });
                    
                    if (userBookings.length) {
                        setUserBookings(userBookings);
                    } else {
                        setNoBookingsMessage(constants.NO_BOOKINGS_MESSAGE);    
                    }
                    

                    // let userBookings = bookings.data;
                    
                    // const allEvents = events.data;
                    
                    // const userBookingsKeys = Object.keys(userBookings);

                    // if (userBookingsKeys.length) {                       
                    //     userBookings = userBookingsKeys
                    //         .map(key => {                                
                    //             const bookedEventId = userBookings[key].eventId;
                    //             const eventDate = allEvents[bookedEventId].date;
                                
                    //             return { 
                    //                 id: key,
                    //                 ...userBookings[key],
                    //                 eventDate
                    //             };
                    //         });                        
                        
                    //     setUserBookings(userBookings);
                    // } else {
                    //     setNoBookingsMessage(constants.NO_BOOKINGS_MESSAGE);
                    // }             
                })
                .catch(error => error);
        }
    }, [props.userId, props.token]);

    const cancelBookingHandler = bookingId => {        
        axios.delete(`${constants.BOOKINGS_URL}/${bookingId}.json?auth=${props.token}`)
            .then(() => {
                const updatedUserBookings = userBookings.filter(booking => booking.id !== bookingId);

                setUserBookings(updatedUserBookings);    
                
                if (!updatedUserBookings.length) {
                    setNoBookingsMessage(constants.NO_BOOKINGS_MESSAGE);
                }
            })
            .catch(error => error);
    };

    const currentDateNumber = Date.parse(new Date());

    const noBookings = <p style={{ fontSize: "1.3rem" }}>{noBookingsMessage}</p>;

    const parsedBookings = userBookings.map(booking => {
        const eventDateNumber = Date.parse(booking.eventDate);

        return (
            <div className="eventContainer" key={booking.id}>
                <div className="d-flex flex-column align-items-center p-3">
                    <p className="eventTitle text-capitalize">
                        {`${booking.eventId} - ${new Date(booking.eventDate).toLocaleDateString("en-GB", constants.DATE_AND_TIME_OPTIONS)}`}
                    </p>
                    <p 
                        className={`bg-${themeContext.themeColor} text-white px-2 mb-0 rounded text-center align-self-start`}
                        style={{ width: "162px" }}>
                        Booked on: {new Date(booking.bookedOn).toLocaleDateString("en-GB", constants.DATE_OPTIONS)}
                    </p>                    
                </div>    
                <div>
                    <button 
                        className={`mr-3 btn btn-${themeContext.themeColor} px-sm-3 px-lg-4`}
                        disabled={eventDateNumber < currentDateNumber}
                        onClick={() => cancelBookingHandler(booking.id)}>                        
                        Cancel
                    </button>
                </div>            
            </div>  
        );
    });
        
    return (
        <div className="pageHeaderContainer w-100 align-self-start d-flex flex-column align-items-center text-center mt-5">
            <h1 className="mb-4">Your Bookings:</h1> 
            <div className="parsedItemsContainer">
                {parsedBookings.length ? parsedBookings : noBookings}
            </div>            
        </div>          
    );
};

const mapStateToProps = state => ({ 
    userId: state.userId,
    token: state.token
});

export default connect(mapStateToProps)(UserBookings);