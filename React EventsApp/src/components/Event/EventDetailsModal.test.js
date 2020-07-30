import React from 'react';

import { shallow } from 'enzyme';

import EventDetailsModal from "./EventDetailsModal";

describe("<EventDetailsModal/>", () => {
    let component;

    const mockSelectedEvent = {
        id: "mockId",
        title: "Test",
        price: 10.253,
        date: "2020-09-10T17:00:00.000Z",
        description: "Random description"
    };

    const mockSetSelectedEvent = jest.fn();

    beforeEach(() => {        
        component = shallow(
            <EventDetailsModal
                selectedEvent={mockSelectedEvent}
                setSelectedEvent={mockSetSelectedEvent}
            />
        );
    });

    it("should render", () => {
        expect(component.exists()).toBeTruthy();
    });

    it("should have a header with the event's title", () => {
        expect(
            component
                .find("h3")
                .someWhere((header) => header.text() === mockSelectedEvent.title)
        ).toBeTruthy();
    });

    it("should have a paragraph with the event's price in the correct text format and with 2 numbers after the decimal point", () => {
        expect(
            component
                .find("p")
                .someWhere((paragraph) => paragraph.text() === `Price: $${mockSelectedEvent.price.toFixed(2)}`)
        ).toBeTruthy();
    });

    it("should have a paragraph with the event's descrition when there is such for the event", () => {
        expect(
            component
                .find("p")
                .someWhere((paragraph) => paragraph.text() === mockSelectedEvent.description)
        ).toBeTruthy();
    });

    it("should have a paragraph with text No description when the event doesnt have description", () => {
        const { id, title, price, date } = mockSelectedEvent;

        component.setProps({
            selectedEvent: {                
                id,
                title,
                price,
                date          
            }           
        });

        expect(
            component
                .find("p")
                .someWhere((paragraph) => paragraph.text() === "No description")
        ).toBeTruthy();
    });
});