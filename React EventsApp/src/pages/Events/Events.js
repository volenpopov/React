import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { eventsAppRequester as requester } from "../../axios-eventsapp";
import { Form } from "react-bootstrap";

import ThemeContext from "../../context/theme-context";
import EventsList from "../../components/Event/EventsList";
import EventDetailsModal from "../../components/Event/EventDetailsModal";
import Backdrop from "../../components/Backdrop/Backdrop";
import Modal from "../../components/Modal/Modal";
import * as validators from "../../helpers/validators";
import * as constants from "../../helpers/constants";
import parseEvents from "../../helpers/eventsParser";
import getBase64 from "../../helpers/getBase64";

import "./Events.css";

const Events = props => {
    const themeContext = useContext(ThemeContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
 
    const [notificationType, setNotificationType] = useState(null);
    const [notificationStyle, setNotificationStyles] = useState({
        left: "-275px"
    });

    const [timeoutId, setTimeoutId] = useState(null);

    const [userEvents, setEvents] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [errorMessages, setErrorMessages] = useState({
        title: null,
        price: null,
        date: null,
        description: null,
        images: null
    });

    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.userId);
    const isAuthenticated = useSelector((state) => state.token !== null);

    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);
    const imagesRef = useRef(null);

    // Clear any pending async actions / setTimeouts on component unmount
    // or before dispatching a new setTimeout
    useEffect(() => {
        if (timeoutId) {
            return () => clearTimeout(timeoutId);
        }        
    }, [timeoutId]);

    useEffect(() => {     
        if (userId && token) {
            const eventsRequest = requester.getEvents();
            const userBookingsRequest =  requester.getBookings(token);

            Promise.all([eventsRequest, userBookingsRequest])
                .then(([events, bookings]) => {
                    const userEvents = parseEvents(events.data, userId);
                    const bookingsByEvents = bookings.data;

                    setEvents(userEvents, userId);

                    const userBookings = [];

                    Object.keys(bookingsByEvents).forEach((event) => {
                        const eventBookings = bookingsByEvents[event];

                        Object.keys(eventBookings).forEach((bookingKey) => {
                            const booking = eventBookings[bookingKey];
                            
                            if (booking.userId === userId) {
                                userBookings.push(booking);
                            }
                        }); 
                    });
                                        
                    setUserBookings(userBookings);                   
                })
                .catch(error => error); 
        }                  
    }, [userId, token]);

    const showNotification = (type) => {
        setNotificationType(type);
        setNotificationStyles({            
            left: "25px"
        });
    };

    const hideNotification = () => {
        setNotificationStyles({
            left: "-275px"
        });
    };

    const closeModalHandler = () => {
        setErrorMessages({ title: null, price: null, date: null, description: null, images: null });
        setShowCreateModal(false);
    }

    const onSetSelectedEventHandler = eventId => {        
        const event = { 
            ...userEvents.find(event => event.id === eventId), 
            alreadyBooked: userBookings.find(booking => booking.eventId === eventId) !== undefined
        };

        setSelectedEvent(event);
    };

    const onSuccessfullEventCreation = () => {
        setShowCreateModal(false);

        showNotification("event");

        const timeoutId = setTimeout(() => {            
            hideNotification();
        }, 1500);        

        setTimeoutId(timeoutId);
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
            const event = { title, price, date, description, creator: userId };

            if (files.length) {
                const imagesPromises = files.map(imageFile => getBase64(imageFile));
                
                Promise.all(imagesPromises)
                    .then(imagesBase64Array => {
                        return requester.createEvent(event, imagesBase64Array, token);                           
                    })
                    .then(() => onSuccessfullEventCreation())
                    .catch(error => error);                                
            } else {
                requester.createEvent(event, null, token)                         
                    .then(() => onSuccessfullEventCreation())
                    .catch(error => error);
            }
        };

        setErrorMessages(errors);
    };
 
    const bookEventHandler = eventId => {  
        setSelectedEvent(null);  

        const newBooking = { 
            userId, 
            eventId, 
            bookedOn: new Date() 
        };
                
        if (!userBookings.find(booking => booking.userId === userId && booking.eventId === eventId)) {
            requester.bookEvent(eventId, newBooking, token)
                .then(() => {
                    setUserBookings([...userBookings, newBooking]);

                    showNotification("booking");

                    const timeoutId = setTimeout(() => {
                        hideNotification();
                    }, 1500);
                    
                    setTimeoutId(timeoutId);
                })
                .catch(error => error);
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
            authenticated={isAuthenticated}
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
        <EventDetailsModal 
            selectedEvent={selectedEvent} 
            setSelectedEvent={setSelectedEvent}
            onFormSubmit={() => bookEventHandler(selectedEvent.title.toLowerCase())}
            authenticated={isAuthenticated}
        />
    );

    const eventsList = (
        <EventsList
            events={userEvents}
            onSetSelectedEventHandler={onSetSelectedEventHandler}
        />
    );
    
    const successfullEventCreationNotification = (
        <p 
            className={`successNotification bg-${themeContext.themeColor}`}
            style={notificationStyle}
        >
            {
                notificationType === "event"
                    ? "Event created successfully!"
                    : "Successfull booking!"
            }
        </p>
    );

    return (
        <Fragment>
            {successfullEventCreationNotification}
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
            {isAuthenticated ? createEventDiv : null}
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