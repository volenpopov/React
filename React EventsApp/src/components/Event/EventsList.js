import React from "react";

import EventItem from "./EventItem";

const EventsList = ({ events, onSetSelectedEventHandler }) => {
    return events.map(event => <EventItem 
        event={event} 
        onSetSelectedEventHandler={onSetSelectedEventHandler}
    />);
};

export default EventsList;