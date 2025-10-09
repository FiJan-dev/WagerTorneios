import React, { useState } from 'react';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function CadastroCamp() {
  const [formData, setFormData] = useState({
    championship: '',
    team1: '',
    team2: '',
    date: '',
    time: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (Object.values(formData).every((value) => value.trim() !== '')) {
      setIsSubmitting(true);
      setTimeout(() => {
        alert('Partida Registrada com Sucesso!');
        setFormData({ championship: '', team1: '', team2: '', date: '', time: '', location: '' });
        setIsSubmitting(false);
      }, 1000);
    } else {
      alert('Preencha todos os campos.');
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-md w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              M
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
            Registrar uma partida
          </h1>
          <p className="text-center text-gray-300 text-base mb-6">
            Coloque todas as informações
          </p>
          <div className="w-full flex flex-col items-center gap-4">
            <input
              type="text"
              name="championship"
              value={formData.championship}
              onChange={handleInputChange}
              placeholder="Nome do Campeonato"
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              type="text"
              name="team1"
              value={formData.team1}
              onChange={handleInputChange}
              placeholder="Time 1"
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              type="text"
              name="team2"
              value={formData.team2}
              onChange={handleInputChange}
              placeholder="Time 2"
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Localização da Partida"
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full max-w-md text-center"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Partida'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}