import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import backgroundImage from '../assets/backg.jpg';
import FuzzyText from '../components/FuzzyText';
import './HomePage.css';

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="homepage-container">
      {/* Background Image */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      {/* Background Effects */}
      <div className="background-gradient"></div>
      <div className="background-grid"></div>
      
      {/* Navigation */}
      <nav className="navbar" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100, 
        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)', 
        transition: 'transform 0.3s ease' 
      }}>
        <div className="nav-content">
          <div className="logo-section">
            <div className="logo-icon">WT</div>
            <span className="logo-text">WagerTorneios</span>
          </div>
          
          <div className="nav-actions">
            <Link to="/login" className="nav-link">Entrar</Link>
            <Link to="/register" className="nav-button">Começar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem', paddingTop: '80px' }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ marginTop: '150px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FuzzyText 
                fontSize='clamp(3rem, 12vw, 9rem)'
                baseIntensity={0.2} 
                hoverIntensity={0.5} 
                enableHover={true}
              >
                WagerTorneios
              </FuzzyText>
            </div>
          </h1>

          <p className="hero-description">
            Plataforma Profissional de Gestão Esportiva
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">
              Acessar Plataforma
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link to="/register" className="btn-secondary">
              Criar Conta Grátis
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Seguro e Confiável</span>
            </div>
            <div className="stat-item">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Rápido e Eficiente</span>
            </div>
            <div className="stat-item">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Totalmente Personalizável</span>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <div className="section-header">
            <h2 className="section-title">Recursos Principais</h2>
            <p className="section-description">
              Ferramentas profissionais para gestão completa de atividades esportivas
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="feature-title">Gestão de Torneios</h3>
              <p className="feature-description">
                Crie e organize campeonatos com facilidade. Sistema completo de gerenciamento de competições.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="feature-title">Análise de Performance</h3>
              <p className="feature-description">
                Acompanhe estatísticas detalhadas e métricas de desempenho dos atletas em tempo real.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Gestão de Jogadores</h3>
              <p className="feature-description">
                Mantenha perfis detalhados de atletas com histórico, avaliações e informações completas.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Controle de Partidas</h3>
              <p className="feature-description">
                Registre resultados, gerencie calendários e acompanhe o andamento das competições.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Relatórios Detalhados</h3>
              <p className="feature-description">
                Gere relatórios completos com insights e dados importantes para tomada de decisões.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="feature-title">Segurança e Privacidade</h3>
              <p className="feature-description">
                Proteção avançada de dados com criptografia e controles de acesso personalizados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}