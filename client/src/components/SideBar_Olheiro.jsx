import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdGroup } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { RiGroupFill } from "react-icons/ri";
import { BsDoorOpenFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';

function SideBar_Olheiro() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainItems = useMemo(() => [
    { id: 'dashboard', label: 'Jogadores', icon: <FaUsers />, path: '/dashboard' },
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
    <nav className={`bg-black/90 backdrop-blur-sm border-b border-green-700 w-full flex flex-row items-center justify-between px-4 py-2 fixed top-0 left-0 transition-all duration-300 z-50`}>
      <div className="flex items-center gap-4">
        {!isCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md">
            S
          </div>
        )}
        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
          {mainItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer ${activeItem === item.id ? 'bg-green-600 text-white font-bold border-b-2 border-green-400' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          {bottomItems.map(item => (
            item.id === 'logout' ? (
              <button
                key={item.id}
                type="button"
                onClick={() => logout()}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer ${activeItem === item.id ? 'bg-green-600 text-white font-bold border-b-2 border-green-400' : ''}`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer ${activeItem === item.id ? 'bg-green-600 text-white font-bold border-b-2 border-green-400' : ''}`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          ))}
        </div>
        <button
          className="text-white text-lg font-bold hover:text-green-500 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
    </nav>
  );
}

export default SideBar_Olheiro;