import { useState } from 'react';

export default function ChampionshipRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campeonato cadastrado:', formData);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-md w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              Logo
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
            Cadastro de Campeonato
          </h1>
          <p className="text-center text-gray-300 text-base mb-6">
            Preencha os detalhes para criar um novo campeonato
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
            <input
              id="name"
              type="text"
              placeholder="Digite o nome do campeonato"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <textarea
              id="description"
              placeholder="Descreva o campeonato"
              value={formData.description}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md resize-none"
              rows="4"
            />
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <input
              id="location"
              type="text"
              placeholder="Digite o local do campeonato"
              value={formData.location}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full max-w-md text-center"
            >
              Cadastrar Campeonato
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}