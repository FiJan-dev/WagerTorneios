import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function CadastroPartida() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nome_campeonato: '',
    time_casa: '',
    time_visitante: '',
    data_partida: '',
    local_partida: '',
    placar_casa: 0,
    placar_visitante: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/partida/registrarP',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Partida registrada com sucesso!');
      setFormData({
        nome_campeonato: '',
        time_casa: '',
        time_visitante: '',
        data_partida: '',
        local_partida: '',
        placar_casa: 0,
        placar_visitante: 0,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.msg ||
        'Erro ao registrar partida.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-black'>
      <div className='bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full'>
        <h2 className='text-2xl sm:text-3xl text-center font-bold text-white mb-2'>
          Cadastrar Partida
        </h2>
        {error && <p className='text-center text-red-400 text-sm'>{error}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-gray-300'>Nome do Campeonato</label>
            <input
              type='text'
              name='nome_campeonato'
              value={formData.nome_campeonato}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-gray-300'>Time Casa</label>
            <input
              type='text'
              name='time_casa'
              value={formData.time_casa}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-gray-300'>Time Visitante</label>
            <input
              type='text'
              name='time_visitante'
              value={formData.time_visitante}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-gray-300'>Data da Partida</label>
            <input
              type='datetime-local'
              name='data_partida'
              value={formData.data_partida}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-gray-300'>Local da Partida</label>
            <input
              type='text'
              name='local_partida'
              value={formData.local_partida}
              onChange={handleChange}
              required
              className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full'
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroPartida;