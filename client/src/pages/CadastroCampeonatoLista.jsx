import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import { AuthContext } from '../context/AuthContext';

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
    <div className="flex min-h-screen bg-black flex-col">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border pt-16 sm:pt-20">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-7xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              C
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
            Lista de Campeonatos
          </h1>
          <p className="text-center text-gray-300 text-base mb-6">
            Visualize e gerencie os campeonatos cadastrados
          </p>

          {isAdmin() && (
            <Link
              to="/cadastrocampeonato"
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200 mb-8"
            >
              Adicionar Campeonato
            </Link>
          )}

          <div className="w-full mb-4">
            <label htmlFor="search" className="sr-only">
              Pesquisar campeonatos
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome do campeonato..."
              className="w-full bg-gray-800 text-gray-200 placeholder-gray-400 border border-green-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {isLoading ? (
            <p className="text-gray-300">Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : lista.length === 0 ? (
            <p className="text-gray-300">Nenhum campeonato cadastrado.</p>
          ) : filteredCampeonatos.length === 0 ? (
            <p className="text-gray-300">Nenhum campeonato encontrado para a pesquisa.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-green-700">
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Data Início</th>
                    <th className="px-4 py-2">Data Fim</th>
                    <th className="px-4 py-2">Local</th>
                    <th className="px-4 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampeonatos.map((camp, index) => {
                    const status = verificarStatus(camp.data_inicio, camp.data_fim);
                    return (
                    <tr key={index} className="border-b border-green-700/50">
                      <td className="px-4 py-2">{camp.nome_campeonato}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status.status === 'ativo' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                          status.status === 'futuro' ? 'bg-blue-900/30 text-blue-400 border border-blue-700' :
                          'bg-red-900/30 text-red-400 border border-red-700'
                        }`}>
                          {status.texto}
                        </span>
                      </td>
                      <td className="px-4 py-2">{formatarData(camp.data_inicio)}</td>
                      <td className="px-4 py-2">{formatarData(camp.data_fim)}</td>
                      <td className="px-4 py-2">{camp.local_campeonato}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => openModal(camp)}
                            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-1 px-3 rounded hover:from-green-700 hover:to-green-600 transition-all duration-200 text-sm"
                          >
                            Detalhes
                          </button>
                          {isAdmin() && (
                            <button
                              onClick={() => openDeleteModal(camp)}
                              className="bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-1 px-2 rounded hover:from-red-700 hover:to-red-600 transition-all duration-200 text-sm flex items-center justify-center"
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
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedCampeonato && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-lg font-bold text-white shadow-md">
                  C
                </div>
                <h2 className="text-2xl font-bold text-white">Detalhes do Campeonato</h2>
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
                <h3 className="text-xl font-semibold text-white text-center">{selectedCampeonato.nome_campeonato}</h3>
                <p className="text-green-400 font-medium text-center">{selectedCampeonato.local_campeonato}</p>
                <div className="mt-2">
                  {(() => {
                    const status = verificarStatus(selectedCampeonato.data_inicio, selectedCampeonato.data_fim);
                    return (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        status.status === 'ativo' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                        status.status === 'futuro' ? 'bg-blue-900/30 text-blue-400 border border-blue-700' :
                        'bg-red-900/30 text-red-400 border border-red-700'
                      }`}>
                        {status.texto}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-3 text-center">Informações do Evento</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                    <p className="text-gray-400 text-sm mb-1">Data de Início</p>
                    <p className="text-white font-semibold text-lg">
                      {formatarData(selectedCampeonato.data_inicio, 'extenso')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                    <p className="text-gray-400 text-sm mb-1">Data de Término</p>
                    <p className="text-white font-semibold text-lg">
                      {formatarData(selectedCampeonato.data_fim, 'extenso')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                    <p className="text-gray-400 text-sm mb-1">Duração</p>
                    <p className="text-white font-semibold">
                      {calcularDuracao(selectedCampeonato.data_inicio, selectedCampeonato.data_fim)}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30">
                    <p className="text-gray-400 text-sm mb-1">Localização</p>
                    <p className="text-white font-semibold">{selectedCampeonato.local_campeonato}</p>
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
      {isDeleteModalOpen && campeonatoToDelete && (
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
                Tem certeza que deseja remover o campeonato:
              </p>
              <p className="text-white font-semibold text-lg">
                {campeonatoToDelete.nome_campeonato}
              </p>
              <p className="text-gray-400 text-sm">
                {campeonatoToDelete.local_campeonato} • {formatarData(campeonatoToDelete.data_inicio)} a {formatarData(campeonatoToDelete.data_fim)}
              </p>
              <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ <strong>Atenção:</strong> Só é possível deletar campeonatos que não possuem partidas associadas.
                </p>
              </div>
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
                onClick={handleDeleteCampeonato}
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
