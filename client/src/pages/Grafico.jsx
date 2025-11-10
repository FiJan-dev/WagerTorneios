import React from 'react';
import './Perfil.css';

const Perfil = () => {
  const stats = {
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

  const maxValues = {
    aceleracao: 100,
    chute_forca: 100,
    roubadas_bola: 100,
    gols_marcados: 30,
    passe_total: 1000,
    passes_certos: 1000,
    assistencias: 20,
    drible: 100,
    finalizacoes: 100,
    cartoes_amarelos: 10,
    cartoes_vermelhos: 2,
  };

  const getPercentage = (value, key) => {
    const max = maxValues[key] || 100;
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="player-container">
      {/* Background Layers */}
      <div className="background-image" style={{
        backgroundImage: 'ur[](https://images.unsplash.com/photo-1624880357913-4f7f06d9849f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
      }}></div>
      <div className="background-gradient"></div>
      <div className="background-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-section">
            <div className="logo-icon">LM</div>
            <span className="logo-text">Scout Report</span>
          </div>
          <div className="nav-actions">
            <a href="#stats" className="nav-link">Estatísticas</a>
            <a href="#bio" className="nav-link">Perfil</a>
            <a href="#contact" className="nav-button">Contato</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="bio">
        <div className="hero-content">
          <div className="profile-header">
            <div className="profile-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1570545906912-3b91d2c8b1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt={playerStats.rawStats.nome}
              />
            </div>

            <div className="player-info">
              <div className="hero-badge">
                <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.114a4 4 0 001.787-.58l.05-.025a2 2 0 001.106-1.79v-5.43a2 2 0 00-1.106-1.789l-.05-.026a4 4 0 00-1.787-.58H8.943a4 4 0 00-1.787.58l-.05.025A2 2 0 006 10.333z"/>
                </svg>
                Observado por 12 olheiros
              </div>

              <h1 className="hero-title">
                {playerStats.rawStats.nome}
                <span className="hero-title-highlight">#{playerStats.rawStats.posicao}</span>
              </h1>

              <p className="hero-description">
                {playerStats.rawStats.idade} anos • {playerStats.rawStats.clube} • 
                {playerStats.rawStats.altura} • {playerStats.rawStats.pe_dominante}
              </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/>
                    <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 011 1v7a3 3 0 01-3 3H6a3 3 0 01-3-3V8z" clipRule="evenodd"/>
                  </svg>
                  <span>{playerStats.rawStats.gols_marcados} Gols</span>
                </div>
                <div className="stat-item">
                  <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{playerStats.rawStats.assistencias} Assistências</span>
                </div>
                <div className="stat-item">
                  <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  <span>{playerStats.rawStats.drible} Drible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="features-content">
          <div className="section-header">
            <h2 className="section-title">Relatório Técnico</h2>
            <p className="section-description">
              Análise detalhada de desempenho em campo — dados da temporada 2024/25
            </p>
          </div>

          <div className="stats-grid">
            {Object.entries(stats).map(([category, items]) => (
              <div key={category} className="stat-category">
                <h3 className="category-title">{category}</h3>
                <div className="stat-items">
                  {items.map((stat, i) => {
                    const key = stat.label.toLowerCase().replace(/ /g, '_');
                    const percentage = getPercentage(stat.value, key);
                    return (
                      <div key={i} className="stat-bar-item">
                        <div className="stat-label">
                          <span>{stat.label}</span>
                          <span className="stat-value">{stat.value}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Dados de exemplo
const playerStats = {
  rawStats: {
    nome: "Lucas Mendes",
    posicao: "Meia Atacante",
    idade: 22,
    clube: "Flamengo RJ",
    altura: "1,78m",
    peso: "72kg",
    pe_dominante: "Direito",
    aceleracao: 88,
    chute_forca: 82,
    roubadas_bola: 64,
    gols_marcados: 12,
    passe_total: 842,
    passes_certos: 756,
    assistencias: 9,
    drible: 91,
    finalizacoes: 48,
    cartoes_amarelos: 3,
    cartoes_vermelhos: 0,
  }
};

export default Perfil;