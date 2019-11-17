import React, { Fragment } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const img = require("../../resources/burger-logo.png");

const navbar = props => {

  const navLinkStyle = {
    color: 'white',
    fontSize: '20px'
  };

  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <Navbar.Brand>
        <img
          alt="Burger Logo"
          src={img}
          width="45"
          height="35"
          className="d-inline-block align-top"
        /> Burger Builder
    </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {props.authenticated
            ? <Nav.Link style={navLinkStyle}>Logout</Nav.Link>
            : (
                <Fragment>
                  <Link to="/login" className="mr-4" style={navLinkStyle}>Login</Link> 
                  <Link to="/register" style={navLinkStyle}>Register</Link> 
                </Fragment>                
              )           
          }                    
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default navbar;
