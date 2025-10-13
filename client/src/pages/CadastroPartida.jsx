import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

function CadastroPartida() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
  const [campeonatos, setCampeonatos] = useState([]);
  const [filteredCampeonatos, setFilteredCampeonatos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Faça login para continuar.');
      return;
    }

    // validações rápidas no front
    if (
      !formData.nome_campeonato ||
      !formData.time_casa ||
      !formData.time_visitante ||
      !formData.data_partida ||
      !formData.local_partida
    ) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (formData.time_casa.trim().toLowerCase() === formData.time_visitante.trim().toLowerCase()) {
      setError('Os times não podem ser iguais.');
      return;
    }

    // Validação de data da partida
    const dataPartida = new Date(formData.data_partida);
    const agora = new Date();
    const umAnoNoFuturo = new Date();
    umAnoNoFuturo.setFullYear(agora.getFullYear() + 2); // Máximo 2 anos no futuro
    
    if (dataPartida > umAnoNoFuturo) {
      setError('A data da partida não pode ser superior a 2 anos no futuro.');
      return;
    }



    setLoading(true);
    // Validação específica quando há campeonato selecionado
    if (selectedCampeonato) {
      const dataPartida = new Date(formData.data_partida);
      const dataInicio = new Date(selectedCampeonato.data_inicio + 'T00:00:00');
      const dataFim = new Date(selectedCampeonato.data_fim + 'T23:59:59');
      
      if (dataPartida < dataInicio || dataPartida > dataFim) {
        const inicioFormatado = dataInicio.toLocaleDateString('pt-BR');
        const fimFormatado = dataFim.toLocaleDateString('pt-BR');
        setError(`A data da partida deve estar entre ${inicioFormatado} e ${fimFormatado} (período do campeonato "${selectedCampeonato.nome_campeonato}").`);
        return;
      }
    }

    try {
      const payload = { ...formData };
      if (selectedCampeonato) {
        payload.id_campeonato = selectedCampeonato.id_campeonato;
      }

      const response = await axios.post(
        'http://localhost:5000/api/partida/registrarP',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const body = response?.data;

      // Bloqueio "suave" do back
      if (body && typeof body === 'object' && body.ok === false) {
        setError(body.msg || 'Acesso não permitido.');
        return;
      }

      // Sucesso normal
      alert('Partida registrada com sucesso!');
      navigate('/cadastropartidalista');
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.msg ||
        data?.error ||
        (Array.isArray(data) ? data.join('; ') : null) ||
        err?.message ||
        'Erro ao registrar partida.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Carregar campeonatos quando o componente monta
  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/campeonato/listarC', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const payload = response?.data;
        const campanhasList = Array.isArray(payload) ? payload : [];
        setCampeonatos(campanhasList);
        setFilteredCampeonatos(campanhasList);
      } catch (err) {
        console.error('Erro ao carregar campeonatos:', err);
      }
    };

    if (token) {
      fetchCampeonatos();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Filtrar campeonatos quando digitar no campo nome_campeonato
    if (name === 'nome_campeonato') {
      // Limpar seleção se o usuário modificou o texto manualmente
      if (selectedCampeonato && value !== selectedCampeonato.nome_campeonato) {
        setSelectedCampeonato(null);
      }
      
      const filtered = campeonatos.filter(c => 
        c.nome_campeonato.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCampeonatos(filtered);
      setShowDropdown(value.trim() !== '');
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredCampeonatos.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCampeonatos.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCampeonatos.length) {
          handleSelectCampeonato(filteredCampeonatos[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectCampeonato = (campeonato) => {
    setSelectedCampeonato(campeonato);
    setFormData(prev => ({ ...prev, nome_campeonato: campeonato.nome_campeonato }));
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    if (formData.nome_campeonato.trim() !== '') {
      setShowDropdown(true);
    } else {
      setFilteredCampeonatos(campeonatos);
      setShowDropdown(true);
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <div className='flex min-h-screen bg-black'>
      <SideBar_Olheiro />
      <div className='flex justify-center items-center min-h-screen w-full p-4 box-border'>
        <div className='bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl w-full'>
          <h2 className='text-2xl sm:text-3xl text-center font-bold text-white mb-2'>
            Cadastrar Partida
          </h2>
          {error && <p className='text-center text-red-400 text-sm'>{error}</p>}

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Nome do Campeonato</label>
              <div ref={dropdownRef} className='relative'>
                <input
                  type='text'
                  name='nome_campeonato'
                  value={formData.nome_campeonato}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  required
                  placeholder='Digite para buscar ou selecionar um campeonato...'
                  className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
                />
                
                {showDropdown && (
                  <div className='absolute z-50 w-full mt-1 bg-black border border-green-700 rounded-lg shadow-xl max-h-60 overflow-y-auto'>
                    {filteredCampeonatos.length === 0 ? (
                      <div className='px-4 py-3 text-gray-400 text-sm'>
                        {formData.nome_campeonato.trim() ? 'Nenhum campeonato encontrado' : 'Carregando campeonatos...'}
                      </div>
                    ) : (
                      <>
                        <div className='px-4 py-2 text-xs text-gray-400 border-b border-green-700/30 bg-green-900/20'>
                          {filteredCampeonatos.length} campeonato{filteredCampeonatos.length !== 1 ? 's' : ''} encontrado{filteredCampeonatos.length !== 1 ? 's' : ''}
                        </div>
                        {filteredCampeonatos.map((campeonato, index) => (
                          <div
                            key={campeonato.id_campeonato}
                            onClick={() => handleSelectCampeonato(campeonato)}
                            className={`px-4 py-3 cursor-pointer border-b border-green-700/10 last:border-b-0 transition-colors duration-200 ${
                              index === selectedIndex 
                                ? 'bg-green-700/30 border-green-500' 
                                : 'hover:bg-green-700/20'
                            }`}
                          >
                            <div className='flex flex-col'>
                              <span className='text-gray-100 font-medium'>{campeonato.nome_campeonato}</span>
                              <span className='text-gray-400 text-xs mt-1'>
                                📍 {campeonato.local_campeonato} • 📅 {new Date(campeonato.data_inicio).toLocaleDateString('pt-BR')} - {new Date(campeonato.data_fim).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {formData.nome_campeonato.trim() && !filteredCampeonatos.some(c => c.nome_campeonato.toLowerCase() === formData.nome_campeonato.toLowerCase()) && (
                          <div className='px-4 py-3 border-t border-green-700/30 bg-blue-900/20'>
                            <div className='text-blue-400 text-sm'>
                              💡 Novo campeonato será criado: "{formData.nome_campeonato}"
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {selectedCampeonato && (
                <div className='mt-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg'>
                  <div className='text-green-400 text-sm font-medium mb-1'>
                    ✅ Campeonato selecionado:
                  </div>
                  <div className='text-gray-300 text-sm'>
                    <strong>{selectedCampeonato.nome_campeonato}</strong>
                  </div>
                  <div className='text-gray-400 text-xs mt-1'>
                    📍 {selectedCampeonato.local_campeonato}<br/>
                    📅 {new Date(selectedCampeonato.data_inicio).toLocaleDateString('pt-BR')} - {new Date(selectedCampeonato.data_fim).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )}
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
