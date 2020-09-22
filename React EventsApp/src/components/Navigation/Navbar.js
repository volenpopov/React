import React, { Fragment, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import ThemeContext from "../../context/theme-context";
import * as actions from "../../store/actions/auth";

import "./Navbar.css";

export const Navigationbar = props => {
  const themeContext = useContext(ThemeContext);
  
  const dispatch = useDispatch();

  const email = useSelector((state) => state.userEmail);
  const loading = useSelector((state) => state.loading);

  const headerMenu = (
    <Fragment>
      <NavLink to="/login" activeClassName="activeNavButton" className="navLinkStyle mr-2 mt-2 mt-sm-0 mb-2 mb-sm-0 px-2">Login</NavLink> 
      <NavLink to="/register" activeClassName="activeNavButton" className="navLinkStyle px-2">Register</NavLink> 
    </Fragment> 
  );

  const authenticatedHeaderMenu = (
    <Fragment>
      <p className="greetingMessage px-2 mr-0 mr-sm-2 mt-2 mt-sm-0 mb-2 mb-sm-0">Welcome, <NavLink to="/profile" activeClassName="activeNavButton" className="userEmail px-2">{email}!</NavLink></p>
      <NavLink to="/bookings" activeClassName="activeNavButton" className="navLinkStyle px-2 mr-0 mr-sm-2 mt-2 mt-sm-0 mb-2 mb-sm-0">Bookings</NavLink>
      <NavLink to="/logout" activeClassName="activeNavButton" className="navLinkStyle px-2 mt-0 mt-sm-0 mb-2 mb-sm-0" onClick={() => dispatch(actions.logout())}>Logout</NavLink>                
    </Fragment>  
  );

  return (
    <Navbar collapseOnSelect expand="sm" bg={themeContext.themeColor} variant="dark">
      <Navbar.Brand>
        <NavLink 
          to={props.authenticated ? "/events" : "/publicEvents"} 
          activeClassName="activeNavButton" 
          className="navLinkStyle px-2"
        >
          Home
        </NavLink>        
    </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
        {
            loading
                ? null
                : props.authenticated
                    ? authenticatedHeaderMenu
                    : headerMenu
        }                    
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigationbar;
