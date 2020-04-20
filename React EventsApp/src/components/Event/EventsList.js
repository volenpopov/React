import React from "react";

import EventItem from "./EventItem";

const EventsList = ({ events, onSetSelectedEventHandler }) => {
    return events.map(event => <EventItem
        key={event.id} 
        event={event} 
        onSetSelectedEventHandler={onSetSelectedEventHandler}
    />);
};

export default EventsList;