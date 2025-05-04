import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center mt-5">
      <h3>404 - Sayfa Bulunamadı</h3>
      <p className="mt-3">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link to="/" className="btn btn-primary mt-2">
        Anasayfaya Dön
      </Link>
    </div>
  );
}