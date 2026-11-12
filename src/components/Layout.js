import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  return (
    <div>
      <NavBar />
      <div className="container">
        {loading ? (
          <p>Đang tải câu hỏi...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Layout;