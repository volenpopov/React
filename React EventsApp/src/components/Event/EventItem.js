import React , { useContext } from "react";

import ThemeContext from "../../context/theme-context";
import * as constants from "../../helpers/constants";

const EventItem = ({ event, onSetSelectedEventHandler }) => {
    const themeContext = useContext(ThemeContext);
    
    return (
        <div className="eventContainer">
            <div className="d-flex flex-column align-items-center p-3">
                <p className="eventTitle">{event.title}</p>
                <p 
                    className={`bg-${themeContext.themeColor} text-white px-2 mb-0 rounded text-center`}>
                    ${(+event.price).toFixed(2)} - {new Date(event.date).toLocaleDateString("en-GB", constants.DATE_OPTIONS)}
                </p>
            </div>
            <div>
                <button 
                    className={`mr-3 btn btn-${themeContext.themeColor}`}
                    onClick={() => onSetSelectedEventHandler(event.id)}>View Details</button>
            </div>
        </div>
    );
};

export default EventItem;