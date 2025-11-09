import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import { AuthContext } from '../context/AuthContext';
import './CadastroCampeonatoLista.css';

// Função auxiliar para formatar datas
const formatarData = (dataString, formato = 'padrao') => {
  if (!dataString) return 'Data não informada';
  
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return 'Data inválida';
  
  const opcoes = {
    padrao: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    completo: {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    extenso: {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  };
  
  return data.toLocaleDateString('pt-BR', opcoes[formato] || opcoes.padrao);
};

// Função para calcular duração do campeonato
const calcularDuracao = (dataInicio, dataFim) => {
  if (!dataInicio || !dataFim) return 'Duração não calculável';
  
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) return 'Datas inválidas';
  
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 dia';
  if (diffDays < 7) return `${diffDays} dias`;
  if (diffDays < 30) {
    const semanas = Math.floor(diffDays / 7);
    const diasRestantes = diffDays % 7;
    if (diasRestantes === 0) return semanas === 1 ? '1 semana' : `${semanas} semanas`;
    return `${semanas} semana${semanas > 1 ? 's' : ''} e ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''}`;
  }
  
  const meses = Math.floor(diffDays / 30);
  const diasRestantes = diffDays % 30;
  if (diasRestantes === 0) return meses === 1 ? '1 mês' : `${meses} meses`;
  return `${meses} mês${meses > 1 ? 'es' : ''} e ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''}`;
};

// Função para verificar status do campeonato
const verificarStatus = (dataInicio, dataFim) => {
  if (!dataInicio || !dataFim) return { status: 'indefinido', cor: 'gray', texto: 'Status indefinido' };
  
  const hoje = new Date();
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  if (hoje < inicio) {
    return { status: 'futuro', cor: 'blue', texto: 'Ainda não iniciou' };
  } else if (hoje > fim) {
    return { status: 'encerrado', cor: 'red', texto: 'Encerrado' };
  } else {
    return { status: 'ativo', cor: 'green', texto: 'Em andamento' };
  }
};

export default function CadastroCampeonatoLista() {
  const { token, isAdmin } = useContext(AuthContext);

  const [campeonatos, setCampeonatos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campeonatoToDelete, setCampeonatoToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const API_URL = 'http://localhost:5000/api/campeonato/listarC';

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const resp = await axios.get(API_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const payload = resp?.data;

        // Caso o authSoft tenha barrado (200 + ok:false)
        if (
          payload &&
          typeof payload === 'object' &&
          !Array.isArray(payload) &&
          payload.ok === false
        ) {
          alert(payload.msg || 'Acesso não permitido.');
          setCampeonatos([]);
          return;
        }

        // Caso venha no formato { ok:true, data:[...] }
        if (
          payload &&
          typeof payload === 'object' &&
          !Array.isArray(payload) &&
          Array.isArray(payload.data)
        ) {
          setCampeonatos(payload.data);
          return;
        }

        // Formato recomendado: array puro
        const campanhasList = Array.isArray(payload) ? payload : [];
        console.log('Campeonatos recebidos:', campanhasList);
        if (campanhasList.length > 0) {
          console.log('Primeiro campeonato:', campanhasList[0]);
          console.log('Campos disponíveis:', Object.keys(campanhasList[0]));
        }
        setCampeonatos(campanhasList);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar campeonatos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampeonatos();
  }, [token]); // re-carrega quando o token mudar

  // Garanta que é array
  const lista = Array.isArray(campeonatos) ? campeonatos : [];

  // Filter campeonatos por nome (case-insensitive)
  const filteredCampeonatos = lista.filter((camp) => {
    const nome = (camp?.nome_campeonato || '').toString().toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    return nome.includes(query);
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampeonatos = filteredCampeonatos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampeonatos.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openModal = (campeonato) => {
    setSelectedCampeonato(campeonato);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCampeonato(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (campeonato) => {
    setCampeonatoToDelete(campeonato);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCampeonatoToDelete(null);
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleDeleteCampeonato = async () => {
    if (!campeonatoToDelete || !token) return;

    console.log('Tentando deletar campeonato:', campeonatoToDelete);
    console.log('ID do campeonato:', campeonatoToDelete.id_campeonato);
    console.log('URL que será chamada:', `http://localhost:5000/api/campeonato/deletar/${campeonatoToDelete.id_campeonato}`);

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/campeonato/deletar/${campeonatoToDelete.id_campeonato}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Response recebida:', response);

      if (response.data.ok) {
        // Remove o campeonato da lista local
        setCampeonatos(prev => prev.filter(c => c.id_campeonato !== campeonatoToDelete.id_campeonato));
        closeDeleteModal();
        alert('Campeonato removido com sucesso!');
      } else {
        console.error('Erro no servidor:', response.data);
        alert(response.data.msg || 'Erro ao remover campeonato.');
      }
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Status do erro:', err.response?.status);
      console.error('Response data:', err.response?.data);
      console.error('Config da requisição:', err.config);
      
      if (err.response?.status === 404) {
        alert('Rota não encontrada. Verifique se o servidor está rodando e se as rotas estão configuradas corretamente.');
      } else {
        const errorMsg = err.response?.data?.msg || err.message || 'Erro ao remover campeonato. Tente novamente.';
        alert(errorMsg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="campeonato-list-page">
      <SideBar_Olheiro />
      
      <div className="campeonato-list-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="page-title">Campeonatos</h1>
              <p className="page-subtitle">Visualize e gerencie os campeonatos</p>
            </div>
            
            <div className="header-actions">
              {isAdmin() && (
                <Link to="/cadastrocampeonato" className="btn-add">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Campeonato
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome do campeonato..."
            className="search-input"
          />
        </div>

        {/* Content */}
        <div className="page-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando campeonatos...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : lista.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum campeonato cadastrado</p>
              {isAdmin() && (
                <Link to="/cadastrocampeonato" className="btn-add">
                  Cadastrar primeiro campeonato
                </Link>
              )}
            </div>
          ) : filteredCampeonatos.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum campeonato encontrado para a pesquisa</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="campeonatos-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                    <th>Local</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCampeonatos.map((camp, index) => {
                    const status = verificarStatus(camp.data_inicio, camp.data_fim);
                    return (
                      <tr key={index}>
                        <td>{camp.nome_campeonato}</td>
                        <td>
                          <span className={`status-badge ${status.status}`}>
                            {status.texto}
                          </span>
                        </td>
                        <td>{formatarData(camp.data_inicio)}</td>
                        <td>{formatarData(camp.data_fim)}</td>
                        <td>{camp.local_campeonato}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => openModal(camp)}
                              className="btn-action"
                            >
                              Detalhes
                            </button>
                            {isAdmin() && (
                              <button
                                onClick={() => openDeleteModal(camp)}
                                className="btn-action btn-delete"
                                title="Remover campeonato"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer com paginação */}
          {!isLoading && !error && filteredCampeonatos.length > 0 && (
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--cl-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.875rem',
                color: 'var(--cl-text-secondary)'
              }}>
                <span>
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCampeonatos.length)} de {filteredCampeonatos.length} campeonatos
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--cl-text-secondary)' }}>
                    Itens por página:
                  </label>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    style={{
                      padding: '0.5rem',
                      background: 'var(--cl-bg-secondary)',
                      color: 'var(--cl-text-primary)',
                      border: '1px solid var(--cl-border)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'var(--cl-bg-secondary)',
                      border: '1px solid var(--cl-border)',
                      borderRadius: '6px',
                      color: 'var(--cl-text-secondary)',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Página anterior"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
                          <button 
                            key={1}
                            onClick={() => goToPage(1)}
                            style={{
                              width: '36px',
                              height: '36px',
                              background: 'var(--cl-bg-secondary)',
                              border: '1px solid var(--cl-border)',
                              borderRadius: '8px',
                              color: 'var(--cl-text-secondary)',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span key="start-ellipsis" style={{ padding: '0 0.5rem', color: 'var(--cl-text-secondary)', fontSize: '0.875rem' }}>
                              ...
                            </span>
                          );
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => goToPage(i)}
                            style={{
                              width: '36px',
                              height: '36px',
                              background: currentPage === i ? 'var(--cl-accent)' : 'var(--cl-bg-secondary)',
                              border: `1px solid ${currentPage === i ? 'var(--cl-accent)' : 'var(--cl-border)'}`,
                              borderRadius: '8px',
                              color: currentPage === i ? 'white' : 'var(--cl-text-secondary)',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {i}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="end-ellipsis" style={{ padding: '0 0.5rem', color: 'var(--cl-text-secondary)', fontSize: '0.875rem' }}>
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => goToPage(totalPages)}
                            style={{
                              width: '36px',
                              height: '36px',
                              background: 'var(--cl-bg-secondary)',
                              border: '1px solid var(--cl-border)',
                              borderRadius: '8px',
                              color: 'var(--cl-text-secondary)',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'var(--cl-bg-secondary)',
                      border: '1px solid var(--cl-border)',
                      borderRadius: '6px',
                      color: 'var(--cl-text-secondary)',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Próxima página"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedCampeonato && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2 className="modal-title">{selectedCampeonato.nome_campeonato}</h2>
                <p className="modal-subtitle">{selectedCampeonato.local_campeonato}</p>
              </div>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {(() => {
                const status = verificarStatus(selectedCampeonato.data_inicio, selectedCampeonato.data_fim);
                return (
                  <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <span className={`status-badge ${status.status}`}>
                      {status.texto}
                    </span>
                  </div>
                );
              })()}

              <div className="info-grid">
                <div className="info-card">
                  <p className="info-label">Data de Início</p>
                  <p className="info-value">
                    {formatarData(selectedCampeonato.data_inicio, 'extenso')}
                  </p>
                </div>

                <div className="info-card">
                  <p className="info-label">Data de Término</p>
                  <p className="info-value">
                    {formatarData(selectedCampeonato.data_fim, 'extenso')}
                  </p>
                </div>

                <div className="info-card">
                  <p className="info-label">Duração</p>
                  <p className="info-value">
                    {calcularDuracao(selectedCampeonato.data_inicio, selectedCampeonato.data_fim)}
                  </p>
                </div>

                <div className="info-card">
                  <p className="info-label">Localização</p>
                  <p className="info-value">{selectedCampeonato.local_campeonato}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="btn-add">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {isDeleteModalOpen && campeonatoToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2 className="modal-title">Confirmar Remoção</h2>
                <p className="modal-subtitle" style={{color: 'var(--cl-error)'}}>Esta ação não pode ser desfeita</p>
              </div>
              <button className="modal-close" onClick={closeDeleteModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-info">
                <p style={{color: 'var(--cl-text-secondary)', marginBottom: '0.5rem'}}>
                  Tem certeza que deseja remover o campeonato:
                </p>
                <p className="delete-campeonato-name">
                  {campeonatoToDelete.nome_campeonato}
                </p>
                <p className="delete-campeonato-details">
                  {campeonatoToDelete.local_campeonato} • {formatarData(campeonatoToDelete.data_inicio)} a {formatarData(campeonatoToDelete.data_fim)}
                </p>
              </div>

              <div className="delete-warning">
                ⚠️ <strong>Atenção:</strong> Só é possível deletar campeonatos que não possuem partidas associadas.
              </div>
            </div>

            <div className="modal-footer">
              <div className="delete-actions">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteCampeonato}
                  disabled={isDeleting}
                  className="btn-confirm-delete"
                >
                  {isDeleting ? 'Removendo...' : 'Remover'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
