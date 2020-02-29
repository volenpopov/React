import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";
import { Form } from "react-bootstrap";

import ThemeContext from "../../context/theme-context";
import Backdrop from "../../components/Backdrop/Backdrop";
import Modal from "../../components/Modal/Modal";
import * as validators from "../../helpers/validators";
import * as constants from "../../helpers/constants";

import "./Events.css";

const Events = props => {
    const themeContext = useContext(ThemeContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [events, setEvents] = useState([]);

    const [errorMessages, setErrorMessages] = useState({
        title: null,
        price: null,
        date: null,
        description: null
    });

    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        const fromHomeGuest = props.location.state
            ? props.location.state.fromHomeGuest
            : null;

        //const currentDateNumber = Date.parse((new Date().toUTCString()));
        
        let fetchedEvents = [];

        axios.get(`${constants.EVENTS_URL}.json`)
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

    const hideModal = () => {
        setShowCreateModal(false);
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

        setErrorMessages({
            title: titleRequiredError || titleMinLengthError || titleStringValidityError,            
            price: priceValidityError,
            date: isNaN(Date.parse(date)) ? "Invalid date" : null,
            description: description.length > 400 ? "Description has a max length of 400 characters" : null
        });

        if (Object.keys(errorMessages).every(key => !errorMessages[key])) {
            const event = { title, price, date, description, creator: props.userId };

            axios.put(`${constants.EVENTS_URL}/${title.toLowerCase()}.json`, event)
                .then(() => hideModal(true))
                .catch(error => console.log(error));
        };
    }

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

    const createEventModal = (
        <Modal 
            title="Create Event" 
            actionButtonText="Create"
            onFormSubmit={onCreateEvent}
            closeModal={hideModal}>            
                <Form.Group controlId="formBasicTitle" className="mb-3">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control type="text" name="title" ref={titleRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.title ? errorMessages.title : null}
                    </span>
                </Form.Group>
                <Form.Group controlId="formBasicPrice" className="mb-3">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control type="text" name="price" ref={priceRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.price ? errorMessages.price : null}
                    </span>                    
                </Form.Group>
                <Form.Group controlId="formBasicDate" className="mb-3">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control type="datetime-local" name="date" ref={dateRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.date ? errorMessages.date : null}
                    </span>                    
                </Form.Group>
                <Form.Group controlId="formBasicDescription">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control as="textarea" rows="3" ref={descriptionRef}/>
                    <span className="text-danger ml-1">
                        {errorMessages.description ? errorMessages.description : null}
                    </span>
                </Form.Group>
        </Modal>
    );

    const parsedEvents = events.map(event => {
        return (
            <div className="eventContainer" key={event.id}>
                <div className="d-flex flex-column align-items-center p-3">
                    <p className={`eventTitle `}>{event.title}</p>
                    <p className={`bg-${themeContext.themeColor} text-white px-2 mb-0 rounded text-center`}>${(+event.price).toFixed(2)} - {new Date(event.date).toLocaleDateString()}</p>
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
                    {createEventModal}
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