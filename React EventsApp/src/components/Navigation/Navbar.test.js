import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Navigationbar } from "./Navbar";
import { NavLink } from "react-router-dom";

configure({ adapter: new Adapter() });

describe("<Navbar/>", () => {
    let wrapper;

    const loginBtn = (
        <NavLink
            to="/login"
            activeClassName="activeNavButton"
            className="navLinkStyle mr-2 mt-2 mt-sm-0 mb-2 mb-sm-0 px-2"
        >
            Login
        </NavLink> 
    );

    const registerBtn = (
        <NavLink
            to="/register"
            activeClassName="activeNavButton"
            className="navLinkStyle px-2"
        >
            Register
        </NavLink> 
    );

    const userEmail = "test@gmail.com";

    const userGreetingBtn = (
        <p
            className="greetingMessage px-2 mr-0 mr-sm-2 mt-2 mt-sm-0 mb-2 mb-sm-0"
        >
            Welcome, <NavLink
                to="/profile"
                activeClassName="activeNavButton" 
                className="userEmail px-2"
            >
                {userEmail}!
            </NavLink>
        </p>
    );

    const bookingsBtn = (
        <NavLink
            to="/bookings"
            activeClassName="activeNavButton"
            className="navLinkStyle px-2 mr-0 mr-sm-2 mt-2 mt-sm-0 mb-2 mb-sm-0"
        >
            Bookings
        </NavLink>
    );

    const onLogout = () => {};
        
    const logoutBtn = (
        <NavLink
            to="/logout"
            activeClassName="activeNavButton"
            className="navLinkStyle px-2 mt-0 mt-sm-0 mb-2 mb-sm-0"
            onClick={onLogout}
        >
            Logout
        </NavLink>                
    );

    beforeEach(() => {
        wrapper = shallow(<Navigationbar/>);
    });

    it("should render 3 buttons when not authenticated", () => {
        // Home Login Register
        expect(wrapper.find(NavLink)).toHaveLength(3);
    });
    
    it("should render a Home button leading to /publicEvents when not authenticated", () => {
        expect(
            wrapper
                .contains(
                    <NavLink
                        to="/publicEvents" 
                        activeClassName="activeNavButton" 
                        className="navLinkStyle px-2"
                    >
                        Home
                    </NavLink>
                )
        )
        .toEqual(true);
    });

    it("should render a Home button leading to /events when authenticated", () => {
        wrapper.setProps({ authenticated: true });
        expect(
            wrapper
                .contains(
                    <NavLink
                        to="/events" 
                        activeClassName="activeNavButton" 
                        className="navLinkStyle px-2"
                    >
                        Home
                    </NavLink>
                )
        )
        .toEqual(true);
    });

    it("should render Login and Register buttons when not authenticated", () => {        
        expect(wrapper.contains(loginBtn)).toEqual(true);

        expect(wrapper.contains(registerBtn)).toEqual(true);
    });

    it("should not render Login and Register buttons when authenticated", () => { 
        wrapper.setProps({ authenticated: true });
        
        expect(wrapper.contains(loginBtn)).toEqual(false);

        expect(wrapper.contains(registerBtn)).toEqual(false);
    });

    it("should render a user greeting button when authenticated", () => {
        wrapper.setProps({
            authenticated: true,
            email: userEmail
        });

        expect(wrapper.contains(userGreetingBtn)).toEqual(true);
    });

    it("should not render a user greeting button when not authenticated", () => {
        expect(wrapper.contains(userGreetingBtn)).toEqual(false);
    });

    it("should render a Bookings button leading to /bookings when authenticated", () => {        
        wrapper.setProps({ authenticated: true });

        expect(wrapper.contains(bookingsBtn)).toEqual(true)
    });

    it("should not render a Bookings button when not authenticated", () => {        
        expect(wrapper.contains(bookingsBtn)).toEqual(false);
    });

    it("should render a Logout button leading to /logout when authenticated", () => {                
        wrapper.setProps({
            authenticated: true,
            onLogout
        });

        expect(wrapper.contains(logoutBtn)).toEqual(true);
    });

    it("should not render a Logout button when not authenticated", () => {                        
        expect(wrapper.contains(logoutBtn)).toEqual(false);
    });
});