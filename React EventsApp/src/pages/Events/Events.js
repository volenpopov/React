import React, { useState, useEffect, useContext, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-eventsapp';

import ThemeContext from '../../context/theme-context';
import Backdrop from '../../components/Backdrop/Backdrop';
import Modal from "../../components/Modal/Modal";

import './Events.css';

const Events = props => {
    const themeContext = useContext(ThemeContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fromHomeGuest = props.location.state
            ? props.location.state.fromHomeGuest
            : null;

        //const currentDateNumber = Date.parse((new Date().toUTCString()));
        
        let fetchedEvents = [];

        axios.get("/events.json")
            .then(response => {
                if (fromHomeGuest) {
                    fetchedEvents = Object.keys(response.data)
                        .map(key => ({ id: key, ...response.data[key] }))
                } else if (props.userId) {
                    fetchedEvents = Object.keys(response.data)
                        .map(key => ({ id: key, ...response.data[key] }))
                        .filter(event => {
                            // const eventDate = new Date(event.date);
                            // console.log("eventDate", eventDate);
                            
                            // const eventDateNumber = Date.parse(eventDate);
                            // console.log("eventDateNumber", eventDateNumber);

                            return event.creator !== props.userId;
                        });
                }                     
                
                setEvents([ ...fetchedEvents ]);
            })
            .catch(error => console.log(error));        
    }, [props.userId]);

    const showModal = () => {
        setShowCreateModal(true);        
    };

    const createEventDiv = (
        <div className="createEventContainer w-100 text-center mt-4">
            <p>Share your own Events!</p>
            <button 
                className={`btn btn-${themeContext.themeColor}`}
                onClick={showModal}>
                    Create Event
            </button>
        </div>
    );

    const parsedEvents = events.map(event => {
        return (
            <div className="eventContainer" key={event.id}>
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
            {showCreateModal 
                ? <Fragment>
                    <Backdrop/>
                    <Modal title="Create Event" actionButtonText="Create"></Modal>
                </Fragment> 
                : null
            }
            {props.isAuthenticated ? createEventDiv : null}
            <div className="w-100 mt-4" style={{height: "75%"}}>
                <p className="allUpcomingEvents text-center">All Upcoming Events:</p>
                <div className="flex-grow-1 d-flex flex-column align-items-center">
                    {parsedEvents}
                </div>
            </div>                        
        </Fragment>        
    );
};

const mapStateToProps = state => {
    return {        
        isAuthenticated: state.token !== null,
        userId: state.userId
    };
};

export default connect(mapStateToProps)(Events);