import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdGroup } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { RiGroupFill } from "react-icons/ri";
import { BsDoorOpenFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

function SideBar_Olheiro() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const mainItems = [
    { id: 'dashboard', label: 'Inicio', icon: <FaHouse />, path: '/dashboard' },
    { id: 'cadastrocampeonatolista', label: 'Campeonatos', icon: <MdGroup />, path: '/cadastrocampeonatolista' },
    { id: 'cadastropartidalista', label: 'Partidas', icon: <RiGroupFill />, path: '/cadastropartidalista' },
  ];

  const bottomItems = [
    { id: 'playerprofile', label: 'Perfil', icon: <CgProfile />, path: '/playerprofile' },
    { id: 'logout', label: 'Logout', icon: <BsDoorOpenFill />, path: '/login' },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const allItems = [...mainItems, ...bottomItems];
    const active = allItems.find(item => item.path === currentPath);
    if (active) {
      setActiveItem(active.id);
    } else {
      setActiveItem('dashboard'); // Default to dashboard if no match
    }
  }, [location]);

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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer transition-all duration-200 ${activeItem === item.id ? 'bg-green-600 text-white font-bold border-b-2 border-green-400' : ''}`}
              onClick={() => setActiveItem(item.id)}
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
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer transition-all duration-200 ${activeItem === item.id ? 'bg-green-600 text-white font-bold border-b-2 border-green-400' : ''}`}
              onClick={() => setActiveItem(item.id)}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
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