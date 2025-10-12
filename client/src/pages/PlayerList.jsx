import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function PlayerList() {
  const { token } = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = "http://localhost:5000/api/jogador/listar";

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayers(response.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar jogadores.");
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
          <Link
            to="/cadastrojogador"
            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200 mb-8"
          >
            Adicionar Jogador
          </Link>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-green-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Detalhes do Jogador</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="space-y-3">
                <div>
                  <label className="text-green-400 font-semibold">Nome:</label>
                  <p className="text-white">{selectedPlayer.nome_jogador}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Posição:</label>
                  <p className="text-white">{selectedPlayer.posicao_jogador}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Time Atual:</label>
                  <p className="text-white">{selectedPlayer.nome_time || 'Sem time'}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Idade:</label>
                  <p className="text-white">{selectedPlayer.idade || 'Não informado'}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Altura:</label>
                  <p className="text-white">{selectedPlayer.altura_cm ? `${selectedPlayer.altura_cm} cm` : 'Não informado'}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Peso:</label>
                  <p className="text-white">{selectedPlayer.peso_kg ? `${selectedPlayer.peso_kg} kg` : 'Não informado'}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-green-400 font-semibold">Gols Marcados:</label>
                  <p className="text-white">{selectedPlayer.gols_marcados || 0}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Assistências:</label>
                  <p className="text-white">{selectedPlayer.assistencias || 0}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Passes Certos:</label>
                  <p className="text-white">{selectedPlayer.passes_certos || 0}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Finalizações:</label>
                  <p className="text-white">{selectedPlayer.finalizacoes || 0}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Cartões Amarelos:</label>
                  <p className="text-white">{selectedPlayer.cartoes_amarelos || 0}</p>
                </div>
                
                <div>
                  <label className="text-green-400 font-semibold">Cartões Vermelhos:</label>
                  <p className="text-white">{selectedPlayer.cartoes_vermelhos || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
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