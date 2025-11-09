import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import { AuthContext } from '../context/AuthContext';
import './CadastroPartidaLista.css';

// Função auxiliar para formatar datas
const formatarDataHora = (dataString, formato = 'padrao') => {
  if (!dataString) return 'Data não informada';
  
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return 'Data inválida';
  
  const opcoes = {
    padrao: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    completo: {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return data.toLocaleString('pt-BR', opcoes[formato] || opcoes.padrao);
};

export default function CadastroPartidaLista() {
  const { token, isAdmin, user } = useContext(AuthContext);

  const [partidas, setPartidas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partidaToDelete, setPartidaToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const API_URL = 'http://localhost:5000/api/partida/listarP';

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPartidas = partidas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(partidas.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const resp = await axios.get(API_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const payload = resp?.data;

        // authSoft pode retornar 200 + { ok:false, msg }
        if (
          payload &&
          typeof payload === 'object' &&
          !Array.isArray(payload) &&
          payload.ok === false
        ) {
          setError(payload.msg || 'Acesso não permitido.');
          setPartidas([]);
          return;
        }

        // aceita array puro ou { ok:true, data:[...] }
        setPartidas(
          Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
            ? payload.data
            : []
        );
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar partidas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartidas();
  }, [token]);

  const openModal = (partida) => {
    setSelectedPartida(partida);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPartida(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (partida) => {
    setPartidaToDelete(partida);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPartidaToDelete(null);
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleDeletePartida = async () => {
    if (!partidaToDelete || !token) {
      console.error('Dados insuficientes para deletar:', { partidaToDelete, token });
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Tentando deletar partida:', partidaToDelete.id_partida);
      console.log('Token sendo usado:', token);
      
      const response = await axios.delete(
        `http://localhost:5000/api/partida/deletar/${partidaToDelete.id_partida}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Resposta do servidor:', response.data);

      if (response.data.ok) {
        // Remove a partida da lista local
        setPartidas(prev => prev.filter(p => p.id_partida !== partidaToDelete.id_partida));
        closeDeleteModal();
        alert('Partida removida com sucesso!');
      } else {
        console.error('Erro retornado pelo servidor:', response.data);
        alert(response.data.msg || 'Erro ao remover partida.');
      }
    } catch (err) {
      console.error('Erro ao deletar partida:', err);
      console.error('Detalhes do erro:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      const errorMsg = err.response?.data?.msg || 
                      err.response?.data?.error || 
                      err.message || 
                      'Erro ao remover partida. Tente novamente.';
      alert(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="partida-list-page">
      <SideBar_Olheiro />
      
      <div className="partida-list-container">
        <div className="page-header-partida-list">
          <div className="header-left">
            <h1>Partidas</h1>
            <p>Visualize e gerencie as partidas cadastradas</p>
          </div>
          {isAdmin() && (
            <Link to="/cadastropartida" className="btn-add-partida">
              Adicionar Partida
            </Link>
          )}
        </div>

        <div className="partida-content">
          {isLoading ? (
            <div className="loading-state">Carregando...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : partidas.length === 0 ? (
            <div className="empty-state">Nenhuma partida cadastrada.</div>
          ) : (
            <>
              <table className="partidas-table">
                <thead>
                  <tr>
                    <th>CAMPEONATO</th>
                    <th>TIME CASA</th>
                    <th>TIME VISITANTE</th>
                    <th>PLACAR</th>
                    <th>DATA/HORA</th>
                    <th>LOCAL</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPartidas.map((partida) => (
                    <tr key={partida.id_partida}>
                      <td className="partida-campeonato">{partida.nome_campeonato}</td>
                      <td>{partida.nome_time_casa}</td>
                      <td>{partida.nome_time_visitante}</td>
                      <td className="partida-placar">
                        {partida.placar_casa} × {partida.placar_visitante}
                      </td>
                      <td>{formatarDataHora(partida.data_partida)}</td>
                      <td>{partida.local_partida}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => openModal(partida)}
                            className="btn-details"
                          >
                            Detalhes
                          </button>
                          {isAdmin() && (
                            <button
                              onClick={() => openDeleteModal(partida)}
                              className="btn-delete"
                              title="Remover partida"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer com paginação */}
              {partidas.length > 0 && (
                <div className="partida-footer">
                  <div className="footer-info">
                    <span>
                      Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, partidas.length)} de {partidas.length} partidas
                    </span>
                    <div className="items-per-page">
                      <label>Itens por página:</label>
                      <select 
                        value={itemsPerPage} 
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                        title="Página anterior"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

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
                              className="pagination-number"
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pages.push(
                              <span key="start-ellipsis" className="pagination-ellipsis">
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
                              className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                            >
                              {i}
                            </button>
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="end-ellipsis" className="pagination-ellipsis">
                                ...
                              </span>
                            );
                          }
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => goToPage(totalPages)}
                              className="pagination-number"
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
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
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedPartida && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes da Partida</h2>
              <button onClick={closeModal} className="modal-close">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-campeonato">
                <h3>{selectedPartida.nome_campeonato}</h3>
                <p className="modal-campeonato-local">{selectedPartida.local_partida}</p>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Confronto</h4>
                <div className="confronto-box">
                  <div className="confronto-time">
                    <div className="confronto-time-label">Time Casa</div>
                    <div className="confronto-time-name">{selectedPartida.nome_time_casa}</div>
                  </div>
                  <div className="confronto-placar">
                    {selectedPartida.placar_casa} × {selectedPartida.placar_visitante}
                  </div>
                  <div className="confronto-time">
                    <div className="confronto-time-label">Time Visitante</div>
                    <div className="confronto-time-name">{selectedPartida.nome_time_visitante}</div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Informações</h4>
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-card-label">Data e Horário</div>
                    <div className="info-card-value">
                      {formatarDataHora(selectedPartida.data_partida, 'completo')}
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-label">Local</div>
                    <div className="info-card-value">{selectedPartida.local_partida}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="btn-modal-close">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {isDeleteModalOpen && partidaToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete-modal-header">
              <h2>Confirmar Remoção</h2>
              <button onClick={closeDeleteModal} className="modal-close">
                ×
              </button>
            </div>

            <div className="delete-modal-body">
              <div className="delete-warning-icon">!</div>
              <p>Tem certeza que deseja remover a partida:</p>
              <div className="delete-partida-info">
                <div className="delete-partida-name">
                  {partidaToDelete.nome_time_casa} × {partidaToDelete.nome_time_visitante}
                </div>
                <div className="delete-partida-details">
                  {partidaToDelete.nome_campeonato} • {formatarDataHora(partidaToDelete.data_partida)}
                </div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Esta ação não pode ser desfeita.</p>
            </div>

            <div className="modal-actions">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="btn-cancel-delete"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePartida}
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
