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

import "./Events.css";

const Events = props => {
    const themeContext = useContext(ThemeContext);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [errorMessages, setErrorMessages] = useState({
        title: null,
        price: null,
        date: null,
        description: null,
        image: null
    });

    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {        
        const fromHomeGuest = props.location.state
            ? props.location.state.fromHomeGuest
            : null;

        let fetchedEvents = [];

        axios.get(`${constants.EVENTS_URL}.json`)
            .then(response => {
                const data = response.data;
                
                if (data) {
                    const currentDateNumber = Date.parse(new Date());

                    fetchedEvents = Object.keys(data)
                        .map(key => ({ id: key, ...data[key] }))
                        .filter(event => {
                            const eventDate = new Date(event.date);                            
                            const eventDateNumber = Date.parse(eventDate);

                            if (fromHomeGuest) {                                      
                                return currentDateNumber <= eventDateNumber;
                            } else if (props.userId) {                                
                                return event.creator !== props.userId && currentDateNumber <= eventDateNumber;
                            }
                            
                            return false;
                        });                                   
                                
                    setEvents([...fetchedEvents]);
                }                
            })
            .catch(error => console.log(error));        
    }, [props.userId, props.location.state]);

    const onSetSelectedEventHandler = eventId => {
        const event = events.find(event => event.id === eventId);
        setSelectedEvent(event);
    }

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

        const file = imageRef.current.files[0];                
        let fileTypeError = null;            

        if (file) {
            if (file.type.substring(0, 5) !== "image") {
                fileTypeError = constants.EVENT_IMAGE_INVALID_TYPE_ERROR; 
            }            
        }

        const errors = {
            ...errorMessages,
            title: titleRequiredError || titleMinLengthError || titleStringValidityError,            
            price: priceValidityError,
            date: isNaN(Date.parse(date)) ? "Invalid date" : null,
            description: description.length > 400 ? "Description has a max length of 400 characters" : null,
            image: fileTypeError
        };
                
        if (Object.keys(errors).every(key => !errors[key])) {
            const event = { title, price, date, description, creator: props.userId };

            if (file) {
                getBase64(file)
                    .then(imageBase64 => {
                        axios.put(`${constants.EVENTS_URL}/${title.toLowerCase()}.json`, { ...event, image: imageBase64 });                            
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
    }

    const createEventDiv = (
        <div className="createEventContainer w-100 text-center mt-4">
            <p>Share your own Events!</p>
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
            closeModal={() => setShowCreateModal(false)}>            
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
                <Form.Group controlId="formBasicImage" className="d-flex flex-column">
                    <div className="d-flex flex-row">
                        <Form.Label className="mr-2">Image:</Form.Label>
                        <Form.Control as="input" type="file" accept="image/*"  className="d-block w-75" ref={imageRef}/>
                    </div>                    
                    <span className="text-danger ml-1">
                        {errorMessages.image ? errorMessages.image : null}
                    </span>
                </Form.Group>
        </Modal>
    );

    const detailsEventModal = (
        <Modal
            title="Details" 
            actionButtonText="Book"
            onFormSubmit={onCreateEvent}
            authenticated={props.isAuthenticated}
            closeModal={() => setSelectedEvent(null)}>
            {
                selectedEvent
                    ? (
                        <h3 className="mb-3">{selectedEvent.title}</h3>
                        
                    )
                    : null
            }
            
        </Modal>
    );

    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

    const parsedEvents = events.map(event => {
        return (
            <div className="eventContainer" key={event.id}>
                <div className="d-flex flex-column align-items-center p-3">
                    <p className={`eventTitle `}>{event.title}</p>
                    <p 
                        className={`bg-${themeContext.themeColor} text-white px-2 mb-0 rounded text-center`}>
                        ${(+event.price).toFixed(2)} - {new Date(event.date).toLocaleDateString(undefined, dateOptions)}
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