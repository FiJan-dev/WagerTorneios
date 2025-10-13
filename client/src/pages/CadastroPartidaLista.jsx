import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import { AuthContext } from '../context/AuthContext';

export default function CadastroPartidaLista() {
  const { token, isAdmin } = useContext(AuthContext);

  const [partidas, setPartidas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partidaToDelete, setPartidaToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_URL = 'http://localhost:5000/api/partida/listarP';

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
    if (!partidaToDelete || !token) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/partida/deletar/${partidaToDelete.id_partida}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        // Remove a partida da lista local
        setPartidas(prev => prev.filter(p => p.id_partida !== partidaToDelete.id_partida));
        closeDeleteModal();
        alert('Partida removida com sucesso!');
      } else {
        alert(response.data.msg || 'Erro ao remover partida.');
      }
    } catch (err) {
      console.error('Erro ao deletar partida:', err);
      alert('Erro ao remover partida. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black flex-col">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border pt-16 sm:pt-20">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-7xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              P
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
            Lista de Partidas
          </h1>
          <p className="text-center text-gray-300 text-base mb-6">
            Visualize e gerencie as partidas cadastradas
          </p>
          {isAdmin() && (
            <Link
              to="/cadastropartida"
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200 mb-8"
            >
              Adicionar Partida
            </Link>
          )}
          {isLoading ? (
            <p className="text-gray-300">Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : partidas.length === 0 ? (
            <p className="text-gray-300">Nenhuma partida cadastrada.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-green-700">
                    <th className="px-4 py-2">Campeonato</th>
                    <th className="px-4 py-2">Time Casa</th>
                    <th className="px-4 py-2">Time Visitante</th>
                    <th className="px-4 py-2">Placar</th>
                    <th className="px-4 py-2">Data/Hora</th>
                    <th className="px-4 py-2">Local</th>
                    <th className="px-4 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {partidas.map((partida, index) => (
                    <tr key={index} className="border-b border-green-700/50">
                      <td className="px-4 py-2">{partida.nome_campeonato}</td>
                      <td className="px-4 py-2">{partida.nome_time_casa}</td>
                      <td className="px-4 py-2">{partida.nome_time_visitante}</td>
                      <td className="px-4 py-2">
                        {`${partida.placar_casa} x ${partida.placar_visitante}`}
                      </td>
                      <td className="px-4 py-2">{partida.data_partida}</td>
                      <td className="px-4 py-2">{partida.local_partida}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => openModal(partida)}
                            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-1 px-3 rounded hover:from-green-700 hover:to-green-600 transition-all duration-200 text-sm"
                          >
                            Detalhes
                          </button>
                          {isAdmin() && (
                            <button
                              onClick={() => openDeleteModal(partida)}
                              className="bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-1 px-2 rounded hover:from-red-700 hover:to-red-600 transition-all duration-200 text-sm flex items-center justify-center"
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
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedPartida && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-lg font-bold text-white shadow-md">
                  P
                </div>
                <h2 className="text-2xl font-bold text-white">Detalhes da Partida</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200"
              >
                ×
              </button>
            </div>

            <div className="w-full flex flex-col gap-6 mb-6">
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-white text-center">{selectedPartida.nome_campeonato}</h3>
                <p className="text-green-400 font-medium text-center">{selectedPartida.local_partida}</p>
              </div>

              {/* Confronto */}
              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Confronto</h4>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-gray-400 text-sm">Time Casa</p>
                      <p className="text-white font-semibold text-lg">{selectedPartida.nome_time_casa}</p>
                    </div>
                    <div className="mx-4">
                      <div className="text-2xl font-bold text-green-400">
                        {selectedPartida.placar_casa} × {selectedPartida.placar_visitante}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-gray-400 text-sm">Time Visitante</p>
                      <p className="text-white font-semibold text-lg">{selectedPartida.nome_time_visitante}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações da partida */}
              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Informações da Partida</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                    <p className="text-gray-400 text-sm mb-1">Data e Horário</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedPartida.data_partida).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                    <p className="text-gray-400 text-sm mb-1">Local</p>
                    <p className="text-white font-semibold">{selectedPartida.local_partida}</p>
                  </div>
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

      {/* Modal de Confirmação de Delete */}
      {isDeleteModalOpen && partidaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-sm border border-red-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                !
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirmar Remoção</h2>
                <p className="text-gray-300 text-sm">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Tem certeza que deseja remover a partida:
              </p>
              <p className="text-white font-semibold text-lg">
                {partidaToDelete.nome_time_casa} × {partidaToDelete.nome_time_visitante}
              </p>
              <p className="text-gray-400 text-sm">
                {partidaToDelete.nome_campeonato} • {new Date(partidaToDelete.data_partida).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="bg-gray-700 text-gray-300 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePartida}
                disabled={isDeleting}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-red-700 hover:to-red-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
