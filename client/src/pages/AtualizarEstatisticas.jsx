import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './AtualizarEstatisticas.css';

function AtualizarEstatisticas() {
  const { id } = useParams();
  const { token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jogador, setJogador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [estatisticas, setEstatisticas] = useState({
    passes_certos: 0,
    gols_marcados: 0,
    assistencias: 0,
    cartoes_amarelos: 0,
    cartoes_vermelhos: 0,
    finalizacoes: 0,
    roubadas_bola: 0,
    aceleracao: 0,
    chute_forca: 0,
    passe_total: 0,
    drible: 0,
  });

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/jogadores');
      return;
    }

    const fetchJogador = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          `http://localhost:5000/api/jogador/estatisticas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = resp?.data;

        if (data && data.ok === false) {
          setError(data.msg || 'Erro ao carregar jogador.');
          return;
        }

        if (data && data.jogador) {
          setJogador(data.jogador);
          
          // Carregar estatísticas existentes
          const stats = data.estatisticas || {};
          setEstatisticas({
            passes_certos: stats.passes_certos || 0,
            gols_marcados: stats.gols_marcados || 0,
            assistencias: stats.assistencias || 0,
            cartoes_amarelos: stats.cartoes_amarelos || 0,
            cartoes_vermelhos: stats.cartoes_vermelhos || 0,
            finalizacoes: stats.finalizacoes || 0,
            roubadas_bola: stats.roubadas_bola || 0,
            aceleracao: stats.aceleracao || 0,
            chute_forca: stats.chute_forca || 0,
            passe_total: stats.passe_total || 0,
            drible: stats.drible || 0,
          });
        }
      } catch (err) {
        console.error('Erro ao carregar jogador:', err);
        setError('Erro ao carregar dados do jogador.');
      } finally {
        setLoading(false);
      }
    };

    fetchJogador();
  }, [id, token, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstatisticas((prev) => ({ 
      ...prev, 
      [name]: parseInt(value) || 0 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const resp = await axios.put(
        `http://localhost:5000/api/jogador/estatisticas/${id}`,
        estatisticas,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = resp?.data;

      if (data && data.ok === false) {
        setError(data.msg || 'Erro ao atualizar estatísticas.');
        return;
      }

      setSuccess('Estatísticas atualizadas com sucesso!');
      setTimeout(() => {
        navigate('/jogadores');
      }, 1500);
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      const msg = err?.response?.data?.msg || err?.message || 'Erro ao atualizar estatísticas.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='atualizar-stats-page'>
        <SideBar_Olheiro />
        <div className='stats-container'>
          <div className='loading-message'>Carregando...</div>
        </div>
      </div>
    );
  }

  if (!jogador) {
    return (
      <div className='atualizar-stats-page'>
        <SideBar_Olheiro />
        <div className='stats-container'>
          <div className='error-message'>Jogador não encontrado.</div>
          <Link to='/jogadores' className='btn-back'>
            Voltar para Lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='atualizar-stats-page'>
      <SideBar_Olheiro />
      
      <div className='stats-container'>
        <div className='stats-card'>
          <div className='stats-header'>
            <h2 className='stats-title'>Atualizar Estatísticas</h2>
            <div className='player-info'>
              <p className='player-name'>{jogador.nome_jogador}</p>
              <p className='player-details'>
                {jogador.posicao_jogador} • {jogador.nome_time}
              </p>
            </div>
          </div>

          {error && <div className='error-message'>{error}</div>}
          {success && <div className='success-message'>{success}</div>}

          <form onSubmit={handleSubmit} className='stats-form'>
            {/* Estatísticas Ofensivas */}
            <div className='form-section'>
              <h3 className='section-title'>Estatísticas Ofensivas</h3>
              
              <div className='stats-grid'>
                <div className='form-field'>
                  <label className='form-label'>Gols Marcados</label>
                  <input
                    type='number'
                    name='gols_marcados'
                    value={estatisticas.gols_marcados}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Assistências</label>
                  <input
                    type='number'
                    name='assistencias'
                    value={estatisticas.assistencias}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Finalizações</label>
                  <input
                    type='number'
                    name='finalizacoes'
                    value={estatisticas.finalizacoes}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Força de Chute</label>
                  <input
                    type='number'
                    name='chute_forca'
                    value={estatisticas.chute_forca}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>
              </div>
            </div>

            {/* Estatísticas de Passe */}
            <div className='form-section'>
              <h3 className='section-title'>Estatísticas de Passe</h3>
              
              <div className='stats-grid'>
                <div className='form-field'>
                  <label className='form-label'>Passes Certos</label>
                  <input
                    type='number'
                    name='passes_certos'
                    value={estatisticas.passes_certos}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Total de Passes</label>
                  <input
                    type='number'
                    name='passe_total'
                    value={estatisticas.passe_total}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>
              </div>
            </div>

            {/* Estatísticas Defensivas */}
            <div className='form-section'>
              <h3 className='section-title'>Estatísticas Defensivas</h3>
              
              <div className='stats-grid'>
                <div className='form-field'>
                  <label className='form-label'>Roubadas de Bola</label>
                  <input
                    type='number'
                    name='roubadas_bola'
                    value={estatisticas.roubadas_bola}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>
              </div>
            </div>

            {/* Estatísticas Físicas */}
            <div className='form-section'>
              <h3 className='section-title'>Estatísticas Físicas e Técnicas</h3>
              
              <div className='stats-grid'>
                <div className='form-field'>
                  <label className='form-label'>Aceleração</label>
                  <input
                    type='number'
                    name='aceleracao'
                    value={estatisticas.aceleracao}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Drible</label>
                  <input
                    type='number'
                    name='drible'
                    value={estatisticas.drible}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>
              </div>
            </div>

            {/* Cartões */}
            <div className='form-section'>
              <h3 className='section-title'>Disciplina</h3>
              
              <div className='stats-grid'>
                <div className='form-field'>
                  <label className='form-label'>Cartões Amarelos</label>
                  <input
                    type='number'
                    name='cartoes_amarelos'
                    value={estatisticas.cartoes_amarelos}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>

                <div className='form-field'>
                  <label className='form-label'>Cartões Vermelhos</label>
                  <input
                    type='number'
                    name='cartoes_vermelhos'
                    value={estatisticas.cartoes_vermelhos}
                    onChange={handleChange}
                    min='0'
                    className='form-input'
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className='form-actions'>
              <Link to='/jogadores' className='btn-cancel'>
                Cancelar
              </Link>
              <button
                type='submit'
                disabled={saving}
                className='btn-submit'
              >
                {saving ? 'Salvando...' : 'Salvar Estatísticas'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AtualizarEstatisticas;
