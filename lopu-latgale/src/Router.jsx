// src/Router.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Team from './components/Team';
import TeamHome from './components/TeamHome';
import Uzdevumi from './components/Uzdevumi';
import Karte from './components/Karte';
import { useCookies } from 'react-cookie';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [cookies] = useCookies(['team']);
  const location = useLocation();
  const teamPath = location.pathname.split('/')[1];

  if (cookies.team !== teamPath) {
    return <Navigate to={`/${cookies.team}`} />;
  }

  return <Component />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Beka_Beha" element={<ProtectedRoute element={TeamHome} />} />
        <Route path="/Karla_Kariete" element={<ProtectedRoute element={TeamHome} />} />
        <Route path="/Ievas_Jetta" element={<ProtectedRoute element={TeamHome} />} />
        <Route path="/Beka_Beha/uzdevumi" element={<ProtectedRoute element={Uzdevumi} />} />
        <Route path="/Karla_Kariete/uzdevumi" element={<ProtectedRoute element={Uzdevumi} />} />
        <Route path="/Ievas_Jetta/uzdevumi" element={<ProtectedRoute element={Uzdevumi} />} />
        <Route path="/Beka_Beha/karte" element={<ProtectedRoute element={Karte} />} />
        <Route path="/Karla_Kariete/karte" element={<ProtectedRoute element={Karte} />} />
        <Route path="/Ievas_Jetta/karte" element={<ProtectedRoute element={Karte} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
