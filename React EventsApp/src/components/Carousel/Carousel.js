import React from "react";

import Carousel from 'react-bootstrap/Carousel'
import defaultImage from "../../resources/noimagefound.jpg";

import "./Carousel.css";

const ImageCarousel = props => {
    const carouselItems = props.images
        ? props.images
            .map((image, index) => (
                <Carousel.Item key={index}>
                    <img className="carouselImage d-block w-100" src={image} alt="EventImage"/>
                </Carousel.Item> 
            ))
        : <Carousel.Item key="default">
            <img className="carouselImage d-block w-100" src={defaultImage} alt="EventImage"/>
        </Carousel.Item>
    
    return (
        <Carousel>
            {carouselItems}
        </Carousel>
    );
}

export default ImageCarousel;