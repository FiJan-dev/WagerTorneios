import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './GerenciarOlheiros.css';

export default function GerenciarOlheiros() {
  const { token, isAdmin } = useContext(AuthContext);
  const [olheiros, setOlheiros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:5000/api/olheiro';

  useEffect(() => {
    if (!isAdmin()) {
      setError('Acesso negado. Apenas administradores podem acessar esta página.');
      setIsLoading(false);
      return;
    }
    fetchOlheiros();
  }, [token, isAdmin]);

  const fetchOlheiros = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setOlheiros(response.data.olheiros);
      } else {
        setError('Erro ao carregar olheiros.');
      }
    } catch (err) {
      console.error('Erro ao buscar olheiros:', err);
      setError('Erro ao carregar olheiros.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/aprovar/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        alert('Olheiro aprovado com sucesso!');
        fetchOlheiros();
      } else {
        alert(response.data.error || 'Erro ao aprovar olheiro.');
      }
    } catch (err) {
      console.error('Erro ao aprovar:', err);
      alert('Erro ao aprovar olheiro.');
    }
  };

  const handleRejeitar = async (id) => {
    if (!confirm('Tem certeza que deseja rejeitar este olheiro?')) return;

    try {
      const response = await axios.put(
        `${API_URL}/rejeitar/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        alert('Olheiro rejeitado.');
        fetchOlheiros();
      } else {
        alert(response.data.error || 'Erro ao rejeitar olheiro.');
      }
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
      alert('Erro ao rejeitar olheiro.');
    }
  };

  const handleExcluir = async (id, nome) => {
    if (!confirm(`Tem certeza que deseja excluir permanentemente o olheiro "${nome}"?`)) return;

    try {
      const response = await axios.delete(
        `${API_URL}/excluir/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message) {
        alert('Olheiro excluído com sucesso!');
        fetchOlheiros();
      } else {
        alert(response.data.error || 'Erro ao excluir olheiro.');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert(err.response?.data?.error || 'Erro ao excluir olheiro.');
    }
  };

  // Filtrar olheiros
  const filteredOlheiros = olheiros.filter(olheiro => {
    // Filtro por status
    if (filterStatus === 'pending' && olheiro.aprovado !== 0) return false;
    if (filterStatus === 'approved' && olheiro.aprovado !== 1) return false;
    if (filterStatus === 'rejected' && olheiro.aprovado !== 2) return false;

    // Filtro por busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        olheiro.nome_usuario.toLowerCase().includes(search) ||
        olheiro.email_usuario.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const getStatusBadge = (aprovado, admin) => {
    if (admin === 1) {
      return <span className="status-badge admin">Administrador</span>;
    }
    switch (aprovado) {
      case 0:
        return <span className="status-badge pending">Pendente</span>;
      case 1:
        return <span className="status-badge approved">Aprovado</span>;
      case 2:
        return <span className="status-badge rejected">Rejeitado</span>;
      default:
        return <span className="status-badge unknown">Desconhecido</span>;
    }
  };

  const pendingCount = olheiros.filter(o => o.aprovado === 0 && o.admin !== 1).length;
  const approvedCount = olheiros.filter(o => o.aprovado === 1 && o.admin !== 1).length;
  const rejectedCount = olheiros.filter(o => o.aprovado === 2).length;

  return (
    <div className="gerenciar-olheiros-page">
      <SideBar_Olheiro />
      
      <div className="gerenciar-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="page-title">Gerenciar Olheiros</h1>
              <p className="page-subtitle">
                Aprovar ou rejeitar cadastros de novos olheiros
              </p>
            </div>

            {pendingCount > 0 && (
              <div className="pending-alert">
                <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{pendingCount} olheiro(s) aguardando aprovação</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card pending-card">
            <div className="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Pendentes</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
          </div>
          <div className="stat-card approved-card">
            <div className="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Aprovados</span>
              <span className="stat-value">{approvedCount}</span>
            </div>
          </div>
          <div className="stat-card rejected-card">
            <div className="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Rejeitados</span>
              <span className="stat-value">{rejectedCount}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Todos ({olheiros.length})
            </button>
            <button
              className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              className={`filter-tab ${filterStatus === 'approved' ? 'active' : ''}`}
              onClick={() => setFilterStatus('approved')}
            >
              Aprovados ({approvedCount})
            </button>
            <button
              className={`filter-tab ${filterStatus === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilterStatus('rejected')}
            >
              Rejeitados ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="page-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando olheiros...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : filteredOlheiros.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Nenhum olheiro encontrado</p>
            </div>
          ) : (
            <div className="olheiros-table-container">
              <table className="olheiros-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOlheiros.map((olheiro) => (
                    <tr key={olheiro.id_usuario}>
                      <td>{olheiro.id_usuario}</td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {olheiro.nome_usuario.charAt(0).toUpperCase()}
                          </div>
                          <span className="user-name">{olheiro.nome_usuario}</span>
                        </div>
                      </td>
                      <td>{olheiro.email_usuario}</td>
                      <td>{getStatusBadge(olheiro.aprovado, olheiro.admin)}</td>
                      <td>
                        <div className="action-buttons">
                          {olheiro.admin !== 1 && (
                            <>
                              {olheiro.aprovado !== 1 && (
                                <button
                                  className="btn-action btn-approve"
                                  onClick={() => handleAprovar(olheiro.id_usuario)}
                                  title="Aprovar olheiro"
                                >
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              {olheiro.aprovado !== 2 && (
                                <button
                                  className="btn-action btn-reject"
                                  onClick={() => handleRejeitar(olheiro.id_usuario)}
                                  title="Rejeitar olheiro"
                                >
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                              <button
                                className="btn-action btn-delete"
                                onClick={() => handleExcluir(olheiro.id_usuario, olheiro.nome_usuario)}
                                title="Excluir olheiro"
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                          {olheiro.admin === 1 && (
                            <span className="admin-label">Sem ações disponíveis</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
