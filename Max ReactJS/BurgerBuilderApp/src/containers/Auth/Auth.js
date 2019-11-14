import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.css'
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 30
                },
                valid: false,
                touched: false,
                errorMessage: ''
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false,
                errorMessage: ''
            }           
        },
        isSignUp: true
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath()
        }
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp};
        });
    }

    checkValidity = (value, rules) => {
        let valid = true;
        const errorPrefix = 'Error: ';
        let errorMessage = '';

        if (rules.required) {
            valid = value.trim() !== '' && valid;

            if (!valid) {
                errorMessage = errorPrefix + 'The field is required!';
                return {valid, errorMessage};
            }
        }
    
        if (rules.minLength) {
            valid = value.length >= rules.minLength && valid;

            if (!valid) {
                errorMessage = errorPrefix + `Minimum length is ${rules.minLength} symbols!`;
                return {valid, errorMessage};
            }
        }
    
        if (rules.maxLength) {
            valid = value.length <= rules.maxLength && valid;

            if (!valid) {
                errorMessage = errorPrefix + `Maximum length is ${rules.maxLength} symbols!`;
            }
        }
               
        return {valid, errorMessage};
    }

    inputChangedHandler = (event, controlName) => {
        const validationObj = this.checkValidity(event.target.value, this.state.controls[controlName].validation);

        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: validationObj.valid,
                errorMessage: validationObj.errorMessage,
                touched: true
            }
        }
        this.setState({controls: updatedControls});
    }

    submitHandler = event => {
        event.preventDefault();

        this.props.onAuth(
            this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.isSignUp);
    }

    render() {
        const formElementsArray = [];

        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                errorMessage={formElement.config.errorMessage}
                changed={(e) => this.inputChangedHandler(e, formElement.id)} />
        ))

        if (this.props.loading) {
            form = <Spinner/>;
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = <p style={{color: 'red', fontWeight: 'bold'}}>{this.props.error.message}</p>
        }

        let authRedirect = null;

        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                {this.state.isSignUp ? "REGISTER" : "LOGIN"}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
            <Button 
                btnType="Danger"
                clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignUp ? "LOGIN" : "REGISTER"}</Button>
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);