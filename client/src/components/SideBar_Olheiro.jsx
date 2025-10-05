import React, { useState } from 'react';
import './SideBar.css';
import { MdGroup } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { RiGroupFill } from "react-icons/ri";
import { BsDoorOpenFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const mainItems = [
    { id: 'dashboard', label: 'Inicio', icon: <FaHouse /> },
    { id: 'times', label: 'Times Observados', icon: <MdGroup /> },
    { id: 'jogadores', label: 'Jogadores Observados', icon: <RiGroupFill /> },
  ];

  const bottomItems = [
    { id: 'profile', label: 'Perfil', icon: <CgProfile /> },
    { id: 'logout', label: 'Logout', icon: <BsDoorOpenFill /> },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          {!isCollapsed && <div className="logo">S</div>}
          <button className="toggle-button" onClick={toggleSidebar}>
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="nav-container">
          <ul className="nav-list">
            {mainItems.map(item => (
              <li
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <ul className="nav-list bottom-nav">
            {bottomItems.map(item => (
              <li
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default SideBar_Olheiro;