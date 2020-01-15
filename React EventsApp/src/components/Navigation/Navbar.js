import React, { Fragment, useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeContext from '../../context/theme-context';

const Navigationbar = props => {
  const themeContext = useContext(ThemeContext);
  
  const navLinkStyle = {
    fontSize: '1.25rem',
    color: 'white'
  };

  return (
    <Navbar collapseOnSelect expand="sm" bg={themeContext.themeColor} variant="dark">
      <Navbar.Brand>
        EventsApp
    </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {props.authenticated
            ? <Nav.Link onClick={props.userLogout}>Logout</Nav.Link>
            : (
                <Fragment>
                  <Link to="/login" className="mr-4 mt-2 mt-sm-0 mb-2 mb-sm-0" style={navLinkStyle}>Login</Link> 
                  <Link to="/register" style={navLinkStyle}>Register</Link> 
                </Fragment>                
              )           
          }                    
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigationbar;
