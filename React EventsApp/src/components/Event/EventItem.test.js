import React from 'react';

import { shallow } from 'enzyme';

import EventItem from "./EventItem";

describe("<EventItem />", () => {
    let component;

    const containerClassName = "eventContainer";

    const mockId = "mockId";
    const mockPrice = 10.2535;
    const mockSetSelectedEvent = jest.fn();

    beforeEach(() => {
        const mockEvent = {
            id: mockId,
            title: "Test",
            price: mockPrice,
            date: "2020-09-10T17:00:00.000Z"
        };

        component = shallow(
            <EventItem event={mockEvent} onSetSelectedEventHandler={mockSetSelectedEvent}/>
        );
    });

    it("should render", () => {
        expect(component.exists()).toBeTruthy();
    });
    
    it("should hold all the content inside a div with class eventContainer", () => {
        expect(component.hasClass(containerClassName)).toBeTruthy();
    });

    it("should display price rounded to 2 decimals and with a dollar sign in front", () => {
        const properPrice = `$${mockPrice.toFixed(2)}`;

        expect(
            component
                .find("p")
                .someWhere(paragraph => paragraph.text().includes(properPrice))
        ).toBeTruthy();
    });

    it("should display a View Details button", () => {
        expect(
            component
                .find("button")
                .filterWhere(btn => btn.text() === "View Details")
        ).toHaveLength(1);
    });

    it("should call the setSelectedEvent func upon click of View Details", () => {
        component
            .find("button")
            .filterWhere(btn => btn.text() === "View Details")
            .first()
            .simulate("click");
        
        expect(mockSetSelectedEvent).toBeCalledWith(mockId);
    });
})