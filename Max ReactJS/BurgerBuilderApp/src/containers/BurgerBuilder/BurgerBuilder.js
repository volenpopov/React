import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';



class BurgerBuilder extends Component {
    state = {
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        // axios.get('https://burgerbuilder-6f349.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         const ingredients = response.data;
        //         this.setState({ingredients});
        //     })
        //     .catch(error => this.setState({error: true}));
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    puchaseCancelHandler = () => {
        this.setState({purchasing: false});        
    }

    puchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    updatePurchaseState = ingredients => {
        const ingredientsCount = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum + el);

        return ingredientsCount > 0;
    }

    render() {
        const disableInfo = {
            ...this.props.ingredients
        };

        for (const key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        };

        let orderSummary = null;

        let burger = this.state.error
            ? <p 
                style={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
                Ingredients couldn't be loaded!
              </p>
            : <Spinner/>;

        if (this.props.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disableInfo}
                        purchasable={this.updatePurchaseState(this.props.ingredients)}
                        price={this.props.price}
                        ordered={this.purchaseHandler}/>
                </Aux>
            );

            orderSummary = <OrderSummary 
            ingredients={this.props.ingredients}
            price={this.props.price}
            purchaseCancelled={this.puchaseCancelHandler}
            purchaseContinued={this.puchaseContinueHandler}/>;

            if (this.state.loading) {
                orderSummary = <Spinner/>;
            }
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.puchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );        
    }
}

const mapStateToProps = state => {
    return {
       ingredients: state.ingredients,
       price: state.totalPrice 
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: ingredientName => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName}),
        onIngredientRemoved: ingredientName => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));