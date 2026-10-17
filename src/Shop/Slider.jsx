import ScuroImg from "./scuro.img/scuro_1_2.jpg"
import React, { useRef } from "react";
import Card from "./Card";

function Slider(prop) {
    const sliderRef = useRef(null);

    function scrollLeft() {
        sliderRef.current.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    }

    function scrollRight() {
        sliderRef.current.scrollBy({
            left: 300,
            behavior: "smooth"
        });
    }

    return (
        <>
            <div className="category-container">
            <h1 className="text" style={{marginLeft : 10}}>{prop.CategoryName}</h1>
                <div className="slider">
                    <button className="nav-btn" id="left-btn"> &#10094; </button>
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <Card img={ScuroImg} name="Scuro" chapter="3" />
                    <button className="nav-btn" id="right-btn"> &#10095; </button>
                </div>
            </div>
        </>
    );
}

export default Slider