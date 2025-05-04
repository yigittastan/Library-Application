import React from 'react';

const CardSlider = ({ products }) => {
  return (
    <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {products.map((product, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <div className="d-flex justify-content-center">
              <div className="card mx-2" style={{ width: '18rem' }}>
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <a href={product.link} className="btn btn-primary">Detay</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sol buton */}
      <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Önceki</span>
      </button>

      {/* Sağ buton */}
      <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Sonraki</span>
      </button>
    </div>
  );
};

export default CardSlider;
