import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount() {
        axios.get('/orders.json')
            .then(resp => {
                const fetchedOrders = [];

                for (const key in resp.data) {
                    fetchedOrders.push({
                        id: key,
                        ...resp.data[key]
                    });
                }

                this.setState({loading: false, orders: fetchedOrders});
            })
            .catch(err => {
                this.setState({loading: false});
            })
    }

    render() {
        return (
            <div>
                {this.state.orders.map(order => {
                    return <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}/>
                })}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);

