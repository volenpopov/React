import React from 'react';

import { shallow } from 'enzyme';

import Modal from "./Modal";

describe("<Modal/>", () => {
    let component;

    const mockTitle = "Test";
    const mockCloseModal = jest.fn();

    const modalContainerClassname = "modalContainer";    

    beforeEach(() => {
        const mockProps = {
            title: mockTitle,
            closeModal: mockCloseModal
        };

        component = shallow(<Modal {...mockProps}/>);
    });

    it("should render", () => {
        expect(component.exists()).toBeTruthy();
    });

    it("should render the modal content inside a div with class called modalContainer", () => {
        expect(component.hasClass(modalContainerClassname)).toBeTruthy();
    });

    it("should display title in a header", () => {
        expect(
            component
                .find("h2")
                .someWhere(element => element.text() === mockTitle)
        ).toBeTruthy();
    });

    it("should always display Close button", () => {
        expect(
            component
            .find("button")
            .someWhere(btn => btn.text() === "Close")
        ).toBeTruthy();
    });

    it("should display Close button with black border when using the Modal to display an error message", () => {
        component = shallow(<Modal title="Error"/>);

        const closeButtonStyleObj = component
            .find("button")
            .filterWhere(btn => btn.text() === "Close")
            .first()
            .prop("style");

        expect(closeButtonStyleObj).toHaveProperty("border");
        expect(closeButtonStyleObj.border).toEqual(expect.stringContaining("solid black"));
    });

    it("should call closeModal on click of Close button", () => {
        component
            .find("button")
            .filterWhere(btn => btn.text() === "Close")
            .first()
            .simulate("click");

        expect(mockCloseModal).toBeCalled();
    });

    it("should render only 1 button when actionButtonText is not provided as prop", () => {
        expect(component.find("button")).toHaveLength(1);
    });

    it("should render 2 buttons when actionButtonText is passed as prop", () => {
        component = shallow(<Modal actionButtonText="someText"/>);
        expect(component.find("button")).toHaveLength(2);
    });

    it("should render a button with text equal to actionButtonText when actionButtonText is provided as prop", () => {
        const mockActionButtonText = "someText";

        component = shallow(<Modal actionButtonText={mockActionButtonText}/>);
        expect(
            component
                .find("button")
                .someWhere(btn => btn.text() === mockActionButtonText)
        ).toBeTruthy();        
    });

    it("should render a disabled action button when the user is not authenticated", () => {
        const mockActionButtonText = "someText";

        component = shallow(<Modal authenticated={false} actionButtonText={mockActionButtonText}/>);

        expect(
            component
                .find("button")
                .filterWhere(btn => btn.text() === mockActionButtonText)
                .first()
                .props()
        ).toHaveProperty("disabled", true);
    });

    it("should render a disabled action button when the actionButtonText is equal to Booked", () => {
        const mockActionButtonText = "Booked";

        component = shallow(<Modal authenticated actionButtonText={mockActionButtonText}/>);

        expect(
            component
                .find("button")
                .filterWhere(btn => btn.text() === mockActionButtonText)
                .first()
                .props()
        ).toHaveProperty("disabled", true);
    });

    it("should call onFormSubmit when the active action button is clicked", () => {
        const mockActionButtonText = "someText";
        const mockOnFormSubmit = jest.fn();

        component = shallow(
            <Modal
                authenticated
                actionButtonText={mockActionButtonText}
                onFormSubmit={mockOnFormSubmit}
            />
        );

        component
            .find("button")
            .filterWhere(btn => btn.text() === mockActionButtonText)
            .first()
            .simulate("click");

        expect(mockOnFormSubmit).toBeCalled();
    });

    it("should render a header with class error when the title is equal to Error", () => {
        component = shallow(<Modal title="Error"/>);

        expect(
            component
                .find("h2")
                .filterWhere(header => header.text() === "Error")
                .first()
                .hasClass("error")
        ).toBeTruthy();
    });
});
