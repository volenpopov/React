import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as validators from '../../helpers/validators';
import * as constants from '../../helpers/constants';
import * as errorMessages from '../../helpers/errorMessages';
import { Form, Button } from 'react-bootstrap';
import ThemeContext from '../../context/theme-context';
import * as authActions from '../../store/actions/auth';

class AuthenticationForm extends Component {
    state = {
        email: null,
        password: null,
        confirmPassword: null,
        hasBeenSubmitted: false,
        errorMessages: {
            email: null,
            password: null,
            confirmPassword: null
        }
    };

    static contextType = ThemeContext;

    onFormSubmit = event => {
        event.preventDefault();

        this.setState({ hasBeenSubmitted: true });

        const { email, password, confirmPassword } = this.state;

        const emailIsRequiredError = validators.isRequired('email')(email);        
        const passwordIsRequiredError = validators.isRequired('password')(password);        
    
        const emailError = emailIsRequiredError ? emailIsRequiredError : this.state.errorMessages.email;
        const passwordError = passwordIsRequiredError ? passwordIsRequiredError : this.state.errorMessages.password;
        const confirmPasswordError = confirmPassword !== password
            ? errorMessages.PASSWORD_MISMATCH
            : null;

        if (emailIsRequiredError || 
            passwordIsRequiredError ||
            (this.state.errorMessages.confirmPassword !== confirmPasswordError)) {
                this.setState({ 
                    errorMessages: {
                        email: emailError,
                        password: passwordError,
                        confirmPassword: confirmPasswordError
                    }
                });
        }

        this.props.onAuth(email, password, this.props.login);                     
    };

    onEmailChanged = event => {
        const email = event.target.value;

        const emailError = validators.isEmail(email);

        if (emailError) {
            this.setState({
                errorMessages: {
                    ...this.state.errorMessages,
                    email: emailError
                }
            });
        } else {
            this.setState({
                errorMessages: {
                    ...this.state.errorMessages,
                    email: null
                }
            });
        }

        this.setState({ email });
    };

    onPasswordChanged = event => {
        const password = event.target.value;
        const fieldName = event.target.name;
        
        const minLengthError = validators.minLength(constants.PASSWORD_MIN_LENGTH)(fieldName)(password);

        if (minLengthError) {                       
            this.setState({ 
                errorMessages: {
                    ...this.state.errorMessages,
                    password: minLengthError
                }
            });
        } else {
            this.setState({ 
                errorMessages: {
                    ...this.state.errorMessages,
                    password: null
                }
            });
        } 
        
        this.setState({ password });
    };

    onConfirmPasswordChanged = event => {
        const confirmPassword = event.target.value;

        this.setState({ confirmPassword });
    };

    render() {
        if (this.props.loading) {
            return null;
            //ADD SPINNER
        }

        if (this.props.error) {
            //DISPLAY SERVER ERROR
        }
        

        const formHasBeenSubmitted = this.state.hasBeenSubmitted;
        const emailError = this.state.errorMessages.email;
        const passwordError = this.state.errorMessages.password;
        const confirmPasswordError = this.state.errorMessages.confirmPassword;

        const confirmPasswordField = (
            <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control type="password" placeholder="Confirm your password" name="confirmPassword" onChange={this.onConfirmPasswordChanged}/>
                <span className="text-danger">
                    {formHasBeenSubmitted ? confirmPasswordError : null}
                </span>
            </Form.Group>
        );
        
        return (
            <div className="d-flex flex-column align-items-center flex-grow-1 text-center">                
                <h3 className="mb-4">{this.props.login ? "Login" : "Register"}</h3>
                
                <Form className="w-sm-100" onSubmit={this.onFormSubmit}>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.onEmailChanged}/>
                        <span className="text-danger">
                            {formHasBeenSubmitted ? emailError : null}
                        </span>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" onChange={this.onPasswordChanged}/>
                        <span className="text-danger">
                            {formHasBeenSubmitted ? passwordError : null}
                        </span>                        
                    </Form.Group>

                    {this.props.login ? null : confirmPasswordField}                

                    <Button className={`px-4 btn-${this.context.themeColor}`} variant="primary" type="submit" disabled={emailError || passwordError}>
                        {this.props.login ? "Login" : "Register"}                                    
                    </Button>
                </Form>
            </div>            
        );
    };
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        error: state.error,
        isAuthenticated: state.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password, login ) => dispatch(authActions.auth(email, password, login)) 
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationForm);