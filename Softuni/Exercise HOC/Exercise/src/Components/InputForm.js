import React, { Component } from 'react';
import withExceptionNotification from './ErrorHOC';

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            errorMsg: null
        };
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        if (this.state.username.length < 3) {            
            this.setState({error: "Username must be at least 3 characters long!"});
            return;
        }

        this.setState({error: ''});
    } 

    render() {
        const errorStyle = {
            color: 'red'
        };

        const errorMsg = this.state.errorMsg;

        return (       
            <div>
                <form onSubmit={this.onSubmit}>
                    <input type='text' name='username' onChange={this.onChange} value={this.state.username}/>
                    <input type='submit' value='Login'/>
                    <span style={errorStyle}>{errorMsg !== '' ? errorMsg : ''}</span>    
                </form>                 
            </div>                                          
        );
    }
} 

const InputFormWithError = withExceptionNotification(InputForm);

export {InputForm};
export {InputFormWithError};