import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

function PlayerListCadastro() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Categorias gerais de posições
  const categoriasGerais = [
    { value: 'GOL', label: 'GOL - Goleiro' },
    { value: 'DEF', label: 'DEF - Defesa' },
    { value: 'MEI', label: 'MEI - Meio-campo' },
    { value: 'ATA', label: 'ATA - Ataque' },
  ];

  // Posições específicas por categoria
  const posicoesPorCategoria = {
    GOL: [
      { value: 'GOL', label: 'GOL - Goleiro' },
    ],
    DEF: [
      { value: 'ZAG', label: 'ZAG - Zagueiro' },
      { value: 'LD', label: 'LD - Lateral Direito' },
      { value: 'LE', label: 'LE - Lateral Esquerdo' },
    ],
    MEI: [
      { value: 'VOL', label: 'VOL - Volante' },
      { value: 'MC', label: 'MC - Meio-campo Central' },
      { value: 'MD', label: 'MD - Meio-campo Direito' },
      { value: 'ME', label: 'ME - Meio-campo Esquerdo' },
      { value: 'MEI', label: 'MEI - Meia' },
    ],
    ATA: [
      { value: 'ATA', label: 'ATA - Atacante' },
      { value: 'PD', label: 'PD - Ponta Direita' },
      { value: 'PE', label: 'PE - Ponta Esquerda' },
    ]
  };

  // Estado para categoria selecionada
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [formData, setFormData] = useState({
    nome_jogador: '',
    posicao_jogador: '',
    nome_time: '',
    altura_cm: '',
    peso_kg: '',
    idade: '',
    passes_certos: 0,
    gols_marcados: 0,
    assistencias: 0,
    cartoes_amarelos: 0,
    cartoes_vermelhos: 0,
    finalizacoes: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizeInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        altura_cm: normalizeInt(formData.altura_cm),
        peso_kg: normalizeInt(formData.peso_kg),
        idade: normalizeInt(formData.idade),
        passes_certos: normalizeInt(formData.passes_certos),
        gols_marcados: normalizeInt(formData.gols_marcados),
        assistencias: normalizeInt(formData.assistencias),
        cartoes_amarelos: normalizeInt(formData.cartoes_amarelos),
        cartoes_vermelhos: normalizeInt(formData.cartoes_vermelhos),
        finalizacoes: normalizeInt(formData.finalizacoes),
      };

      const resp = await axios.post(
        'http://localhost:5000/api/jogador/cadastrar',
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const body = resp?.data;

      // authSoft: 200 + { ok:false, msg: '...' }
      if (body && typeof body === 'object' && body.ok === false) {
        setError(body.msg || 'Acesso não permitido.');
        return;
      }

      alert('Jogador registrado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.msg ||
        data?.error ||
        (Array.isArray(data) ? data.join('; ') : null) ||
        err?.message ||
        'Erro ao registrar jogador.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className='flex min-h-screen bg-black'>
      <SideBar_Olheiro />
      <div className='flex justify-center items-start min-h-screen w-full p-4 pt-16 box-border'>
        <div className='bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full'>
          <h2 className='text-2xl sm:text-3xl text-center font-bold text-white mb-2'>
            Cadastrar Jogador
          </h2>

          {error && <p className='text-center text-red-400 text-sm mb-2'>{error}</p>}

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Nome do Jogador</label>
              <input
                type='text'
                name='nome_jogador'
                value={formData.nome_jogador}
                onChange={handleChange}
                required
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

                {/* Categoria da Posição */}
                <div>
                  <label className="text-gray-300">
                    Categoria da Posição
                  </label>
                  <select
                    value={categoriaSelecionada}
                    onChange={(e) => {
                      setCategoriaSelecionada(e.target.value);
                      setFormData({...formData, posicao_jogador: ''}); // Limpa posição específica
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {categoriasGerais.map(categoria => (
                      <option key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Posição Específica */}
                {categoriaSelecionada && (
                  <div>
                    <label className="text-gray-300">
                      Posição Específica
                    </label>
                    <select
                      value={formData.posicao_jogador}
                      onChange={(e) => setFormData({...formData, posicao_jogador: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    >
                      <option value="">Selecione a posição</option>
                      {posicoesPorCategoria[categoriaSelecionada]?.map(posicao => (
                        <option key={posicao.value} value={posicao.value}>
                          {posicao.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Nome do Time</label>
              <input
                type='text'
                name='nome_time'
                value={formData.nome_time}
                onChange={handleChange}
                required
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Altura (cm)</label>
              <input
                type='number'
                name='altura_cm'
                value={formData.altura_cm}
                onChange={handleChange}
                required
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Peso (kg)</label>
              <input
                type='number'
                name='peso_kg'
                value={formData.peso_kg}
                onChange={handleChange}
                required
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Idade</label>
              <input
                type='number'
                name='idade'
                value={formData.idade}
                onChange={handleChange}
                required
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Passes Certos</label>
              <input
                type='number'
                name='passes_certos'
                value={formData.passes_certos}
                onChange={handleChange}
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Gols Marcados</label>
              <input
                type='number'
                name='gols_marcados'
                value={formData.gols_marcados}
                onChange={handleChange}
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Assistências</label>
              <input
                type='number'
                name='assistencias'
                value={formData.assistencias}
                onChange={handleChange}
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Cartões Amarelos</label>
              <input
                type='number'
                name='cartoes_amarelos'
                value={formData.cartoes_amarelos}
                onChange={handleChange}
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Cartões Vermelhos</label>
              <input
                type='number'
                name='cartoes_vermelhos'
                value={formData.cartoes_vermelhos}
                onChange={handleChange}
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-300'>Finalizações</label>
              <input
                type='number'
                name='finalizacoes'
                value={formData.finalizacoes}
                onChange={handleChange}
                min='0'
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none w-full'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full'
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerListCadastro;
