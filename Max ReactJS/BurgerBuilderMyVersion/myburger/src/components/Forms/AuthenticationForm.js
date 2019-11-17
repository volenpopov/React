import React, { Component } from 'react';

import { Form, Button } from 'react-bootstrap';

class AuthenticationForm extends Component {
    state = {
        email: {},
        password: {},
        confirmPassword: {}
    };

    render() {
        const confirmPasswordField = (
            <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control type="password" placeholder="ConfirmPassword" />
            </Form.Group>
        );
        return (
            <div className="d-flex flex-column align-items-center flex-grow-1 text-center">                
                <h3 className="mb-4">{this.props.login ? "Login" : "Register"}</h3>
                
                <Form className="w-sm-100">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    {this.props.login ? null : confirmPasswordField}                

                    <Button className="" variant="primary" type="submit">
                        {this.props.login ? "Login" : "Register"}                                    
                    </Button>
                </Form>
            </div>            
        );
    };
}

export default AuthenticationForm;