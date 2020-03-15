import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";

import ThemeContext from "../../context/theme-context";
import * as constants from "../../helpers/constants";

const UserBookings = props => {
    const themeContext = useContext(ThemeContext);

    const [userBookings, setUserBookings] = useState([]);
    
    useEffect(() => {
        if (props.userId) {
            axios.get(`${constants.BOOKINGS_URL}.json?orderBy="userId"&equalTo="${props.userId}"`)
                .then(response => {
                    const data = response.data;
                    
                    if (data) {
                        const fetchedBookings = Object.keys(data)
                            .map(key => ({ id: key, ...data[key] }));

                        setUserBookings(fetchedBookings);
                    }
                })
                .catch(error => console.log(error));
        }
    }, [props.userId]);

    const cancelBookingHandler = bookingId => {        
        axios.delete(`${constants.BOOKINGS_URL}/${bookingId}.json`)
            .then(() => {
                const updatedUserBookings = userBookings.filter(booking => booking.id !== bookingId);
                setUserBookings(updatedUserBookings);
            })
            .catch(error => console.log(error));
    };

    const parsedBookings = userBookings.map(booking => {   
        return (
            <div className="eventContainer" key={booking.id}>
                <div className="d-flex flex-column align-items-center p-3">
                    <p className="eventTitle text-capitalize">{booking.eventId}</p>
                    <p 
                        className={`bg-${themeContext.themeColor} text-white px-2 mb-0 rounded text-center`}
                        style={{ width: "162px" }}>
                        Booked on: {new Date(booking.bookedAt).toLocaleDateString("en-GB", constants.DATE_OPTIONS)}
                    </p>                    
                </div>    
                <div>
                    <button 
                        className={`mr-3 btn btn-${themeContext.themeColor} px-sm-3 px-lg-4`}
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
            {parsedBookings}                      
        </div>
        
    );
};

const mapStateToProps = state => ({ userId: state.userId });

export default connect(mapStateToProps)(UserBookings);