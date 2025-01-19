import React from 'react';
import Header from './Header';
import NavbarHorizontal from './NavbarHorizontal';
import NavbarVertical from './NavbarVertical';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CSS/layout.css';

const Layout = () => {
  const user = useSelector((state) => state.auth.user); // Get current user from Redux

  return (
    <div id="layout">
      <Header />
      <NavbarHorizontal />
      <div id="main-content">
        <div id="sidebar">
          {/* Pass user role to NavbarVertical */}
          <NavbarVertical isAdmin={user?.admin} />
        </div>
        <div id="content">
          <Outlet /> {/* Dynamic content based on routes */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
