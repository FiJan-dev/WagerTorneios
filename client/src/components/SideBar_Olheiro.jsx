import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdGroup } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { RiGroupFill } from "react-icons/ri";
import { BsDoorOpenFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';
import './SideBar_Olheiro.css';

function SideBar_Olheiro() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainItems = useMemo(() => [
    { id: 'dashboard', label: 'Jogadores', icon: <FaUsers />, path: '/jogadores' },
    { id: 'cadastrocampeonatolista', label: 'Campeonatos', icon: <MdGroup />, path: '/cadastrocampeonatolista' },
    { id: 'cadastropartidalista', label: 'Partidas', icon: <RiGroupFill />, path: '/cadastropartidalista' },
  ], []);

  const bottomItems = useMemo(() => [
    { id: 'olheiropropfile', label: 'Perfil', icon: <CgProfile />, path: '/olheiropropfile' },
    { id: 'logout', label: 'Logout', icon: <BsDoorOpenFill />, path: '/login' },
  ], []);

  const { logout } = useContext(AuthContext);

  // Determine active item directly from current path without state
  const getActiveItem = () => {
    const currentPath = location.pathname;
    
    // Check for exact matches first
    const allItems = [...mainItems, ...bottomItems];
    const active = allItems.find(item => item.path === currentPath);
    if (active) return active.id;
    
    // Handle sub-routes
    if (currentPath === '/cadastrocampeonato') return 'cadastrocampeonatolista';
    if (currentPath === '/cadastrojogador') return 'dashboard';
    if (currentPath === '/cadastropartida') return 'cadastropartidalista';
    
    return '';
  };

  const activeItem = getActiveItem();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`topbar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="topbar-logo">
        <div className="logo-icon">W</div>
        {!isCollapsed && <span className="logo-text">WagerTorneios</span>}
      </div>

      {/* Main Navigation */}
      <div className="topbar-nav">
        {mainItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="topbar-actions">
        <div className="action-group">
          {bottomItems.map(item => (
            item.id === 'logout' ? (
              <button
                key={item.id}
                type="button"
                onClick={() => logout()}
                className="action-btn logout-btn"
              >
                <span className="action-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.path}
                className={`action-btn ${activeItem === item.id ? 'active' : ''}`}
              >
                <span className="action-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </div>

        <div className="topbar-divider"></div>

        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expandir' : 'Recolher'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
    </nav>
  );
}

export default SideBar_Olheiro;