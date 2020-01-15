import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ThemeContext from './context/theme-context';
import { DEFAULT_THEME } from './helpers/constants';
import Navbarr from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import AuthenticationForm from './components/Forms/AuthenticationForm';

class App extends Component {
  state = {
    token: null,
    expiresIn: null,
    userId: null,
    theme: DEFAULT_THEME
  };

  loginHandler = (token, expiresIn, userId) => {
    this.setState({ token, expiresIn, userId });
  };

  logoutHandler = () => {
    this.setState({ token: null, expiresIn: null, userId: null});
  }

  switchThemeHandler = theme => {
    this.setState({ theme });
  }

  render() {
    return (
      <Router>
          <div className="vw-100 vh-100 d-flex flex-column">
          <ThemeContext.Provider value={{ themeColor: this.state.theme, switchTheme: this.switchThemeHandler}}>
            <Navbarr authenticated={this.state.token !== null} userLogout={this.logoutHandler}/>
            <div className="d-flex align-items-center flex-grow-1">
              <Switch>
                <Route path="/register" render={() => <AuthenticationForm login={false} userLogin={this.loginHandler}/>}/>
                <Route path="/login" render={() => <AuthenticationForm login={true}/>}/>
                {/* <Route path="/" component={}/> */}
              </Switch>
            </div>
            <Footer/>
          </ThemeContext.Provider>          
        </div>
      </Router>      
    )
  };
}

export default App;
