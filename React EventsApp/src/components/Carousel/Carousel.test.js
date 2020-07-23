import React from 'react';

import { shallow } from 'enzyme';

import Carousel from 'react-bootstrap/Carousel'
import ImageCarousel from "./Carousel";
import defaultImage from "../../resources/noimagefound.jpg";

describe("<Carousel/>", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ImageCarousel/>);
    });

    const defaultItem = (
        <Carousel.Item key="default">
            <img className="carouselImage d-block w-100" src={defaultImage} alt="EventImage"/>
        </Carousel.Item>
    );
    
    it("should display only default image when no images are passed as props", () => {
        expect(wrapper.find(Carousel.Item)).toHaveLength(1);
        expect(wrapper.contains(defaultItem)).toEqual(true);        
    });

    it("should have as many carousel items as number of images passed as props", () => {
        const imagesSrcs = ["1", "2"];
        wrapper.setProps({ images: imagesSrcs });

        expect(wrapper.find(Carousel.Item)).toHaveLength(imagesSrcs.length);

        expect(wrapper.contains(
            <Carousel.Item key={0}>
                <img className="carouselImage d-block w-100" src={imagesSrcs[0]} alt="EventImage"/>
            </Carousel.Item> 
        )).toEqual(true);

        expect(wrapper.contains(
            <Carousel.Item key={1}>
                <img className="carouselImage d-block w-100" src={imagesSrcs[1]} alt="EventImage"/>
            </Carousel.Item> 
        )).toEqual(true);
    })
});