import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('https://burgerbuilder-6f349.firebaseio.com/ingredients.json')
            .then(response => {
                const ingredients = response.data;
                this.setState({ingredients});
            })
            .catch(error => this.setState({error: true}));
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    puchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    puchaseContinueHandler = () => {
        this.setState({loading: true});

        const order = {
            ingredints: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Pesho',
                address: {
                    street: 'Vitosha 1',
                    zipCode: '1015',
                    country: 'Bulgaria'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };

        axios.post('/orders.json', order)
            .then(response => this.setState({loading: false, purchasing: false}))
            .catch(error => this.setState({loading: false, purchasing: false}));
    }

    updatePurchaseState = ingredients => {
        const ingredientsCount = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum + el);

        this.setState({purchasable: ingredientsCount > 0});
    }

    addIngredientHandler = type => {                     
        const currentCount = this.state.ingredients[type];
        const updatedCount = currentCount + 1;

        const ingredients = {...this.state.ingredients};
        ingredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];

        this.setState(prevstate => ({
            ingredients,
            totalPrice: prevstate.totalPrice + priceAddition
        }));

        this.updatePurchaseState(ingredients);
    }

    removeIngredientHandler = type => {
        const currentCount = this.state.ingredients[type];

        if (currentCount === 0) {
            return;
        }

        const updatedCount = currentCount - 1;

        const ingredients = {...this.state.ingredients};
        ingredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const totalPrice = this.state.totalPrice - priceDeduction > 4
            ? this.state.totalPrice - priceDeduction
            : 4;
        
        this.setState({ingredients, totalPrice});

        this.updatePurchaseState(ingredients);
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
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

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}/>
                </Aux>
            );

            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);