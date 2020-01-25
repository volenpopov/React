import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import ThemeContext from './context/theme-context';
import { DEFAULT_THEME } from './helpers/constants';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import AuthenticationForm from './components/Forms/AuthenticationForm';
import * as actions from "./store/actions/auth";

class App extends Component {
  state = { theme: DEFAULT_THEME };

  componentDidMount = () => {
    this.props.onTryAutoSignup(); 
  }

  switchThemeHandler = theme => {
    this.setState({ theme });
  }

  render() {
    return (
      <div className="vw-100 vh-100 d-flex flex-column">
        <ThemeContext.Provider value={{ themeColor: this.state.theme, switchTheme: this.switchThemeHandler}}>
          <Navbar authenticated={this.props.isAuthenticated}/>
          <div className="d-flex align-items-center flex-grow-1">
            <Switch>
              <Route path="/register" render={() => <AuthenticationForm login={false}/>}/>
              <Route path="/login" render={() => <AuthenticationForm login={true}/>}/>
              {/* <Route path="/" component={}/> */}
            </Switch>
          </div>
          <Footer/>
        </ThemeContext.Provider>          
      </div>
    )
  };
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    userId: state.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {    
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
