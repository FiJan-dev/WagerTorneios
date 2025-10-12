import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCampeonatoId, setSelectedCampeonatoId] = useState(null);
  const [allCampeonatos, setAllCampeonatos] = useState(null);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...formData };
      // If user selected an existing campeonato, send its id as well.
      if (selectedCampeonatoId) payload.id_campeonato = selectedCampeonatoId;

      const response = await axios.post(
        'http://localhost:5000/api/partida/registrarP',
        payload,
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
      setSuggestions([]);
      setSelectedCampeonatoId(null);
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If user is typing championship name, trigger suggestions
    if (name === 'nome_campeonato') {
      setSelectedCampeonatoId(null); // typing invalidates previous selection
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const v = value.trim();
      if (!v) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      debounceRef.current = setTimeout(() => fetchCampeonatos(v), 300);
    }
  };

  const fetchCampeonatos = async (query) => {
    try {
      // Try to use cached list
      let list = allCampeonatos;
      if (!list) {
        const res = await axios.get('http://localhost:5000/api/campeonato/listarC');
        list = Array.isArray(res.data) ? res.data : [];
        setAllCampeonatos(list);
      }

      let filtered = list;
      if (query && query.trim() !== '') {
        filtered = list.filter((c) =>
          c.nome_campeonato.toLowerCase().includes(query.toLowerCase())
        );
      }

      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    } catch (err) {
      // ignore suggestion errors silently
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (campeonato) => {
    setFormData({ ...formData, nome_campeonato: campeonato.nome_campeonato });
    setSelectedCampeonatoId(campeonato.id_campeonato);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // close suggestions on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className='flex min-h-screen bg-black'>
      <SideBar_Olheiro />
      <div className='flex justify-center items-center min-h-screen w-full p-4 box-border'>
        <div className='bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full'>
          <h2 className='text-2xl sm:text-3xl text-center font-bold text-white mb-2'>
            Cadastrar Partida
          </h2>
          {error && <p className='text-center text-red-400 text-sm'>{error}</p>}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Nome do Campeonato</label>
              <div ref={wrapperRef} className='relative'>
                <input
                  type='text'
                  name='nome_campeonato'
                  value={formData.nome_campeonato}
                  onChange={handleChange}
                  required
                  onFocus={() => fetchCampeonatos('')}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowSuggestions(false);
                    if (e.key === 'Enter' && suggestions.length === 1) {
                      e.preventDefault();
                      handleSelectSuggestion(suggestions[0]);
                    }
                  }}
                  className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
                />

                {showSuggestions && suggestions.length > 0 && (
                  <ul className='absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-auto bg-black border border-green-700 rounded-md'>
                    {suggestions.map((c) => (
                      <li
                        key={c.id_campeonato}
                        onClick={() => handleSelectSuggestion(c)}
                        className='px-3 py-2 hover:bg-green-700/20 cursor-pointer text-gray-100'
                      >
                        {c.nome_campeonato}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
    </div>
  );
}

export default CadastroPartida;