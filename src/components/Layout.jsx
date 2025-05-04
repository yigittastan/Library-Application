import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  // Sayfa başlığını belirle
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Anasayfa';
      case '/library': return 'Kitaplığım';
      case '/products': return 'Ürünler';
      case '/categories': return 'Ürün Kategorisi';
      case '/writers': return 'Yazarlar';
      case '/settings': return 'Ayarlar';
      case '/feedback': return 'Geri Bildirim';
      default: return 'Sayfa Bulunamadı';
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sol Panel */}
        <div className="col-md-3 bg-light border-end p-4 d-flex flex-column justify-content-between">
          <div>
            <h4 className="mb-4">Menü</h4>
            <div className="list-group">
              <NavLink 
                to="/" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Anasayfa
              </NavLink>
              <NavLink 
                to="/library" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Kitaplığım
              </NavLink>
              <NavLink 
                to="/products" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Ürünler
              </NavLink>
              <NavLink 
                to="/categories" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Ürün Kategorisi
              </NavLink>
              <NavLink 
                to="/writers" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Yazarlar
              </NavLink>
            </div>
          </div>
          <div className="mt-5">
            <h5 className="mb-3">Diğer</h5>
            <div className="list-group">
              <NavLink 
                to="/settings" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Ayarlar
              </NavLink>
              <NavLink 
                to="/feedback" 
                className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
              >
                Geri Bildirim
              </NavLink>
            </div>
          </div>
        </div>
        
        {/* Sağ Panel */}
        <div className="col-md-9 p-4 overflow-auto">
          <div className="mb-4">
            <h2>{getPageTitle()}</h2>
            <hr />
          </div>
          <Outlet /> {/* Burada Outlet bileşeni sağ panelde dinamik içerik yükler */}
        </div>
      </div>
    </div>
  );
}
