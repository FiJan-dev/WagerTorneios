import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Perfil.css';

const Perfil = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [jogador, setJogador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJogador = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jogador/listar`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const payload = response?.data;
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        
        // Encontrar o jogador pelo ID
        const player = list.find(p => p.id_jogador === parseInt(id));
        
        if (player) {
          setJogador(player);
        } else {
          setError('Jogador não encontrado');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados do jogador');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchJogador();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="bg-gradient"></div>
        <div className="bg-grid"></div>
        <div className="loading-container">
          <p style={{ color: '#60a5fa', fontSize: '1.5rem', textAlign: 'center', paddingTop: '10rem' }}>
            Carregando dados do jogador...
          </p>
        </div>
      </div>
    );
  }

  if (error || !jogador) {
    return (
      <div className="perfil-container">
        <div className="bg-gradient"></div>
        <div className="bg-grid"></div>
        <div className="error-container">
          <p style={{ color: '#ef4444', fontSize: '1.5rem', textAlign: 'center', paddingTop: '10rem' }}>
            {error || 'Jogador não encontrado'}
          </p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/jogadores" className="btn-voltar" style={{ display: 'inline-flex' }}>
              Voltar para Jogadores
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const precisao_passe = jogador.passe_total > 0 
    ? Math.round((jogador.passes_certos / jogador.passe_total) * 100) 
    : 0;
  const conversao_finalizacao = jogador.finalizacoes > 0 
    ? Math.round((jogador.gols_marcados / jogador.finalizacoes) * 100) 
    : 0;

  const estatisticas = [
    {
      categoria: "Físico",
      itens: [
        { label: "Aceleração", valor: jogador.aceleracao || 0, max: 100 },
        { label: "Força do Chute", valor: jogador.chute_forca || 0, max: 100 },
      ],
    },
    {
      categoria: "Técnico",
      itens: [
        { label: "Drible", valor: jogador.drible || 0, max: 100 },
        { label: "Precisão de Passe", valor: precisao_passe, max: 100 },
        { label: "Conversão de Finalização", valor: conversao_finalizacao, max: 100 },
      ],
    },
    {
      categoria: "Ataque",
      itens: [
        { label: "Gols Marcados", valor: jogador.gols_marcados || 0, max: 30 },
        { label: "Assistências", valor: jogador.assistencias || 0, max: 20 },
        { label: "Finalizações", valor: jogador.finalizacoes || 0, max: 100 },
      ],
    },
    {
      categoria: "Defesa & Disciplina",
      itens: [
        { label: "Roubadas de Bola", valor: jogador.roubadas_bola || 0, max: 100 },
        { label: "Cartões Amarelos", valor: jogador.cartoes_amarelos || 0, max: 10, alerta: "amarelo" },
        { label: "Cartões Vermelhos", valor: jogador.cartoes_vermelhos || 0, max: 2, alerta: "vermelho" },
      ],
    },
  ];

  return (
    <div className="perfil-container">
      {/* Backgrounds */}
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>

      {/* Cabeçalho do Jogador */}
      <header className="perfil-header">
        <div className="icone-usuario">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <div className="borda-icone"></div>
        </div>

        <div className="info-jogador">
          <h1 className="nome-jogador">{jogador.nome_jogador || 'Jogador'}</h1>
          <p className="posicao-clube">
            {jogador.posicao_jogador || 'Posição'} <span className="separador">•</span> {jogador.nome_time || 'Sem time'}
          </p>
          <p className="detalhes">
            {jogador.idade || 'N/A'} anos
            {jogador.altura && ` • ${jogador.altura}`}
            {jogador.pe_preferido && ` • Pé ${jogador.pe_preferido}`}
            {jogador.valor_mercado && ` • ${jogador.valor_mercado}`}
          </p>

          <div className="badge-olheiros">
            <svg className="icone-olheiro" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L8.5 6.5L4 7L7 10.5L6 15L10 13L14 15L13 10.5L16 7L11.5 6.5L10 2Z"/>
            </svg>
            Estatísticas disponíveis
          </div>

          {/* Botões de Ação */}
          <div className="action-buttons-perfil">
            <Link to={`/jogadores/estatisticas/${id}/grafico`} className="btn-grafico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Gráficos Detalhados
            </Link>
            <Link to="/jogadores" className="btn-voltar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para Jogadores
            </Link>
          </div>
        </div>
      </header>
      {/* Estatísticas */}
      <section className="secao-estatisticas">
        <div className="grade-estatisticas">
          {estatisticas.map((cat, i) => (
            <div key={i} className="cartao-estatistica">
              <h3 className="titulo-categoria">{cat.categoria}</h3>
              <div className="barras-estatistica">
                {cat.itens.map((item, j) => {
                  const porcentagem = Math.min((item.valor / item.max) * 100, 100);
                  return (
                    <div key={j} className="item-estatistica">
                      <div className="rotulo">
                        <span>{item.label}</span>
                        <span className={`valor ${item.alerta || ''}`}>
                          {item.valor}
                          {item.max <= 100 ? '' : ` / ${item.max}`}
                        </span>
                      </div>
                      <div className="barra-progresso">
                        <div 
                          className={`preenchimento ${item.alerta || ''}`}
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Perfil;