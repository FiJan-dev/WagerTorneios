import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function PlayerList() {
  const { token, isAdmin } = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const API_URL = 'http://localhost:5000/api/jogador/listar';

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const resp = await axios.get(API_URL, {
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
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar jogadores.');
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [token]);

  const openModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
    setComments([]);
    setNewComment('');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newComment,
          date: new Date().toLocaleString('pt-BR'),
        },
      ]);
      setNewComment('');
    }
  };

  return (
    <div className="flex min-h-screen bg-black flex-col">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border pt-16 sm:pt-20">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-4xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              J
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
            Lista de Jogadores
          </h1>
          <p className="text-center text-gray-300 text-base mb-6">
            Visualize e gerencie os jogadores cadastrados
          </p>
          {isAdmin() && (
            <Link
              to="/cadastrojogador"
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200 mb-8"
            >
              Adicionar Jogador
            </Link>
          )}

          {isLoading ? (
            <p className="text-gray-300">Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : players.length === 0 ? (
            <p className="text-gray-300">Nenhum jogador cadastrado.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-green-700">
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Posição</th>
                    <th className="px-4 py-2">Idade</th>
                    <th className="px-4 py-2">Time Atual</th>
                    <th className="px-4 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={index} className="border-b border-green-700/50">
                      <td className="px-4 py-2">{player.nome_jogador}</td>
                      <td className="px-4 py-2">{player.posicao_jogador}</td>
                      <td className="px-4 py-2">{player.idade}</td>
                      <td className="px-4 py-2">{player.nome_time || 'Sem time'}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => openModal(player)}
                          className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-1 px-3 rounded hover:from-green-700 hover:to-green-600 transition-all duration-200 text-sm"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-lg font-bold text-white shadow-md">
                  {selectedPlayer.nome_jogador?.charAt(0) || 'J'}
                </div>
                <h2 className="text-2xl font-bold text-white">Perfil do Jogador</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200"
              >
                ×
              </button>
            </div>

            {/* Info */}
            <div className="w-full flex flex-col items-center gap-6 mb-6">
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-white">{selectedPlayer.nome_jogador}</h3>
                <p className="text-gray-300">
                  {selectedPlayer.idade ? `${selectedPlayer.idade} anos` : 'Idade não informada'}
                  {selectedPlayer.nome_time && ` | ${selectedPlayer.nome_time}`}
                </p>
                <p className="text-green-400 font-medium">{selectedPlayer.posicao_jogador}</p>
              </div>

              {/* Foto */}
              <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 border border-green-700/30">
                <div className="text-center">
                  <div className="text-3xl mb-2">⚽</div>
                  <span className="text-sm">Foto do Jogador</span>
                </div>
              </div>

              {/* Físico */}
              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Informações Físicas</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-green-700/30">
                    <p className="text-gray-400 text-sm">Altura</p>
                    <p className="text-white font-semibold">
                      {selectedPlayer.altura_cm ? `${selectedPlayer.altura_cm} cm` : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-green-700/30">
                    <p className="text-gray-400 text-sm">Peso</p>
                    <p className="text-white font-semibold">
                      {selectedPlayer.peso_kg ? `${selectedPlayer.peso_kg} kg` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-green-700/30">
                    <p className="text-gray-400">Gols</p>
                    <p className="text-white font-semibold text-lg">{selectedPlayer.gols_marcados || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-green-700/30">
                    <p className="text-gray-400">Assistências</p>
                    <p className="text-white font-semibold text-lg">{selectedPlayer.assistencias || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-green-700/30">
                    <p className="text-gray-400">Passes Certos</p>
                    <p className="text-white font-semibold text-lg">{selectedPlayer.passes_certos || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-green-700/30">
                    <p className="text-gray-400">Finalizações</p>
                    <p className="text-white font-semibold text-lg">{selectedPlayer.finalizacoes || 0}</p>
                  </div>
                </div>
              </div>

              {/* Disciplina */}
              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Disciplina</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-600/30">
                    <p className="text-yellow-400">Cartões Amarelos</p>
                    <p className="text-white font-semibold text-lg">{selectedPlayer.cartoes_amarelos || 0}</p>
                  </div>
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-600/30">
                    <p className="text-red-400">Cartões Vermelhos</p>
                    <p className="text-white font-semibold text-lg">{selectedPlayer.cartoes_vermelhos || 0}</p>
                  </div>
                </div>
              </div>

              {/* Comentários (local, só visual) */}
              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Comentários</h4>
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário sobre o jogador..."
                    className="px-4 py-3 rounded-lg border border-green-700 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full resize-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full"
                    disabled={!newComment.trim()}
                  >
                    Adicionar Comentário
                  </button>
                </form>

                <div className="max-h-40 overflow-y-auto space-y-2">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-800/30 border border-green-700/30 rounded-lg p-3">
                        <p className="text-gray-300 text-sm mb-1">{comment.text}</p>
                        <p className="text-gray-500 text-xs">{comment.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-800/20 border border-gray-600/30 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Nenhum comentário ainda.</p>
                      <p className="text-gray-500 text-xs mt-1">Seja o primeiro a comentar sobre este jogador!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 px-8 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
