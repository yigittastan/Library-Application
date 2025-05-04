import React from "react";
// import CardSlider from "./SliderCard";

export default function Home() {
    return (
        <div>
            <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" /><button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
            {/* Ürün listesi */}
            {/* <div className="container mt-5">
                <CardSlider products={products} />
            </div> */}
        </div>
    )
}