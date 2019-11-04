import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0 
        },
        totalPrice: 4,
        purchasable: false
    };

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

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disableInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}/>               
            </Aux>
        );        
    }
}

export default BurgerBuilder;