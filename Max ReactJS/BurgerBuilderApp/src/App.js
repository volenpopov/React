import React, { Component } from 'react';
import { connect } from 'react-redux';
// import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Auth from './containers/Auth/Auth';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

// const asyncCheckout = asyncComponent(() => {
//   return import('./containers/Checkout/Checkout');
// });

// const asyncOrders = asyncComponent(() => {
//   return import('./containers/Orders/Orders');
// });

// const asyncAuth = asyncComponent(() => {
//   return import('./containers/Auth/Auth');
// });

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {

    let routes = (
      <Switch>
        <Route path='/auth' component={Auth}/> 
        <Route path='/' exact component={BurgerBuilder}/> 
        <Redirect to='/'/>
      </Switch>
      
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
            <Route path='/auth' component={Auth}/> 
            <Route path='/logout' component={Logout}/>                
            <Route path='/checkout' component={Checkout}/>
            <Route path='/orders' component={Orders}/>
            <Route path='/' exact component={BurgerBuilder}/> 
            <Redirect to='/'/>
        </Switch>
      );
    }

    return (
      <div className="App">
          <Layout>
            {routes}            
          </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
