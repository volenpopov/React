import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 15
                },
                valid: false,
                touched: false,
                errorMessage: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                errorMessage: '' 
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                errorMessage: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                errorMessage: ''
            },
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
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true                
            }
        },
        formIsValid: false
    }

    orderHandler = e => {
        e.preventDefault();    

        const formData = {};

        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        };

        this.props.onOrderBurger(order, this.props.token);
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

    inputChangedHandler = (e, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.value = e.target.value;

        const validationObj = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        
        updatedFormElement.valid = validationObj.valid;
        updatedFormElement.errorMessage = validationObj.errorMessage;
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid = true;

        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid

            if (!formIsValid) {
                break;
            }
        }

        this.setState({
            orderForm: updatedOrderForm,
            formIsValid
        });
    }

    render() {
        const formElementsArray = [];

        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        errorMessage={formElement.config.errorMessage}
                        changed={(e) => this.inputChangedHandler(e, formElement.id)}/>
                ))}
                <Button     
                    btnType='Success'
                    disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if (this.props.loading) {
            form = <Spinner/>;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.props.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };    
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));