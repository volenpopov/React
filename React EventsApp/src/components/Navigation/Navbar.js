import React, { Fragment, useContext } from "react";
import { connect } from "react-redux";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import ThemeContext from "../../context/theme-context";
import * as actions from "../../store/actions/auth";

const Navigationbar = props => {
  const themeContext = useContext(ThemeContext);

  const navLinkStyle = {
    fontSize: "1.25rem",
    color: "white"
  };
  
  const headerMenu = (
    <Fragment>
      <Link to="/login" className="mr-4 mt-2 mt-sm-0 mb-2 mb-sm-0" style={navLinkStyle}>Login</Link> 
      <Link to="/register" style={navLinkStyle}>Register</Link> 
    </Fragment> 
  );

  const authenticatedHeaderMenu = (
    <Fragment>
      <p className="mr-0 mr-sm-4 mt-2 mt-sm-0 mb-2 mb-sm-0" style={navLinkStyle}>Welcome, <Link to="/profile" style={navLinkStyle}>{props.email}</Link>!</p>
      <Link to="" className="mt-0 mt-sm-0 mb-2 mb-sm-0" onClick={props.onLogout} style={navLinkStyle}>Logout</Link>                
    </Fragment>  
  );


  return (
    <Navbar collapseOnSelect expand="sm" bg={themeContext.themeColor} variant="dark">
      <Navbar.Brand>
        <Link to="/" className="text-white">EventsApp</Link>        
    </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          { props.loading ? null : props.authenticated ? authenticatedHeaderMenu : headerMenu }                    
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => {
  return { 
    email: state.userEmail, 
    loading: state.loading
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigationbar);
