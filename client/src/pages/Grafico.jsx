import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const GraficoDados = () => {
  const { id } = useParams();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!token) {
        setError('Você precisa estar logado para ver estas estatísticas.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching stats for ID: ${id} with token: ${token ? 'present' : 'absent'}`);
        const response = await axios.get(`http://localhost:5000/api/jogador/grafico/${id}`, { // URL explícita
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);
        if (response.data.ok) {
          setPlayerStats(response.data.data);
        } else {
          setError(response.data.msg || 'Erro ao carregar estatísticas');
        }
      } catch (err) {
        console.error('Fetch Error:', err.response ? err.response.data : err.message);
        setError(`Erro ao conectar com o servidor: ${err.response?.status} - ${err.response?.data?.msg || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [id, token]);

  const populateTable = () => {
    if (!playerStats || !playerStats.rawStats) return null;

    const categories = {
      Físico: [
        { label: 'Chute Força', value: playerStats.rawStats.chute_forca || 0 },
        { label: 'Aceleração', value: playerStats.rawStats.aceleracao || 0 },
      ],
      Defesa: [
        { label: 'Roubadas Bola', value: playerStats.rawStats.roubadas_bola || 0 },
      ],
      Velocidade: [
        { label: 'Aceleração', value: playerStats.rawStats.aceleracao || 0 },
      ],
      Chute: [
        { label: 'Chute Força', value: playerStats.rawStats.chute_forca || 0 },
        { label: 'Gols Marcados', value: playerStats.rawStats.gols_marcados || 0 },
      ],
      Passe: [
        { label: 'Passe Total', value: playerStats.rawStats.passe_total || 0 },
        { label: 'Passes Certos', value: playerStats.rawStats.passes_certos || 0 },
        { label: 'Assistências', value: playerStats.rawStats.assistencias || 0 },
      ],
      Drible: [
        { label: 'Drible', value: playerStats.rawStats.drible || 0 },
      ],
      Finalização: [
        { label: 'Finalizações', value: playerStats.rawStats.finalizacoes || 0 },
        { label: 'Gols Marcados', value: playerStats.rawStats.gols_marcados || 0 },
      ],
      Cartões: [
        { label: 'Cartões Amarelos', value: playerStats.rawStats.cartoes_amarelos || 0 },
        { label: 'Cartões Vermelhos', value: playerStats.rawStats.cartoes_vermelhos || 0 },
      ],
    };

    return (
      <table className="w-full text-left bg-[rgba(17,24,39,0.5)] border border-[var(--color-border)] rounded-lg shadow-lg backdrop-blur-md">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="py-3 px-4 text-[var(--color-text-primary)] font-semibold">Estatística</th>
            <th className="py-3 px-4 text-[var(--color-text-primary)] font-semibold">Valor</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categories).map(([category, stats], categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              <tr className="bg-[rgba(59,130,246,0.05)] border-b border-[var(--color-border)]">
                <td className="py-2 px-4 text-[var(--color-text-primary)] font-semibold" colSpan={2}>
                  {category}
                </td>
              </tr>
              {stats.map((stat, statIndex) => (
                <tr
                  key={`${category}-${statIndex}`}
                  className="border-b border-[var(--color-border)] hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                >
                  <td className="py-2 px-4 text-[var(--color-text-secondary)]">{stat.label}</td>
                  <td className="py-2 px-4 text-green-400 font-medium">{stat.value}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  const createRadarChart = () => {
    if (!playerStats || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: playerStats.labels,
        datasets: [{
          label: `Estatísticas de ${playerStats.nome}`,
          data: playerStats.valores,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        }],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(59, 130, 246, 0.1)' },
            angleLines: { color: 'rgba(59, 130, 246, 0.1)' },
          },
        },
        plugins: {
          legend: { display: true, labels: { color: '#9ca3af' } },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                const label = tooltipItem.label || '';
                const value = tooltipItem.raw || 0;
                if (label === 'Passe') {
                  const accuracy = (playerStats.rawStats.passe_total || 0) > 0
                    ? ((playerStats.rawStats.passes_certos || 0) / (playerStats.rawStats.passe_total || 1) * 100).toFixed(2) + '%'
                    : 'N/A';
                  return `${label}: ${value} (% de Acerto: ${accuracy})`;
                }
                if (label === 'Finalização') {
                  const accuracy = (playerStats.rawStats.gols_marcados || 0) > 0
                    ? ((playerStats.rawStats.gols_marcados || 0) / (playerStats.rawStats.finalizacoes || 1) * 100).toFixed(2) + '%'
                    : 'N/A';
                  return `${label}: ${value} (% de Acerto: ${accuracy})`;
                }
                if (label === 'Físico') {
                  const average = (playerStats.rawStats.chute_forca || 0) > 0 && (playerStats.rawStats.aceleracao || 0) > 0
                    ? (((playerStats.rawStats.chute_forca || 0) + (playerStats.rawStats.aceleracao || 0)) / 2).toFixed(2)
                    : 'N/A';
                  return `${label}: ${value} (Média: ${average})`;
                }
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    if (playerStats) {
      createRadarChart();
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [playerStats]);

  if (loading) {
    return (
      <div className="homepage-container relative min-h-screen">
        <div className="relative z-10 max-w-5xl mx-auto p-6 pt-24 text-center">
          <p className="text-[var(--color-text-primary)]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-container relative min-h-screen">
        <div className="relative z-10 max-w-5xl mx-auto p-6 pt-24 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container relative min-h-screen">
      <div className="background-image" style={{ backgroundImage: 'ur[](https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}></div>
      <div className="background-gradient"></div>
      <div className="background-grid"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 pt-24">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-10 text-center">Estatísticas do Jogador</h2>
        <div className="bg-[rgba(17,24,39,0.5)] border border-[var(--color-border)] rounded-lg shadow-lg p-6 backdrop-blur-md mb-10">
          {populateTable()}
        </div>
        <div className="bg-[rgba(17,24,39,0.5)] border border-[var(--color-border)] rounded-lg shadow-lg p-6 backdrop-blur-md flex items-center justify-center">
          <div className="w-full h-[400px] flex justify-center">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficoDados;