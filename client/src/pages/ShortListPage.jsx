// src/pages/ShortlistPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiStar, FiEye, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ShortListPage.css'; // Nome minúsculo!

const ShortlistPage = () => {
  const { user, token } = useContext(AuthContext);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchShortlist = async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:5000/api/jogador/shortlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.ok) {
        setShortlist(res.data.jogadores || []);
      } else {
        setError('Falha ao carregar shortlist');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      console.error("Erro ao buscar shortlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removerShortlist = async (id_jogador) => {
    if (!window.confirm("Remover este jogador da shortlist?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/jogador/shortlist/remover/${id_jogador}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.ok) {
        setShortlist(prev => prev.filter(j => j.id_jogador !== id_jogador));
      } else {
        alert(res.data.msg || 'Erro ao remover');
      }
    } catch (err) {
      alert('Erro ao remover. Verifique sua conexão.');
      console.error("Erro ao remover:", err);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, [user, token]);

  // Usuário não logado
  if (!user) {
    return (
      <div className="shortlist-container">
        <div className="shortlist-content">
          <div className="shortlist-empty">
            <div className="shortlist-empty-icon">
              <FaStar />
            </div>
            <h3>Faça login para ver sua Shortlist</h3>
            <Link to="/login" className="btn-explorar">
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shortlist-container">
      <div className="shortlist-bg-gradient"></div>
      <div className="shortlist-bg-grid"></div>

      <div className="shortlist-content">
        {/* Cabeçalho */}
        <div className="shortlist-header">
          <Link to="/jogadores" className="btn-voltar-shortlist">
            <FiEye />
            Voltar para Jogadores
          </Link>
          <h1 className="shortlist-title">Minha Shortlist</h1>
          <div className="shortlist-counter">
            {shortlist.length} jogador{shortlist.length !== 1 ? 'es' : ''}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="shortlist-loading">
            <div className="shortlist-spinner"></div>
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="shortlist-error">
            {error}
            <button onClick={fetchShortlist} className="btn-explorar" style={{ marginLeft: '1rem' }}>
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Lista vazia */}
        {!loading && !error && shortlist.length === 0 && (
          <div className="shortlist-empty">
            <div className="shortlist-empty-icon">
              <FaStar />
            </div>
            <h3>Shortlist vazia</h3>
            <p>Adicione jogadores para acesso rápido</p>
            <Link to="/jogadores" className="btn-explorar">
              <FiStar />
              Explorar Jogadores
            </Link>
          </div>
        )}

        {/* Grid de jogadores */}
        {!loading && !error && shortlist.length > 0 && (
          <div className="shortlist-grid">
            <AnimatePresence>
              {shortlist.map(jogador => (
                <motion.div
                  key={jogador.id_jogador}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="shortlist-card"
                >
                  {/* Ícone do jogador */}
                  <div className="shortlist-player-icon">
                    <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="shortlist-icon-border"></div>
                  </div>

                  {/* Nome */}
                  <h3 className="shortlist-player-name">{jogador.nome_jogador}</h3>

                  {/* Posição e Time */}
                  <p className="shortlist-player-info">
                    {jogador.posicao_jogador} • {jogador.nome_time}
                  </p>

                  {/* Detalhes */}
                  <div className="shortlist-details">
                    <div className="shortlist-detail-item">
                      <span>Idade</span>
                      <span className="shortlist-detail-value">{jogador.idade}</span>
                    </div>
                    <div className="shortlist-detail-item">
                      <span>Altura</span>
                      <span className="shortlist-detail-value">{jogador.altura_cm}cm</span>
                    </div>
                    <div className="shortlist-detail-item">
                      <span>Peso</span>
                      <span className="shortlist-detail-value">{jogador.peso_kg}kg</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="shortlist-actions">
                    <Link
                      to={`/jogadores/estatisticas/${jogador.id_jogador}`}
                      className="btn-perfil"
                    >
                      <FiEye />
                      Ver Perfil
                    </Link>
                    <button
                      onClick={() => removerShortlist(jogador.id_jogador)}
                      className="btn-remover"
                    >
                      <FiTrash2 />
                      Remover
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistPage;