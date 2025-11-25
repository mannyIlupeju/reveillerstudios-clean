"use client"
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function SliderPage() {
  const settings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="bg-blue-500">
          <h3>1</h3>
        </div>
        <div className="bg-red-500">
          <h3>2</h3>
        </div>
        <div className="bg-zinc-500">
          <h3>3</h3>
        </div>
        <div className="bg-orange-500">
          <h3>4</h3>
        </div>
        <div className="bg-blue-500">
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
        <div>
          <h3>7</h3>
        </div>
        <div>
          <h3>8</h3>
        </div>
        <div>
          <h3>9</h3>
        </div>
      </Slider>
    </div>
  );
}

export default SliderPage;
