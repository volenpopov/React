import React from 'react';

import { shallow } from 'enzyme';

import Carousel from 'react-bootstrap/Carousel'
import ImageCarousel from "./Carousel";
import defaultImage from "../../resources/noimagefound.jpg";

describe("<Carousel/>", () => {
    let component;

    beforeEach(() => {
        component = shallow(<ImageCarousel/>);
    });

    it("should render", () => {
        expect(component.exists()).toBeTruthy();
    });
    
    it("should display only default image when no images are passed as props", () => {
        expect(component.find(Carousel)).toHaveLength(1);
        expect(component.find(Carousel.Item)).toHaveLength(1);

        expect(
            component
                .find(Carousel.Item)
                .someWhere(carouselItem => carouselItem.key() === "default"
                    && carouselItem.children().first().hasClass("carouselImage")
                    && carouselItem.children().first().props().src === defaultImage)
        ).toEqual(true);        
    });

    it("should have as many carousel items as number of images passed as props and parse them properly", () => {
        const firstImageSrc = "1";
        const secondImageSrc = "2";

        const imagesSrcs = [firstImageSrc, secondImageSrc];

        component.setProps({ images: imagesSrcs });

        expect(component.find(Carousel)).toHaveLength(1);
        expect(component.find(Carousel.Item)).toHaveLength(imagesSrcs.length);

        expect(
            component
                .find(Carousel.Item)
                .filterWhere(carouselItem => carouselItem.key() === imagesSrcs.indexOf(firstImageSrc).toString()
                    && carouselItem.children().first().hasClass("carouselImage")
                    && carouselItem.children().first().props().src === firstImageSrc)
        ).toHaveLength(1);
        
        expect(
            component
                .find(Carousel.Item)
                .filterWhere(carouselItem => carouselItem.key() === imagesSrcs.indexOf(secondImageSrc).toString()
                    && carouselItem.children().first().hasClass("carouselImage")
                    && carouselItem.children().first().props().src === secondImageSrc)
        ).toHaveLength(1);  
    })
});