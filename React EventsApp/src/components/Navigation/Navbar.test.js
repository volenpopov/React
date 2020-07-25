import React from 'react';

import { shallow } from 'enzyme';

import { Navigationbar } from "./Navbar";
import { NavLink } from "react-router-dom";

describe("<Navbar/>", () => {
    let component;

    const userEmail = "test@gmail.com";

    beforeEach(() => {
        component = shallow(<Navigationbar/>);
    });

    it("should render", () => {
        expect(component.exists()).toBeTruthy();
    });

    it("should render 3 buttons when not authenticated", () => {
        // Home Login Register
        expect(component.find(NavLink)).toHaveLength(3);
    });
    
    it("should render a Home button leading to /publicEvents when not authenticated", () => {
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/publicEvents")
        ).toEqual(true);
    });

    it("should render a Home button leading to /events when authenticated", () => {
        component.setProps({ authenticated: true });
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/events")
        ).toEqual(true);        
    });

    it("should render Login and Register buttons when not authenticated", () => {   
        expect(
            component
                .find(NavLink)    
                .someWhere(NavLink => NavLink.props().to === "/login")
        ).toEqual(true);

        expect(
            component            
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/register")
        ).toEqual(true);             
    });

    it("should not render Login and Register buttons when authenticated", () => { 
        component.setProps({ authenticated: true });
        
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/login")
        ).toEqual(false);

        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/register")
        ).toEqual(false);
    });

    it("should render a user greeting button when authenticated", () => {
        component.setProps({
            authenticated: true,
            email: userEmail
        });

        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/profile"
                    && NavLink.text() === `${userEmail}!`
                    && NavLink.hasClass("userEmail"))
        ).toEqual(true);        
    });

    it("should not render a user greeting button when not authenticated", () => {
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/profile")
        ).toEqual(false);        
    });

    it("should render a Bookings button leading to /bookings when authenticated", () => {        
        component.setProps({ authenticated: true });
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/bookings")
        ).toEqual(true);   
    });

    it("should not render a Bookings button when not authenticated", () => {        
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/bookings")
        ).toEqual(false); 
    });

    it("should render a Logout button leading to /logout when authenticated", () => {                
        component.setProps({ authenticated: true });
        
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/logout")
        ).toEqual(true); 
    });

    it("should not render a Logout button when not authenticated", () => {                        
        expect(
            component
                .find(NavLink)
                .someWhere(NavLink => NavLink.props().to === "/logout")
        ).toEqual(false); 
    });

    it("should call logout func on Logout btn click", () => {
        const mockLogout = jest.fn();

        component.setProps({
            authenticated: true,
            onLogout: mockLogout
        });        

        component
            .find(NavLink)    
            .filterWhere(NavLink => NavLink.props().to === "/logout")
            .first()
            .simulate("click");

        expect(mockLogout).toBeCalled();
    });

    it("should render only the Home button while loading", () => {
        component.setProps({ loading: true });

        expect(component.find(NavLink)).toHaveLength(1);
        expect(
                component
                    .find(NavLink)
                    .someWhere(NavLink => NavLink.hasClass("navLinkStyle")
                        && NavLink.text() === "Home"
                    )                    
        ).toEqual(true);
    });
});