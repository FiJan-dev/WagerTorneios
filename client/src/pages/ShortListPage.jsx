// src/pages/ShortlistPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiStar, FiEye, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ShortListPage.css';

const ShortlistPage = () => {
  const { user } = useContext(AuthContext);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carrega shortlist do usuário
  const fetchShortlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/jogador/shortlist');
      if (res.data.ok) {
        setShortlist(res.data.jogadores || []);
      }
    } catch (err) {
      setError('Erro ao carregar shortlist');
      console.error("Erro ao buscar shortlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove da shortlist
  const removerShortlist = async (id_jogador) => {
    const confirmRemove = window.confirm("Tem certeza que deseja remover este jogador da shortlist?");
    if (!confirmRemove) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/jogador/shortlist/remover/${id_jogador}`);
      if (res.data.ok) {
        setShortlist(prev => prev.filter(item => item.id_jogador !== id_jogador));
      }
    } catch (err) {
      alert('Erro ao remover da shortlist');
      console.error("Erro ao remover:", err);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, [user]);

  // Se não está logado
  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl shadow-2xl mt-10 text-center border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          Faça login para ver sua Shortlist
        </h1>
        <Link to="/login">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            Ir para o Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="shortlist-container p-6 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/jogadores" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <FiEye size={20} />
            <span>Voltar para Jogadores</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent text-center flex-1">
            Minha Shortlist
          </h1>
          <div className="text-right">
            <span className="bg-blue-900/50 border border-blue-700 px-4 py-2 rounded-full text-blue-300 font-semibold">
              {shortlist.length} jogador{shortlist.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="text-center py-12 text-red-400 bg-red-900/20 border border-red-800/50 rounded-xl max-w-2xl mx-auto">
            {error}
            <button 
              onClick={fetchShortlist}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold ml-4"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Lista vazia */}
        {!loading && !error && shortlist.length === 0 && (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 p-6 bg-blue-900/30 border-2 border-dashed border-blue-700 rounded-full">
              <FaStar size={32} className="text-blue-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Shortlist vazia</h2>
            <p className="text-gray-500 mb-8">Adicione seus jogadores favoritos para acesso rápido</p>
            <Link 
              to="/jogadores"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FiStar size={20} />
              Explorar Jogadores
            </Link>
          </div>
        )}

        {/* Grid de jogadores */}
        {!loading && !error && shortlist.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-4 lg:px-0">
            <AnimatePresence>
              {shortlist.map(jogador => (
                <motion.div
                  key={jogador.id_jogador}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.3 } }}
                  layout
                  className="shortlist-card-modern bg-gradient-to-br from-slate-900/90 to-blue-900/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/70 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Background gradiente no hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Ícone do jogador */}
                  <div className="relative z-10 flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-4 border-blue-800/50 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Nome */}
                  <h3 className="shortlist-name-modern text-xl font-bold text-white text-center mb-2 truncate">
                    {jogador.nome_jogador}
                  </h3>

                  {/* Posição e Time */}
                  <p className="text-blue-400 font-semibold text-center text-sm mb-4 bg-blue-900/30 px-3 py-1 rounded-full">
                    {jogador.posicao_jogador} • {jogador.nome_time}
                  </p>

                  {/* Detalhes */}
                  <div className="space-y-2 mb-6 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Idade</span>
                      <span className="text-white font-semibold">{jogador.idade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Altura</span>
                      <span className="text-white font-semibold">{jogador.altura_cm}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso</span>
                      <span className="text-white font-semibold">{jogador.peso_kg}kg</span>
                    </div>
                  </div>

                  {/* Botões flutuantes */}
                  <div className="flex gap-2">
                    <Link
                      to={`/jogadores/estatisticas/${jogador.id_jogador}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FiEye size={16} />
                      Ver Perfil
                    </Link>
                    <button
                      onClick={() => removerShortlist(jogador.id_jogador)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FiTrash2 size={16} />
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