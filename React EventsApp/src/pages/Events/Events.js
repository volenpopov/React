import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";
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

    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);
    const imagesRef = useRef(null);

    useEffect(() => {     
        if (props.userId && props.token) {
            const eventsRequest = axios.get(`${constants.EVENTS_URL}.json`);
            const userBookingsRequest =  axios.get(`${constants.BOOKINGS_URL}.json?auth=${props.token}&orderBy="userId"&equalTo="${props.userId}"`);

            Promise.all([eventsRequest, userBookingsRequest])
                .then(([events, bookings]) => {
                    const userEvents = parseEvents(events.data, props.userId);
                    const userBookings = bookings.data;
                    
                    setEvents(userEvents, props.userId);

                    const userBookingsKeys = Object.keys(userBookings)

                    if (userBookingsKeys.length) {
                        const fetchedUserBookings = userBookingsKeys
                                .map(key => ({ id: key, ...userBookings[key] }));
                            
                        setUserBookings(fetchedUserBookings);
                    }
                })
                .catch(error => error); 
        }                  
    }, [props.userId, props.token]);

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
                const imagesPromises = files.map(imageFile => getBase64(imageFile));
                
                Promise.all(imagesPromises)
                    .then(imagesBase64Array => {
                        axios.put(`${constants.EVENTS_URL}/${title.toLowerCase()}.json?auth=${props.token}`, { ...event, images: imagesBase64Array })
                    })
                    .then(() => setShowCreateModal(false))
                    .catch(error => error);                                
            } else {
                axios.put(`${constants.EVENTS_URL}/${title.toLowerCase()}.json?auth=${props.token}`, event)                          
                    .then(() => setShowCreateModal(false))
                    .catch(error => error);
            }
        };

        setErrorMessages(errors);
    };

    const bookEventHandler = eventId => {  
        setSelectedEvent(null);  

        const newBooking = { 
            userId: props.userId, 
            eventId, 
            bookedOn: new Date() 
        };

        if (!userBookings.find(booking => booking.userId === props.userId && booking.eventId === eventId)) {
            axios.post(`${constants.BOOKINGS_URL}.json?auth=${props.token}`, newBooking)
                .then(() => setUserBookings([...userBookings, newBooking]))
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
        <EventDetailsModal 
            selectedEvent={selectedEvent} 
            setSelectedEvent={setSelectedEvent}
            onFormSubmit={() => bookEventHandler(selectedEvent.title.toLowerCase())}
            authenticated={props.isAuthenticated}
        />
    );

    const eventsList = (
        <EventsList
            events={userEvents}
            onSetSelectedEventHandler={onSetSelectedEventHandler}
        />
    );
    
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
            <div className="w-100 mt-4 mb-0 mb-sm-4">
                <p className="allUpcomingEvents text-center">Upcoming Events:</p>
                <div className="parsedItemsContainer">
                    {eventsList}
                </div>
            </div>                        
        </Fragment>        
    );
};

const mapStateToProps = state => {
    return {        
        isAuthenticated: state.token !== null,
        userId: state.userId,
        token: state.token
    };
};

export default connect(mapStateToProps)(Events);