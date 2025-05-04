import React from "react";

export default function Slider() {
    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-label="Slide 1" />
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2" />
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3" />
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="../../assets/images/slider1.jpg" className="d-block w-100" alt="Slide 1" />
                </div>
                <div className="carousel-item">
                    <img src="../../assets/images/slider2.jpg" className="d-block w-100" alt="Slide 2" />
                </div>
                <div className="carousel-item">
                    <img src="../../assets/images/slider3.jpg" className="d-block w-100" alt="Slide 3" />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Önceki</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Sonraki</span>
            </button>
        </div>
    );
}
