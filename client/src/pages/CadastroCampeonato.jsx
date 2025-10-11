import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function ChampionshipRegistrationPage() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'http://localhost:5000/api/campeonato/criarC';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { name, startDate, endDate, location } = formData;

    if (!name || !startDate || !endDate || !location) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    const dtInicio = new Date(startDate);
    const dtFim = new Date(endDate);
    if (isNaN(dtInicio.getTime()) || isNaN(dtFim.getTime())) {
      alert('Datas inválidas.');
      return;
    }
    if (dtInicio >= dtFim) {
      alert('A data de início deve ser anterior à data de fim.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        nome_campeonato: name,
        data_inicio: startDate,
        data_fim: endDate,
        local_campeonato: location,
      };

      await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Campeonato cadastrado com sucesso!');
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.statusText ||
        err?.message ||
        'Erro ao cadastrar campeonato.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-black'>
      <SideBar_Olheiro />
      <div className='flex justify-center items-center min-h-screen w-full p-4 box-border'>
        <div className='bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-md w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
          <div className='mb-6 flex justify-center'>
            <div className='w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md'>
              C
            </div>
          </div>
          <h1 className='text-2xl sm:text-3xl text-center font-bold text-white mb-2'>
            Cadastro de Campeonato
          </h1>
          <p className='text-center text-gray-300 text-base mb-6'>
            Preencha os detalhes para criar um novo campeonato
          </p>

          <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4'>
            <input
              id='name'
              type='text'
              placeholder='Nome do campeonato'
              value={formData.name}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md'
            />
            <textarea
              id='description'
              placeholder='Descrição (opcional)'
              value={formData.description}
              onChange={handleChange}
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md resize-none'
              rows='3'
            />
            <input
              id='startDate'
              type='date'
              value={formData.startDate}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md'
            />
            <input
              id='endDate'
              type='date'
              value={formData.endDate}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md'
            />
            <input
              id='location'
              type='text'
              placeholder='Local do campeonato'
              value={formData.location}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md'
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full max-w-md text-center'
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Campeonato'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}