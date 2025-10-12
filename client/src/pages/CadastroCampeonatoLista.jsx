import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import { AuthContext } from '../context/AuthContext';

export default function CadastroCampeonatoLista() {
  const { token } = useContext(AuthContext);

  const [campeonatos, setCampeonatos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setCampeonatos(Array.isArray(payload) ? payload : []);
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

  return (
    <div className="flex min-h-screen bg-black flex-col">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border pt-16 sm:pt-20">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-4xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
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

          <Link
            to="/cadastrocampeonato"
            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200 mb-8"
          >
            Adicionar Campeonato
          </Link>

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
                    <th className="px-4 py-2">Data Início</th>
                    <th className="px-4 py-2">Data Fim</th>
                    <th className="px-4 py-2">Local</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampeonatos.map((camp, index) => (
                    <tr key={index} className="border-b border-green-700/50">
                      <td className="px-4 py-2">{camp.nome_campeonato}</td>
                      <td className="px-4 py-2">{camp.data_inicio}</td>
                      <td className="px-4 py-2">{camp.data_fim}</td>
                      <td className="px-4 py-2">{camp.local_campeonato}</td>
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
