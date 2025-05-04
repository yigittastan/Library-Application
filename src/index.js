import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Library from './pages/Library/Library';
import Products from './pages/Products/Products';
import Categories from './pages/Categories/Categories';
import Writers from './pages/Writers/Writers';
import Settings from './pages/Settings/Settings';
import Feedback from './pages/Feedback/Feedback';
import NotFound from './pages/NotFound/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default page - Ana sayfa */}
          <Route index element={<Home />} />
          {/* /home yönlendirmesini doğrudan / yönlendiriyoruz */}
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="library" element={<Library />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="writers" element={<Writers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="feedback" element={<Feedback />} />
          {/* Bulunamayan sayfalar için NotFound component */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
