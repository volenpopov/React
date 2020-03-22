import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";
import { Form } from "react-bootstrap";

import ThemeContext from "../../context/theme-context";
import Backdrop from "../../components/Backdrop/Backdrop";
import Modal from "../../components/Modal/Modal";
import * as validators from "../../helpers/validators";
import * as constants from "../../helpers/constants";
import getBase64 from "../../helpers/getBase64";
import defaultImage from "../../resources/noimagefound.jpg";

import "./Events.css";

const Events = props => {
    const themeContext = useContext(ThemeContext);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [events, setEvents] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [errorMessages, setErrorMessages] = useState({
        title: null,
        price: null,
        date: null,
        description: null,
        images: null
    });

    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);
    const imagesRef = useRef(null);

    useEffect(() => {        
        const eventsRequest = axios.get(`${constants.EVENTS_URL}.json`);
        const userBookingsRequest =  axios.get(`${constants.BOOKINGS_URL}.json?orderBy="userId"&equalTo="${props.userId}"`);

        Promise.all([eventsRequest, userBookingsRequest])
            .then(([events, bookings]) => {
                const allEvents = events.data;
                const userBookings = bookings.data;

                if (allEvents) {
                    const currentDateNumber = Date.parse(new Date());

                    const fetchedEvents = Object.keys(allEvents)
                        .map(key => ({ id: key, ...allEvents[key] }))
                        .filter(event => {
                            const eventDate = new Date(event.date);                            
                            const eventDateNumber = Date.parse(eventDate);

                            if (props.userId) {                                
                                return event.creator !== props.userId && currentDateNumber <= eventDateNumber;
                            }
                            
                            return currentDateNumber <= eventDateNumber;
                        });                                   
                                
                    setEvents(fetchedEvents);
                }

                if (userBookings) {
                    const fetchedUserBookings = Object.keys(userBookings)
                            .map(key => ({ id: key, ...userBookings[key] }));
                        
                    setUserBookings(fetchedUserBookings);
                }
            })
            .catch(error => console.log(error));        
    }, [props.userId, props.location.state]);

    const closeModalHandler = () => {
        setErrorMessages({ title: null, price: null, date: null, description: null, images: null });
        setShowCreateModal(false);
    }

    const onSetSelectedEventHandler = eventId => {        
        const event = { 
            ...events.find(event => event.id === eventId), 
            alreadyBooked: userBookings.find(booking => booking.eventId === eventId) !== undefined
        };

        setSelectedEvent(event);
    };

    const onCreateEvent = () => {
        const title = titleRef.current.value; 
        const titleRegex = /^(([a-zA-Z]+|[0-9]+)+\s{0,1}([a-zA-Z]+|[0-9]+))+$/;

        const price = +priceRef.current.value;
        const date = new Date(dateRef.current.value); 
        const description = descriptionRef.current.value;
        
        const titleRequiredError = validators.isRequired("title")(title);
        const titleMinLengthError = validators.minLength(constants.EVENT_TITLE_MIN_LENGTH)("title")(title);
        const titleStringValidityError = titleRegex.test(title) ? null : "Invalid title";

        const priceValidityError = !isNaN(Number(price)) && price > 0
            ? null 
            : "Invalid price"

        const files = Array.from(imagesRef.current.files);    
                    
        let fileTypeError = null;            

        if (files.length) {
            if (files.some(file => file.type.substring(0, 5) !== "image")) {
                fileTypeError = constants.EVENT_IMAGE_INVALID_TYPE_ERROR; 
            }            
        }

        const errors = {
            ...errorMessages,
            title: titleRequiredError || titleMinLengthError || titleStringValidityError,            
            price: priceValidityError,
            date: isNaN(Date.parse(date)) ? "Invalid date" : null,
            description: description.length > 400 ? "Description has a max length of 400 characters" : null,
            images: fileTypeError
        };
                
        if (Object.keys(errors).every(key => !errors[key])) {
            const event = { title, price, date, description, creator: props.userId };

            if (files.length) {
                const imagesPromises = files.map(file => getBase64(file));
                
                Promise.all(imagesPromises)
                    .then(imagesBase64Array => {
                        axios.put(`${constants.EVENTS_URL}/${title.toLowerCase()}.json`, { ...event, images: imagesBase64Array })
                    })
                    .then(() => setShowCreateModal(false))
                    .catch(error => console.log(error));                                
            } else {
                axios.put(`${constants.EVENTS_URL}/${title.toLowerCase()}.json`, event)                          
                    .then(() => setShowCreateModal(false))
                    .catch(error => console.log(error));
            }
        };

        setErrorMessages(errors);
    };

    const BookEventHandler = eventId => {  
        setSelectedEvent(null);  

        const newBooking = { 
            userId: props.userId, 
            eventId, 
            bookedOn: new Date() 
        };

        if (!userBookings.find(booking => booking.userId === props.userId && booking.eventId === eventId)) {
            axios.post(`${constants.BOOKINGS_URL}.json`, newBooking)
                .then(() => setUserBookings([...userBookings, newBooking]))
                .catch(error => console.log(error));
        }        
    };

    const createEventDiv = (
        <div className="pageHeaderContainer w-100 text-center mt-4">
            <h1>Share your own Events!</h1>
            <button 
                className={`btn btn-${themeContext.themeColor}`}
                onClick={() => setShowCreateModal(true)}>
                    Create Event
            </button>
        </div>
    );

    const createEventModal = (
        <Modal 
            title="Create Event" 
            actionButtonText="Create"
            onFormSubmit={onCreateEvent}
            authenticated={props.isAuthenticated}
            closeModal={closeModalHandler}>            
                <Form.Group controlId="formBasicTitle" className="mb-0">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control type="text" name="title" ref={titleRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.title ? errorMessages.title : null}
                    </span>
                </Form.Group>
                <Form.Group controlId="formBasicPrice" className="mb-0">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control type="text" name="price" ref={priceRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.price ? errorMessages.price : null}
                    </span>                    
                </Form.Group>
                <Form.Group controlId="formBasicDate" className="mb-0">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control type="datetime-local" name="date" ref={dateRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.date ? errorMessages.date : null}
                    </span>                    
                </Form.Group>                
                <Form.Group controlId="formBasicDescription" className="mb-0">
                    <Form.Label className="d-inline">Description:</Form.Label>
                    <Form.Control as="textarea" rows="3" ref={descriptionRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.description ? errorMessages.description : null}
                    </span>
                </Form.Group>
                <Form.Group controlId="formBasicImages" className="d-flex flex-column">
                    <div className="d-flex flex-row">
                        <Form.Label className="mr-2">Images:</Form.Label>
                        <Form.Control as="input" type="file" accept="image/*" multiple className="d-block w-75" ref={imagesRef}/>
                    </div>                    
                    <span className="text-danger ml-1">
                        {errorMessages.images ? errorMessages.images : null}
                    </span>
                </Form.Group>
        </Modal>
    );

    const detailsEventModal = (
        <Modal
            title="Details" 
            actionButtonText={
                selectedEvent 
                    ? selectedEvent.alreadyBooked ? "Booked" : "Book" 
                    : "Book"
            }
            onFormSubmit={() => BookEventHandler(selectedEvent.title.toLowerCase())}
            authenticated={props.isAuthenticated}
            closeModal={() => setSelectedEvent(null)}>
            {
                selectedEvent
                    ? (
                        <Fragment>
                            <div className="d-flex justify-content-center mb-3">
                                <div className="w-50">
                                    <h3 className="mb-3">{selectedEvent.title}</h3>
                                    <p className="eventDetails">{new Date(selectedEvent.date).toLocaleString("en-GB", constants.DATE_AND_TIME_OPTIONS)}</p>
                                    <p className="eventDetails">${(+selectedEvent.price).toFixed(2)}</p>
                                </div>
                                <div className="w-50 d-flex justify-content-center align-items-center">
                                    <img 
                                        src={selectedEvent.image ? selectedEvent.image : defaultImage} 
                                        alt="EventPhoto" 
                                        className="eventImage"/>
                                </div>
                            </div>
                            <p className="eventDescription">
                                {selectedEvent.description
                                    ? selectedEvent.description
                                    : "No description"
                                }
                            </p>   
                        </Fragment>                                                            
                    )
                    : null
            }            
        </Modal>
    );
    
    const parsedEvents = events.map(event => {
        return (
            <div className="eventContainer" key={event.id}>
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
    });
    
    return (
        <Fragment>
            {showCreateModal || selectedEvent
                ? <Fragment>
                    <Backdrop/>
                    {showCreateModal 
                        ? createEventModal
                        : selectedEvent
                            ? detailsEventModal
                            : null
                    }
                </Fragment> 
                : null
            }
            {props.isAuthenticated ? createEventDiv : null}
            <div className="w-100 mt-4" style={{height: "75%"}}>
                <p className="allUpcomingEvents text-center">Upcoming Events:</p>
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