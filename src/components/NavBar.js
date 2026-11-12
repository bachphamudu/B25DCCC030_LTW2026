import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const getLinkStyle = ({ isActive }) => ({
    marginRight: '16px',
    textDecoration: 'none',
    color: isActive ? 'orange' : '#333',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <nav style={{ padding: '12px 20px', borderBottom: '1px solid #ccc', marginBottom: '16px' }}>
      <NavLink to="/" end style={getLinkStyle}>
        Trang chủ
      </NavLink>
      <NavLink to="/questions" style={getLinkStyle}>
        Ngân hàng câu hỏi
      </NavLink>
      <NavLink to="/history" style={getLinkStyle}>
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;