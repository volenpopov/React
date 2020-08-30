import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import {
    axiosInstance as axios,
    getUserTheme,
    assignThemeToUser
} from "./axios-eventsapp";
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

class App extends Component {
  state = {
    theme: DEFAULT_THEME,
    themeVerified: false,
    fetchingUserTheme: false,
  };

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  componentDidUpdate(prevProps, prevState) {
    const { userInfoChecked, userId, token } = this.props;

    if (!this.state.themeVerified) {
      if (
        userInfoChecked &&
        userId &&
        prevState.theme === this.state.theme &&
        !this.state.fetchingUserTheme
      ) {
        this.fetchUserTheme(userId, token);
        this.setState({ fetchingUserTheme: true });
      } else if (userInfoChecked && !userId) {
        this.setState({ themeVerified: true });
      }
    }
  }

  fetchUserTheme = (userId, token) => {
    getUserTheme(userId, token)
      .then((response) => {
        if (response.data) {
          const theme = response.data.theme;

          if (theme !== this.state.theme) {
            this.setState({
              theme,
              themeVerified: true,
              fetchingUserTheme: false
            });
          }
        }

        this.setState({
          themeVerified: true,
          fetchingUserTheme: false
        });
      })
      .catch((error) => error);
  };

  switchThemeHandler = (theme) => {
    if (this.props.isAuthenticated) {
        assignThemeToUser(
            this.props.userId,
            this.props.token,
            theme
        );
    }

    this.setState({ theme });
  };

  unverifyUserTheme = () => this.setState({ themeVerified: false });

  render() {
    if (!this.state.themeVerified) {
      return null;
    }

    const { isAuthenticated } = this.props;

    const pageNotFound = <h1 className="pageNotFound">404 Page Not Found</h1>;
    const pageNotFoundRoute = <Route render={() => pageNotFound} />;

    const authRoutes = [
      <Route path="/" key="/" exact render={() => <Redirect to="/events" />} />,
      <Route
        path="/publicEvents"
        key="/publicEventsAuth"
        exact
        render={() => <Redirect to="/events" />}
      />,
      <Route path="/events" key="/events" component={Events} />,
      <Route path="/profile" key="/profile" component={UserProfile} />,
      <Route path="/logout" key="/logout" render={() => <Redirect to="/" />} />,
      <Route path="/bookings" key="/bookings" component={UserBookings} />,
    ];

    return (
      <div className="w-100 vh-100 d-flex flex-column">
        <ThemeContext.Provider
          value={{
            themeColor: this.state.theme,
            switchTheme: this.switchThemeHandler,
          }}
        >
          <Navbar authenticated={isAuthenticated} />
          <div
            className="d-flex align-items-center flex-grow-1 flex-wrap"
            style={{ height: "85%" }}
          >
            <Switch>
              <Route
                path="/register"
                render={() => (
                  <AuthenticationForm
                    login={false}
                    unverifyTheme={this.unverifyUserTheme}
                  />
                )}
              />
              <Route
                path="/login"
                render={() => (
                  <AuthenticationForm
                    login={true}
                    unverifyTheme={this.unverifyUserTheme}
                  />
                )}
              />
              <Route path="/logout" render={() => <Redirect to="/" />} />
              {isAuthenticated ? authRoutes : null}
              <Route path="/publicEvents" component={EventsGuest} />
              <Route path="/" exact component={HomeGuest} />
              {pageNotFoundRoute}
            </Switch>
          </div>
          <Footer />
        </ThemeContext.Provider>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    userId: state.userId,
    token: state.token,
    userInfoChecked: state.userInfoChecked,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

const AppWithErrorHandler = withErrorHandler(App, axios);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppWithErrorHandler)
);
