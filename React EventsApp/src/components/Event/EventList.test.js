import React from 'react';

import { shallow } from 'enzyme';

import EventsList from "./EventsList";

describe("<EventsList />", () => {
    it("expect to match snapshot", () => {
        const mockEvents = [
            {
                id: "1",
                creator: "Pesho",
                date: "2020-09-10T17:00:00.000",
                description: "Test description",
                price: 1,
                title: "Mock Event"
            },
            {
                id: "2",
                creator: "Mitko",
                date: "2020-10-12T17:00:00.000",
                description: "Long text here",
                price: 1,
                title: "Mocker"
            }
        ];

        expect(
            shallow(
                <EventsList
                    events={mockEvents}
                    onSetSelectedEventHandler={() => {}}
                />
            )
        ).toMatchSnapshot();
    });
});
