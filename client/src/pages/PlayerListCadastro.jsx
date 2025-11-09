import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './PlayerListCadastro.css';

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
    <div className='player-cadastro-page'>
      <SideBar_Olheiro />
      
      <div className='cadastro-container'>
        <div className='cadastro-card'>
          <div className='cadastro-header'>
            <h2 className='cadastro-title'>Cadastrar Jogador</h2>
            <p className='cadastro-subtitle'>Preencha as informações do novo jogador</p>
          </div>

          {error && <div className='error-message'>{error}</div>}

          <form onSubmit={handleSubmit} className='cadastro-form'>
            {/* Informações Básicas */}
            <div className='form-section'>
              <h3 className='section-title'>Informações Básicas</h3>
              
              <div className='form-field'>
                <label className='form-label'>
                  Nome do Jogador <span className='required'>*</span>
                </label>
                <input
                  type='text'
                  name='nome_jogador'
                  value={formData.nome_jogador}
                  onChange={handleChange}
                  required
                  placeholder='Digite o nome completo'
                  className='form-input'
                />
              </div>

              <div className='form-field'>
                <label className='form-label'>
                  Categoria da Posição <span className='required'>*</span>
                </label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => {
                    setCategoriaSelecionada(e.target.value);
                    setFormData({...formData, posicao_jogador: ''});
                  }}
                  className='form-select'
                  required
                >
                  <option value=''>Selecione a categoria</option>
                  {categoriasGerais.map(categoria => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>

              {categoriaSelecionada && (
                <div className='form-field'>
                  <label className='form-label'>
                    Posição Específica <span className='required'>*</span>
                  </label>
                  <select
                    value={formData.posicao_jogador}
                    onChange={(e) => setFormData({...formData, posicao_jogador: e.target.value})}
                    className='form-select'
                    required
                  >
                    <option value=''>Selecione a posição</option>
                    {posicoesPorCategoria[categoriaSelecionada]?.map(posicao => (
                      <option key={posicao.value} value={posicao.value}>
                        {posicao.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className='form-field'>
                <label className='form-label'>
                  Nome do Time <span className='required'>*</span>
                </label>
                <input
                  type='text'
                  name='nome_time'
                  value={formData.nome_time}
                  onChange={handleChange}
                  required
                  placeholder='Digite o nome do time'
                  className='form-input'
                />
              </div>
            </div>

            {/* Informações Físicas */}
            <div className='form-section'>
              <h3 className='section-title'>Informações Físicas</h3>
              
              <div className='form-group two-columns'>
                <div className='form-field'>
                  <label className='form-label'>
                    Altura (cm) <span className='required'>*</span>
                  </label>
                  <input
                    type='number'
                    name='altura_cm'
                    value={formData.altura_cm}
                    onChange={handleChange}
                    required
                    min='0'
                    placeholder='Ex: 180'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>
                    Peso (kg) <span className='required'>*</span>
                  </label>
                  <input
                    type='number'
                    name='peso_kg'
                    value={formData.peso_kg}
                    onChange={handleChange}
                    required
                    min='0'
                    placeholder='Ex: 75'
                    className='form-input'
                  />
                </div>
              </div>

              <div className='form-field'>
                <label className='form-label'>
                  Idade <span className='required'>*</span>
                </label>
                <input
                  type='number'
                  name='idade'
                  value={formData.idade}
                  onChange={handleChange}
                  required
                  min='0'
                  placeholder='Ex: 25'
                  className='form-input'
                />
              </div>
            </div>

            {/* Estatísticas */}
            <div className='form-section'>
              <h3 className='section-title'>Estatísticas</h3>
              
              <div className='stats-grid'>
                <div className='form-field'>
                  <label className='form-label'>Passes Certos</label>
                  <input
                    type='number'
                    name='passes_certos'
                    value={formData.passes_certos}
                    onChange={handleChange}
                    min='0'
                    placeholder='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Gols Marcados</label>
                  <input
                    type='number'
                    name='gols_marcados'
                    value={formData.gols_marcados}
                    onChange={handleChange}
                    min='0'
                    placeholder='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Assistências</label>
                  <input
                    type='number'
                    name='assistencias'
                    value={formData.assistencias}
                    onChange={handleChange}
                    min='0'
                    placeholder='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Finalizações</label>
                  <input
                    type='number'
                    name='finalizacoes'
                    value={formData.finalizacoes}
                    onChange={handleChange}
                    min='0'
                    placeholder='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Cartões Amarelos</label>
                  <input
                    type='number'
                    name='cartoes_amarelos'
                    value={formData.cartoes_amarelos}
                    onChange={handleChange}
                    min='0'
                    placeholder='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Cartões Vermelhos</label>
                  <input
                    type='number'
                    name='cartoes_vermelhos'
                    value={formData.cartoes_vermelhos}
                    onChange={handleChange}
                    min='0'
                    placeholder='0'
                    className='form-input'
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className='form-actions'>
              <Link to='/dashboard' className='btn-cancel'>
                Cancelar
              </Link>
              <button
                type='submit'
                disabled={loading}
                className='btn-submit'
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Jogador'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerListCadastro;
