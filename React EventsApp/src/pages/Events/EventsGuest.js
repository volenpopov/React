import React, { useState, useEffect, Fragment } from "react";
import axios from "../../axios-eventsapp";

import EventsList from "../../components/Event/EventsList";
import EventDetailsModal from "../../components/Event/EventDetailsModal";
import Backdrop from "../../components/Backdrop/Backdrop";
import * as constants from "../../helpers/constants";
import parseEvents from "../../helpers/eventsParser";

import "./Events.css";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {        
        axios.get(`${constants.EVENTS_URL}.json`)
            .then((resp) => {
                const events = parseEvents(resp.data);                                                                   
                setEvents(events);                
            })
            .catch(error => error);        
    }, []);

    const onSetSelectedEventHandler = eventId => {        
        const event = { 
            ...events.find(event => event.id === eventId) 
        };

        setSelectedEvent(event);
    };
        
    const detailsEventModal = (
        <EventDetailsModal 
            selectedEvent={selectedEvent} 
            setSelectedEvent={setSelectedEvent}
        />
    );

    const eventsList = (
        <EventsList
            events={events}
            onSetSelectedEventHandler={onSetSelectedEventHandler}
        />
    );
    
    return (
        <Fragment>
        {
            selectedEvent
                ? <Fragment>
                    <Backdrop/>
                    { detailsEventModal }
                </Fragment> 
                : null
        }
        <div className="w-100 mt-4 mb-0 mb-sm-4">
            <p className="allUpcomingEvents text-center">Upcoming Events:</p>
            <div className="parsedItemsContainer">
                {eventsList}
            </div>
        </div>  
        </Fragment>                              
    );
};

export default Events;