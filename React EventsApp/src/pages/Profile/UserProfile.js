import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-eventsapp";

import * as constants from "../../helpers/constants";

class UserEvents extends Component {
    state = { events: [] }; 

    componentDidUpdate(prevProps) {
        if (!prevProps.userId && this.props.userId) {
            axios.get(`${constants.EVENTS_URL}.json?orderBy="creator"&equalTo="${this.props.userId}"`)
                .then(response => {
                    const data = response.data;
                    
                    if (data) {
                        const fetchedEvents = Object.keys(data)
                            .map(key => ({ id: key, ...data[key] }));

                        this.setState({ events: [...fetchedEvents]});
                    }                
                })
                .catch(error => console.log(error));
        }        
    };

    render() {
        console.log("userEvents", this.state.events);
        
        return null;
    };
}

const mapStateToProps = state => ({ userId: state.userId });

export default connect(mapStateToProps)(UserEvents);