import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import AuthenticationForm from './components/Forms/AuthenticationForm';

class App extends Component {
  state = {
    isAuthenticated: false
  };

  render() {
    return (
      <Router>
          <div className="vw-100 vh-100 d-flex flex-column">
          <Navbar authenticated={this.state.isAuthenticated}/>
          <div className="d-flex align-items-center flex-grow-1">
            <Switch>
              <Route path="/register" render={() => <AuthenticationForm login={false}/>}/>
              <Route path="/login" render={() => <AuthenticationForm login={true}/>}/>
              {/* <Route path="/" component={}/> */}
            </Switch>
          </div>
          <Footer/>
        </div>
      </Router>      
    )
  };
}

export default App;
