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

  return (
    <div className="flex min-h-screen bg-black flex-col">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border pt-16 sm:pt-20">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-4xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
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
