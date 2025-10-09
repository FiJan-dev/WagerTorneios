import React, { useState } from 'react';
import { MdGroup } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { RiGroupFill } from "react-icons/ri";
import { BsDoorOpenFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

function SideBar_Olheiro() {
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
    <nav className={`bg-black/90 backdrop-blur-sm border-r border-green-700 h-screen flex flex-col fixed top-0 left-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} z-50`}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
            S
          </div>
        )}
        <button
          className="text-white text-lg font-bold hover:text-green-500 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <ul className="flex flex-col gap-2 p-4">
          {mainItems.map(item => (
            <li
              key={item.id}
              className={`flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer transition-all duration-200 ${activeItem === item.id ? 'bg-green-700 text-white' : ''}`}
              onClick={() => setActiveItem(item.id)}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2 p-4">
          {bottomItems.map(item => (
            <li
              key={item.id}
              className={`flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:bg-green-700/50 hover:text-white cursor-pointer transition-all duration-200 ${activeItem === item.id ? 'bg-green-700 text-white' : ''}`}
              onClick={() => setActiveItem(item.id)}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SideBar_Olheiro;