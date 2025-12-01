// src/pages/PlayerList.jsx
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './PlayerList.css';
import { FiList } from 'react-icons/fi'; // Ícone de shortlist

export default function PlayerList() {
  const { token, isAdmin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [playerComment, setPlayerComment] = useState('');
  const [playerComments, setPlayerComments] = useState([]);
  const [isSendingComment, setIsSendingComment] = useState(false);
  
  // Comparison states
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    nome: '',
    posicao: '',
    time: '',
    idadeMin: '',
    idadeMax: '',
    alturaMin: '',
    alturaMax: '',
    pesoMin: '',
    pesoMax: ''
  });

  const API_URL = 'http://localhost:5000/api/jogador/listar';

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        
        // Construir query params para os filtros
        const params = new URLSearchParams();
        if (filters.nome) params.append('nome', filters.nome);
        if (filters.posicao) params.append('posicao', filters.posicao);
        if (filters.time) params.append('time', filters.time);
        if (filters.idadeMin) params.append('idadeMin', filters.idadeMin);
        if (filters.idadeMax) params.append('idadeMax', filters.idadeMax);
        if (filters.alturaMin) params.append('alturaMin', filters.alturaMin);
        if (filters.alturaMax) params.append('alturaMax', filters.alturaMax);
        if (filters.pesoMin) params.append('pesoMin', filters.pesoMin);
        if (filters.pesoMax) params.append('pesoMax', filters.pesoMax);

        const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
        
        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const payload = resp?.data;

        // authSoft pode responder 200 + { ok:false, msg: '...' }
        if (
          payload &&
          typeof payload === 'object' &&
          !Array.isArray(payload) &&
          payload.ok === false
        ) {
          setError(payload.msg || 'Acesso não permitido.');
          setPlayers([]);
          return;
        }

        // aceita array puro ou { ok:true, data:[...] }
        const list = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload?.data) ? payload.data : []);

        setPlayers(list);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar jogadores.');
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [token, filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlayers = players.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(players.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openModal = async (player) => {
    setSelectedPlayer(player);
    setPlayerComment(''); // Reset comment when opening modal
    setIsModalOpen(true);
    await loadPlayerComments(player.id_jogador);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
    setPlayerComment(''); // Clear comment when closing modal
    setPlayerComments([]);
    setIsModalOpen(false);
  };

  const loadPlayerComments = async (playerId) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(`http://localhost:5000/api/jogador/comentarios/${playerId}`, config);
      if (response.data.ok) {
        setPlayerComments(response.data.comentarios || []);
      }
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  const handleSendComment = async () => {
    if (!token) {
      alert('Você precisa estar logado para comentar.');
      return;
    }

    if (!playerComment.trim()) {
      alert('Digite um comentário antes de enviar.');
      return;
    }

    setIsSendingComment(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/jogador/comentarios/${selectedPlayer.id_jogador}`,
        { comentario: playerComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        alert('Comentário enviado com sucesso!');
        setPlayerComment('');
        await loadPlayerComments(selectedPlayer.id_jogador);
      } else {
        alert(response.data.msg || 'Erro ao enviar comentário.');
      }
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      alert('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setIsSendingComment(false);
    }
  };

  const openDeleteModal = (player) => {
    setPlayerToDelete(player);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPlayerToDelete(null);
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleDeletePlayer = async () => {
    if (!playerToDelete || !token) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/jogador/deletar/${playerToDelete.id_jogador}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        // Remove o jogador da lista local
        setPlayers(prev => prev.filter(p => p.id_jogador !== playerToDelete.id_jogador));
        closeDeleteModal();
        alert('Jogador removido com sucesso!');
      } else {
        alert(response.data.msg || 'Erro ao remover jogador.');
      }
    } catch (err) {
      console.error('Erro ao deletar jogador:', err);
      alert('Erro ao remover jogador. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ADICIONAR À SHORTLIST
  const handleAddToShortlist = async (player) => {
  if (!token || !user?.id) {
    alert('Você precisa estar logado.');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/jogador/shortlist/adicionar',
      { id_jogador: player.id_jogador }, // SÓ O id_jogador
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.ok) {
      alert('Adicionado à shortlist!');
    } else {
      alert(response.data.msg);
    }
  } catch (err) {
    console.error('Erro:', err.response?.data);
    alert(err.response?.data?.msg || 'Erro');
  }
};

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      nome: '',
      posicao: '',
      time: '',
      idadeMin: '',
      idadeMax: '',
      alturaMin: '',
      alturaMax: '',
      pesoMin: '',
      pesoMax: ''
    });
  };

  // Comparison functions
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    setSelectedForComparison([]);
  };

  const handleSelectForComparison = (playerId) => {
    setSelectedForComparison(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else if (prev.length < 3) {
        return [...prev, playerId];
      } else {
        alert('Você pode selecionar no máximo 3 jogadores para comparar');
        return prev;
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      alert('Selecione pelo menos 2 jogadores para comparar');
      return;
    }
    navigate('/compare-players', { state: { playerIds: selectedForComparison } });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="player-list-page">
      <SideBar_Olheiro />
      
      <div className="player-list-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="page-title">Jogadores</h1>
              <p className="page-subtitle">Gerencie e visualize todos os jogadores</p>
            </div>
            
            <div className="header-actions">
              {isAdmin() && (
                <Link to="/cadastrojogador" className="btn-add-player">
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Jogador
                </Link>
              )}

              <button
                className={`btn-compare ${comparisonMode ? 'active' : ''}`}
                onClick={toggleComparisonMode}
                title="Modo de comparação"
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {comparisonMode ? 'Cancelar' : 'Comparar'}
              </button>

              {comparisonMode && selectedForComparison.length > 0 && (
                <button
                  className="btn-do-compare"
                  onClick={handleCompare}
                  title={`Comparar ${selectedForComparison.length} jogador(es)`}
                >
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Comparar ({selectedForComparison.length})
                </button>
              )}
              
              <button
                className={`btn-filter ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
                title="Filtrar jogadores"
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
                {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v !== '').length}</span>}
              </button>
              
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Visualização em tabela"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Visualização em cards"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3 className="filters-title">
                <svg className="filters-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filtros Avançados
              </h3>
              {hasActiveFilters && (
                <button className="btn-clear-filters" onClick={clearFilters}>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpar Filtros
                </button>
              )}
            </div>

            <div className="filters-grid">
              {/* Nome */}
              <div className="filter-group">
                <label className="filter-label">Nome do Jogador</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Buscar por nome..."
                  value={filters.nome}
                  onChange={(e) => handleFilterChange('nome', e.target.value)}
                />
              </div>

              {/* Time */}
              <div className="filter-group">
                <label className="filter-label">Time</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Buscar por time..."
                  value={filters.time}
                  onChange={(e) => handleFilterChange('time', e.target.value)}
                />
              </div>

              {/* Posição */}
              <div className="filter-group">
                <label className="filter-label">Posição</label>
                <select
                  className="filter-select"
                  value={filters.posicao}
                  onChange={(e) => handleFilterChange('posicao', e.target.value)}
                >
                  <option value="">Todas as posições</option>
                  <option value="GOL">Goleiro (GOL)</option>
                  <option value="LAT">Lateral (LAT)</option>
                  <option value="ZAG">Zagueiro (ZAG)</option>
                  <option value="MEI">Meio-Campo (MEI)</option>
                  <option value="ATA">Atacante (ATA)</option>
                  <option value="TEC">Técnico (TEC)</option>
                </select>
              </div>

              {/* Idade */}
              <div className="filter-group filter-range">
                <label className="filter-label">Idade</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    className="filter-input filter-input-small"
                    placeholder="Min"
                    min="0"
                    max="99"
                    value={filters.idadeMin}
                    onChange={(e) => handleFilterChange('idadeMin', e.target.value)}
                  />
                  <span className="range-separator">até</span>
                  <input
                    type="number"
                    className="filter-input filter-input-small"
                    placeholder="Max"
                    min="0"
                    max="99"
                    value={filters.idadeMax}
                    onChange={(e) => handleFilterChange('idadeMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Altura */}
              <div className="filter-group filter-range">
                <label className="filter-label">Altura (cm)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    className="filter-input filter-input-small"
                    placeholder="Min"
                    min="0"
                    value={filters.alturaMin}
                    onChange={(e) => handleFilterChange('alturaMin', e.target.value)}
                  />
                  <span className="range-separator">até</span>
                  <input
                    type="number"
                    className="filter-input filter-input-small"
                    placeholder="Max"
                    min="0"
                    value={filters.alturaMax}
                    onChange={(e) => handleFilterChange('alturaMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Peso */}
              <div className="filter-group filter-range">
                <label className="filter-label">Peso (kg)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    className="filter-input filter-input-small"
                    placeholder="Min"
                    min="0"
                    value={filters.pesoMin}
                    onChange={(e) => handleFilterChange('pesoMin', e.target.value)}
                  />
                  <span className="range-separator">até</span>
                  <input
                    type="number"
                    className="filter-input filter-input-small"
                    placeholder="Max"
                    min="0"
                    value={filters.pesoMax}
                    onChange={(e) => handleFilterChange('pesoMax', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="page-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando jogadores...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : players.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Nenhum jogador cadastrado</p>
              {isAdmin() && (
                <Link to="/cadastrojogador" className="btn-secondary">
                  Cadastrar primeiro jogador
                </Link>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <div className="table-container">
              <table className="players-table">
                <thead>
                  <tr>
                    {comparisonMode && <th className="checkbox-column">Comparar</th>}
                    <th>Jogador</th>
                    <th>Posição</th>
                    <th>Idade</th>
                    <th>Time</th>
                    <th>Estatísticas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlayers.map((player) => (
                    <tr key={player.id_jogador} className={comparisonMode && selectedForComparison.includes(player.id_jogador) ? 'selected-for-comparison' : ''}>
                      {comparisonMode && (
                        <td className="checkbox-column">
                          <input
                            type="checkbox"
                            className="comparison-checkbox"
                            checked={selectedForComparison.includes(player.id_jogador)}
                            onChange={() => handleSelectForComparison(player.id_jogador)}
                          />
                        </td>
                      )}
                      <td>
                        <div className="player-cell">
                          <div className="player-avatar">
                            {player.nome_jogador?.charAt(0).toUpperCase() || 'J'}
                          </div>
                          <span className="player-name">{player.nome_jogador}</span>
                        </div>
                      </td>
                      <td>
                        <span className="position-badge">{player.posicao_jogador}</span>
                      </td>
                      <td>{player.idade || 'N/A'}</td>
                      <td>
                        <span className="team-name">{player.nome_time || 'Sem time'}</span>
                      </td>
                      <td>
                        <div className="stats-mini">
                          <span title="Gols">{player.gols_marcados || 0}G</span>
                          <span title="Assistências">{player.assistencias || 0}A</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-view"
                            onClick={() => openModal(player)}
                            title="Ver detalhes"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* BOTÃO SHORTLIST */}
                          <button
                            className="btn-action btn-shortlist"
                            onClick={() => handleAddToShortlist(player)}
                            title="Adicionar à shortlist"
                          >
                            <FiList size={16} />
                          </button>

                          <Link
                            to={`/jogadores/estatisticas/${player.id_jogador}`}
                            className="btn-action btn-stats"
                            title="Ver estatísticas"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </Link>

                          {isAdmin() && (
                            <>
                              <Link
                                to={`/atualizar-estatisticas/${player.id_jogador}`}
                                className="btn-action btn-edit-stats"
                                title="Editar estatísticas"
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              
                              <button
                                className="btn-action btn-delete"
                                onClick={() => openDeleteModal(player)}
                                title="Remover jogador"
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="cards-grid">
              {currentPlayers.map((player) => (
                <div key={player.id_jogador} className="player-card">
                  <div className="card-header">
                    <div className="player-avatar-large">
                      {player.nome_jogador?.charAt(0).toUpperCase() || 'J'}
                    </div>
                    <span className="position-badge">{player.posicao_jogador}</span>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="card-player-name">{player.nome_jogador}</h3>
                    <p className="card-team-name">{player.nome_time || 'Sem time'}</p>
                    
                    <div className="card-info">
                      <span>Idade: {player.idade || 'N/A'}</span>
                    </div>
                    
                    <div className="card-stats">
                      <div className="stat-item">
                        <span className="stat-label">Gols</span>
                        <span className="stat-value">{player.gols_marcados || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Assist.</span>
                        <span className="stat-value">{player.assistencias || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Passes</span>
                        <span className="stat-value">{player.passes_certos || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <button
                      className="btn-card-action"
                      onClick={() => openModal(player)}
                    >
                      Ver Detalhes
                    </button>

                    {/* BOTÃO SHORTLIST NO CARD */}
                    <button
                      className="btn-card-shortlist"
                      onClick={() => handleAddToShortlist(player)}
                      title="Adicionar à shortlist"
                    >
                      <FiList size={16} />
                    </button>

                    <Link
                      to={`/jogadores/estatisticas/${player.id_jogador}`}
                      className="btn-card-stats"
                    >
                      Estatísticas
                    </Link>

                    {isAdmin() && (
                      <>
                        <Link
                          to={`/atualizar-estatisticas/${player.id_jogador}`}
                          className="btn-card-edit-stats"
                          title="Editar estatísticas"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        
                        <button
                          className="btn-card-delete"
                          onClick={() => openDeleteModal(player)}
                          title="Remover"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}          {/* Pagination */}
          {players.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, players.length)} de {players.length} jogadores
                </span>
                <div className="items-per-page">
                  <label>Itens por página:</label>
                  <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="Página anterior"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="pagination-numbers">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                    if (endPage - startPage < maxVisible - 1) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    if (startPage > 1) {
                      pages.push(
                        <button key={1} className="pagination-number" onClick={() => goToPage(1)}>
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                          onClick={() => goToPage(i)}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
                      }
                      pages.push(
                        <button key={totalPages} className="pagination-number" onClick={() => goToPage(totalPages)}>
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="Próxima página"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedPlayer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content player-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="modal-header">
              <div className="player-avatar-modal">
                {selectedPlayer.nome_jogador?.charAt(0).toUpperCase() || 'J'}
              </div>
              <div className="player-title-section">
                <h2 className="modal-player-name">{selectedPlayer.nome_jogador}</h2>
                <p className="modal-player-info">
                  <span className="position-badge">{selectedPlayer.posicao_jogador}</span>
                  <span className="divider">•</span>
                  <span>{selectedPlayer.idade ? `${selectedPlayer.idade} anos` : 'Idade não informada'}</span>
                  {selectedPlayer.nome_time && (
                    <>
                      <span className="divider">•</span>
                      <span>{selectedPlayer.nome_time}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="modal-body">
              {/* Informações Físicas */}
              <div className="info-section">
                <h3 className="section-title">Informações Físicas</h3>
                <div className="info-grid">
                  <div className="info-card">
                    <span className="info-label">Altura</span>
                    <span className="info-value">
                      {selectedPlayer.altura_cm ? `${selectedPlayer.altura_cm} cm` : 'N/A'}
                    </span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Peso</span>
                    <span className="info-value">
                      {selectedPlayer.peso_kg ? `${selectedPlayer.peso_kg} kg` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas de Ataque */}
              <div className="info-section">
                <h3 className="section-title">Estatísticas Ofensivas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Gols</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.gols_marcados || 0}</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Assistências</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.assistencias || 0}</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Finalizações</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.finalizacoes || 0}</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Força de Chute</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.chute_forca || 0}</span>
                  </div>
                </div>
              </div>

              {/* Estatísticas de Passe */}
              <div className="info-section">
                <h3 className="section-title">Estatísticas de Passe</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Passes Certos</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.passes_certos || 0}</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Total de Passes</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.passe_total || 0}</span>
                  </div>
                </div>
              </div>

              {/* Estatísticas Físicas e Técnicas */}
              <div className="info-section">
                <h3 className="section-title">Habilidades Físicas e Técnicas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Aceleração</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.aceleracao || 0}</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Drible</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.drible || 0}</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Roubadas de Bola</span>
                    </div>
                    <span className="stat-value">{selectedPlayer.roubadas_bola || 0}</span>
                  </div>
                </div>
              </div>

              {/* Disciplina */}
              <div className="info-section">
                <h3 className="section-title">Disciplina</h3>
                <div className="discipline-grid">
                  <div className="discipline-card yellow">
                    <div className="card-icon">Amarelo</div>
                    <div className="card-content">
                      <span className="card-label">Cartões Amarelos</span>
                      <span className="card-value">{selectedPlayer.cartoes_amarelos || 0}</span>
                    </div>
                  </div>
                  <div className="discipline-card red">
                    <div className="card-icon">Vermelho</div>
                    <div className="card-content">
                      <span className="card-label">Cartões Vermelhos</span>
                      <span className="card-value">{selectedPlayer.cartoes_vermelhos || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comentários */}
              <div className="info-section">
                <h3 className="section-title">Comentários</h3>
                
                {/* Lista de comentários */}
                {playerComments.length > 0 && (
                  <div className="comments-list" style={{ marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {playerComments.map((comment) => (
                      <div key={comment.id_comentarios} style={{
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #3b82f6'
                      }}>
                        <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.9rem' }}>
                          {comment.texto_comentarios}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulário de novo comentário */}
                <div className="comment-section">
                  <textarea
                    className="comment-textarea"
                    value={playerComment}
                    onChange={(e) => setPlayerComment(e.target.value)}
                    placeholder="Adicione suas observações sobre o jogador..."
                    rows="4"
                    disabled={isSendingComment || !token}
                  />
                  <button 
                    className="btn-send-comment"
                    onClick={handleSendComment}
                    disabled={isSendingComment || !token || !playerComment.trim()}
                  >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {isSendingComment ? 'Enviando...' : 'Enviar Comentário'}
                  </button>
                  {!token && (
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Faça login para adicionar comentários
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {isDeleteModalOpen && playerToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-wrapper">
              <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="delete-title">Remover Jogador?</h2>
            <p className="delete-message">
              Tem certeza que deseja remover <strong>{playerToDelete.nome_jogador}</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="delete-actions">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePlayer}
                disabled={isDeleting}
                className="btn-confirm-delete"
              >
                {isDeleting ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}