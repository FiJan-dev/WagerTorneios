import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './CadastroPartida.css';

function CadastroPartida() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    nome_campeonato: '',
    time_casa: '',
    time_visitante: '',
    data_partida: '',
    hora_partida: '',
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
      !formData.hora_partida ||
      !formData.local_partida
    ) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (formData.time_casa.trim().toLowerCase() === formData.time_visitante.trim().toLowerCase()) {
      setError('Os times não podem ser iguais.');
      return;
    }

    // Validação de data da partida (combinar data e hora)
    const dataHoraPartida = new Date(`${formData.data_partida}T${formData.hora_partida}`);
    const agora = new Date();
    const umAnoNoFuturo = new Date();
    umAnoNoFuturo.setFullYear(agora.getFullYear() + 2); // Máximo 2 anos no futuro
    
    if (dataHoraPartida > umAnoNoFuturo) {
      setError('A data da partida não pode ser superior a 2 anos no futuro.');
      return;
    }



    setLoading(true);
    // Validação específica quando há campeonato selecionado
    if (selectedCampeonato) {
      const dataPartida = new Date(`${formData.data_partida}T${formData.hora_partida}`);
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
      // Combinar data e hora para enviar ao backend
      const dataHoraCompleta = `${formData.data_partida}T${formData.hora_partida}`;
      
      const payload = { 
        ...formData, 
        data_partida: dataHoraCompleta 
      };
      
      // Remover o campo hora_partida do payload (não existe no backend)
      delete payload.hora_partida;
      
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
    <div className="partida-cadastro-page">
      <SideBar_Olheiro />
      
      <div className="cadastro-container-partida">
        <div className="page-header-partida">
          <h1>Cadastrar Partida</h1>
          <p>Registre uma nova partida com todos os detalhes</p>
        </div>

        <div className="cadastro-card-partida">
          {error && (
            <div className="error-message">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="partida-form">
            <div className="form-section-partida">
              <h2 className="section-title-partida">Campeonato</h2>
              
              <div className="form-group-partida">
                <label htmlFor="nome_campeonato">
                  Nome do Campeonato <span className="required">*</span>
                </label>
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="nome_campeonato"
                    name="nome_campeonato"
                    className="form-input-partida"
                    value={formData.nome_campeonato}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite para buscar ou selecionar um campeonato..."
                    required
                  />
                  
                  {showDropdown && (
                    <div className="campeonato-dropdown">
                      {filteredCampeonatos.length === 0 ? (
                        <div className="dropdown-empty">
                          {formData.nome_campeonato.trim() ? 'Nenhum campeonato encontrado' : 'Carregando campeonatos...'}
                        </div>
                      ) : (
                        <>
                          <div className="dropdown-header">
                            {filteredCampeonatos.length} campeonato{filteredCampeonatos.length !== 1 ? 's' : ''} encontrado{filteredCampeonatos.length !== 1 ? 's' : ''}
                          </div>
                          {filteredCampeonatos.map((campeonato, index) => (
                            <div
                              key={campeonato.id_campeonato}
                              onClick={() => handleSelectCampeonato(campeonato)}
                              className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                            >
                              <div className="dropdown-item-title">{campeonato.nome_campeonato}</div>
                              <div className="dropdown-item-info">
                                📍 {campeonato.local_campeonato} • 📅 {new Date(campeonato.data_inicio).toLocaleDateString('pt-BR')} - {new Date(campeonato.data_fim).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          ))}
                          {formData.nome_campeonato.trim() && !filteredCampeonatos.some(c => c.nome_campeonato.toLowerCase() === formData.nome_campeonato.toLowerCase()) && (
                            <div className="dropdown-new-campeonato">
                              💡 Novo campeonato será criado: "{formData.nome_campeonato}"
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedCampeonato && (
                  <div className="selected-campeonato">
                    <div className="selected-campeonato-title">
                      ✅ Campeonato selecionado
                    </div>
                    <div className="selected-campeonato-name">
                      {selectedCampeonato.nome_campeonato}
                    </div>
                    <div className="selected-campeonato-details">
                      📍 {selectedCampeonato.local_campeonato}<br/>
                      📅 {new Date(selectedCampeonato.data_inicio).toLocaleDateString('pt-BR')} - {new Date(selectedCampeonato.data_fim).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section-partida">
              <h2 className="section-title-partida">Times</h2>
              
              <div className="times-grid">
                <div className="form-group-partida">
                  <label htmlFor="time_casa">
                    Time Casa <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="time_casa"
                    name="time_casa"
                    className="form-input-partida"
                    value={formData.time_casa}
                    onChange={handleChange}
                    placeholder="Nome do time da casa"
                    required
                  />
                </div>

                <div className="form-group-partida">
                  <label htmlFor="time_visitante">
                    Time Visitante <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="time_visitante"
                    name="time_visitante"
                    className="form-input-partida"
                    value={formData.time_visitante}
                    onChange={handleChange}
                    placeholder="Nome do time visitante"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section-partida">
              <h2 className="section-title-partida">Detalhes da Partida</h2>
              
              <div className="datetime-grid">
                <div className="form-group-partida">
                  <label htmlFor="data_partida">
                    Data <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="data_partida"
                    name="data_partida"
                    className="form-input-partida"
                    value={formData.data_partida}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-partida">
                  <label htmlFor="hora_partida">
                    Hora <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    id="hora_partida"
                    name="hora_partida"
                    className="form-input-partida"
                    value={formData.hora_partida}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group-partida">
                <label htmlFor="local_partida">
                  Local <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="local_partida"
                  name="local_partida"
                  className="form-input-partida"
                  value={formData.local_partida}
                  onChange={handleChange}
                  placeholder="Ex: Estádio Nacional, Arena da Baixada..."
                  required
                />
              </div>
            </div>

            <div className="form-actions-partida">
              <button
                type="button"
                className="btn-cancel-partida"
                onClick={() => navigate('/cadastropartidalista')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit-partida"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Partida'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroPartida;
