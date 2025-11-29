import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './ComparePlayers.css';

export default function ComparePlayers() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const playerIds = location.state?.playerIds || [];

  useEffect(() => {
    if (playerIds.length === 0) {
      navigate('/jogadores');
      return;
    }

    if (playerIds.length > 3) {
      alert('Você pode comparar no máximo 3 jogadores');
      navigate('/jogadores');
      return;
    }

    fetchPlayersData();
  }, [playerIds, token]);

  const fetchPlayersData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/jogador/comparar',
        { playerIds },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.ok) {
        setPlayers(response.data.jogadores);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      console.error('Erro ao buscar jogadores:', err);
      setError('Erro ao carregar dados dos jogadores');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverall = (stats) => {
    if (!stats) return 0;
    const weights = {
      gols_marcados: 0.15,
      assistencias: 0.12,
      passes_certos: 0.1,
      finalizacoes: 0.1,
      drible: 0.13,
      roubadas_bola: 0.1,
      aceleracao: 0.1,
      chute_forca: 0.1,
      passe_total: 0.1
    };

    let total = 0;
    let maxPossible = 0;

    Object.keys(weights).forEach(key => {
      if (stats[key] !== undefined) {
        total += (stats[key] || 0) * weights[key];
        maxPossible += 100 * weights[key];
      }
    });

    return maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
  };

  const getStatColor = (value) => {
    if (value >= 80) return '#10b981'; // green
    if (value >= 60) return '#3b82f6'; // blue
    if (value >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const compareStats = (statKey) => {
    const values = players.map(p => p.Estatistica?.[statKey] || 0);
    const maxValue = Math.max(...values);
    
    return values.map(value => ({
      value,
      isBest: value === maxValue && maxValue > 0
    }));
  };

  if (isLoading) {
    return (
      <div className="compare-page">
        <SideBar_Olheiro />
        <div className="compare-content">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="compare-page">
        <SideBar_Olheiro />
        <div className="compare-content">
          <div className="error">{error}</div>
          <button onClick={() => navigate('/jogadores')} className="back-button">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const statsToCompare = [
    { key: 'gols_marcados', label: 'Gols' },
    { key: 'assistencias', label: 'Assistências' },
    { key: 'passes_certos', label: 'Passes Certos' },
    { key: 'finalizacoes', label: 'Finalizações' },
    { key: 'drible', label: 'Dribles' },
    { key: 'roubadas_bola', label: 'Roubadas de Bola' },
    { key: 'aceleracao', label: 'Aceleração' },
    { key: 'chute_forca', label: 'Força de Chute' },
    { key: 'passe_total', label: 'Passes Totais' },
    { key: 'cartoes_amarelos', label: 'Cartões Amarelos' },
    { key: 'cartoes_vermelhos', label: 'Cartões Vermelhos' }
  ];

  return (
    <div className="compare-page">
      <SideBar_Olheiro />
      <div className="compare-content">
        <div className="compare-header">
          <h1>Comparação de Jogadores</h1>
          <button onClick={() => navigate('/jogadores')} className="back-button">
            ← Voltar
          </button>
        </div>

        <div className="players-comparison">
          {players.map((player, index) => (
            <div key={player.id_jogador} className="player-card">
              <div className="player-header">
                <h2>{player.nome_jogador}</h2>
                <div className="player-position">{player.posicao_jogador}</div>
                <div className="overall-rating" style={{ backgroundColor: getStatColor(calculateOverall(player.Estatistica)) }}>
                  {calculateOverall(player.Estatistica)}
                </div>
              </div>

              <div className="player-basic-info">
                <div className="info-item">
                  <span className="info-label">Time:</span>
                  <span className="info-value">{player.Time?.nome_time || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Idade:</span>
                  <span className="info-value">{player.idade || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Altura:</span>
                  <span className="info-value">{player.altura_cm ? `${player.altura_cm} cm` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Peso:</span>
                  <span className="info-value">{player.peso_kg ? `${player.peso_kg} kg` : 'N/A'}</span>
                </div>
              </div>

              <div className="player-stats">
                {statsToCompare.map((stat) => {
                  const comparison = compareStats(stat.key);
                  const currentValue = comparison[index];
                  
                  return (
                    <div key={stat.key} className={`stat-row ${currentValue.isBest ? 'best-stat' : ''}`}>
                      <span className="stat-label">{stat.label}</span>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar"
                          style={{ 
                            width: `${Math.min(currentValue.value, 100)}%`,
                            backgroundColor: currentValue.isBest ? '#10b981' : '#3b82f6'
                          }}
                        />
                        <span className="stat-value">{currentValue.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="comparison-summary">
          <h3>Resumo da Comparação</h3>
          <div className="summary-content">
            {players.map((player, index) => {
              const overall = calculateOverall(player.Estatistica);
              return (
                <div key={player.id_jogador} className="summary-item">
                  <span className="summary-player">{player.nome_jogador}</span>
                  <span className="summary-rating" style={{ color: getStatColor(overall) }}>
                    Rating: {overall}/100
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
