import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import ThemeContext from './context/theme-context';
import { DEFAULT_THEME } from './helpers/constants';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import AuthenticationForm from './components/Forms/AuthenticationForm';
import * as actions from "./store/actions/auth";
import * as constants from "./helpers/constants";

class App extends Component {
  state = { theme: DEFAULT_THEME };

  componentDidMount = () => {    
    this.props.onTryAutoSignup();     
  }

  componentDidUpdate = (prevProps, prevState) => {    
    if (this.props.userId && prevState.theme === this.state.theme) {    
      axios.get(constants.USER_THEME_URL + `/${this.props.userId}.json`)
        .then(response => {
          const theme = response.data.theme;                          
          
          if (theme !== this.state.theme) {
            this.setState({ theme });
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  switchThemeHandler = theme => {
    if (this.props.isAuthenticated) {
        axios.put(constants.USER_THEME_URL + `/${this.props.userId}.json`, { theme });          
    }   

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
