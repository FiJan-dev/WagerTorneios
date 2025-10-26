import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GraficoDados = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const playerStats = {
    finalizacoes: 50,
    chute_forca: 75,
    gols_marcados: 15,
    passes_certos: 200,
    assistencias: 10,
    passe_total: 250,
    drible: 65,
    aceleracao: 80,
    cartoes_amarelos: 3,
    cartoes_vermelhos: 1,
    roubadas_bola: 25,
  };

  const populateTable = () => {
    const categories = {
      Físico: [
        { label: 'Chute Força', value: playerStats.chute_forca },
        { label: 'Aceleração', value: playerStats.aceleracao },
      ],
      Defesa: [
        { label: 'Roubadas Bola', value: playerStats.roubadas_bola },
      ],
      Velocidade: [
        { label: 'Aceleração', value: playerStats.aceleracao },
      ],
      Chute: [
        { label: 'Chute Força', value: playerStats.chute_forca },
        { label: 'Gols Marcados', value: playerStats.gols_marcados },
      ],
      Passe: [
        { label: 'Passe Total', value: playerStats.passe_total },
        { label: 'Passes Certos', value: playerStats.passes_certos },
        { label: 'Assistências', value: playerStats.assistencias },
      ],
      Drible: [
        { label: 'Drible', value: playerStats.drible },
      ],
      Finalização: [
        { label: 'Finalizações', value: playerStats.finalizacoes },
        { label: 'Gols Marcados', value: playerStats.gols_marcados },
      ],
      Cartões: [
        { label: 'Cartões Amarelos', value: playerStats.cartoes_amarelos },
        { label: 'Cartões Vermelhos', value: playerStats.cartoes_vermelhos },
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
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData = {
      Físico: playerStats.chute_forca + playerStats.aceleracao,
      Defesa: playerStats.roubadas_bola,
      Velocidade: playerStats.aceleracao,
      Chute: playerStats.chute_forca + playerStats.gols_marcados,
      Passe: playerStats.passe_total,
      Drible: playerStats.drible,
      Finalização: playerStats.finalizacoes + playerStats.gols_marcados,
    };

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Características',
          data: Object.values(chartData),
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
            max: 500,
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
                  const accuracy = playerStats.passe_total > 0
                    ? (playerStats.passes_certos / playerStats.passe_total * 100).toFixed(2) + '%'
                    : 'N/A';
                  return `${label}: ${value} (% de Acerto: ${accuracy})`;
                }
                if (label === 'Finalização') {
                  const accuracy = playerStats.gols_marcados > 0
                    ? (playerStats.gols_marcados / playerStats.finalizacoes * 100).toFixed(2) + '%'
                    : 'N/A';
                  return `${label}: ${value} (% de Acerto: ${accuracy})`;
                }
                if (label === 'Físico') {
                  const average = playerStats.chute_forca > 0 && playerStats.aceleracao > 0
                    ? ((playerStats.chute_forca + playerStats.aceleracao) / 2).toFixed(2)
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
    createRadarChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="homepage-container relative min-h-screen">
      {/* Background Layers */}
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