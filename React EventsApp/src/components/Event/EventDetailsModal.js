import React, { Fragment } from "react";

import Modal from "../Modal/Modal";
import Carousel from "../../components/Carousel/Carousel";
import * as constants from "../../helpers/constants";

const EventDetailsModal = props => {
    const { selectedEvent, setSelectedEvent } = props;

    return (
        <Modal
            title="Details" 
            actionButtonText={
                selectedEvent 
                    ? selectedEvent.alreadyBooked ? "Booked" : "Book" 
                    : "Book"
            }            
            closeModal={() => setSelectedEvent(null)}
            { ...props }
        >
            {
                selectedEvent
                    ? (
                        <Fragment>
                            <div className="d-flex flex-column mb-3">
                                <div className="w-100 d-flex justify-content-center align-items-center">
                                    <Carousel images={selectedEvent.images}/>
                                </div>
                                <div className="">
                                    <h3 className="mb-3 mt-3">{selectedEvent.title}</h3>
                                    <p className="eventDetails">Date: {new Date(selectedEvent.date).toLocaleString("en-GB", constants.DATE_AND_TIME_OPTIONS)}</p>
                                    <p className="eventDetails">Price: ${(+selectedEvent.price).toFixed(2)}</p>
                                    <p className="eventDescription">
                                        {
                                            selectedEvent.description
                                                ? selectedEvent.description
                                                : "No description"
                                        }
                                    </p> 
                                </div>                                
                            </div>                              
                        </Fragment>                                                            
                    )
                    : null
            }            
        </Modal>
    );
};

export default EventDetailsModal;