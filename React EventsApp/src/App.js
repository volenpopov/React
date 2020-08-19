import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import axios from "./axios-eventsapp";
import ThemeContext from "./context/theme-context";
import { DEFAULT_THEME } from "./helpers/constants";
import withErrorHandler from "./hoc/withErrorHandler/withErrorHandler";
import Navbar from "./components/Navigation/Navbar";
import Footer from "./components/Footer/Footer";
import AuthenticationForm from "./components/Forms/AuthenticationForm";
import HomeGuest from "./pages/Home/HomeGuest";
import Events from "./pages/Events/Events";
import EventsGuest from "./pages/Events/EventsGuest";
import UserBookings from "./pages/Bookings/UserBookings";
import UserProfile from "./pages/Profile/UserProfile";
import * as actions from "./store/actions/auth";
import * as constants from "./helpers/constants";

class App extends Component {
  state = { theme: DEFAULT_THEME };

  componentDidMount() {    
    this.props.onTryAutoSignup();     
  }

  componentDidUpdate(prevProps, prevState) {   
    if (!prevProps.userId && this.props.userId && prevState.theme === this.state.theme) {          
      axios.get(constants.USER_THEME_URL + `/${this.props.userId}.json?auth=${this.props.token}`)
        .then(response => {
          const theme = response.data.theme;

          if (theme !== this.state.theme) {            
            this.setState({ theme, themeVerified: true });
          } else {
            this.setState({ themeVerified: true });
          }
        })
        .catch(error => error);
    }
  }

  switchThemeHandler = theme => {
    if (this.props.isAuthenticated) {
        axios.put(constants.USER_THEME_URL + `/${this.props.userId}.json?auth=${this.props.token}`, { theme });          
    }   

    this.setState({ theme });
  }

  render() {
    const { isAuthenticated } = this.props;

    const pageNotFound = <h1 className="pageNotFound">404 Page Not Found</h1>;
    const pageNotFoundRoute = <Route path="" render={() => pageNotFound}/>;

    const authRoutes = (
        <Switch>
            <Route path="/" exact render={() => <Redirect to="/events"/>}/>
            <Route path="/events" component={Events} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/logout" render={() => <Redirect to="/"/>}/>
            <Route path="/bookings" component={UserBookings} />
            {pageNotFoundRoute}
        </Switch> 
    );

    const nonAuthRoutes = (
        <Switch>
            <Route path="/" exact component={HomeGuest}/>
            <Route path="/register" render={() => <AuthenticationForm login={false}/>}/>
            <Route path="/login" render={() => <AuthenticationForm login={true}/>}/>
            <Route path="/publicEvents" component={EventsGuest} />
            <Route path="" render={() => pageNotFound}/>
            {pageNotFoundRoute}
        </Switch>         
    );

    return (
      <div className="w-100 vh-100 d-flex flex-column">
        <ThemeContext.Provider value={{ themeColor: this.state.theme, switchTheme: this.switchThemeHandler}}>
          <Navbar authenticated={isAuthenticated}/>
          <div className="d-flex align-items-center flex-grow-1 flex-wrap" style={{ height: "85%" }}>
            { isAuthenticated ? authRoutes : nonAuthRoutes }            
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
    userId: state.userId,
    token: state.token
  };
};

const mapDispatchToProps = dispatch => {
  return {    
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

const AppWithErrorHandler = withErrorHandler(App, axios);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppWithErrorHandler));
