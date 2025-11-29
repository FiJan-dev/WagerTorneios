import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';
import './Perfil.css';

const Perfil = () => {
  const { id } = useParams();
  
  // Obter user e token do AuthContext
  const { user, token } = useContext(AuthContext); 

  const [jogador, setJogador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Inicializa com 0 (número)
  const [mediaNota, setMediaNota] = useState(0); 
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  
  const [suaNota, setSuaNota] = useState(0); 
  const [temNota, setTemNota] = useState(0);
  const [avaliando, setAvaliando] = useState(false);

  useEffect(() => {
    // Função para buscar os dados do jogador (Mantida inalterada, pois estava OK)
    const fetchJogador = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jogador/listar`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const payload = response?.data;
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        
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

    // Função para buscar a média de notas do jogador
    const fetchMediaNota = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notas/media/${id}`);
        if (res.data.ok) {
            // Garante que a nota é sempre salva como número
          setMediaNota(parseFloat(res.data.estatisticas.media_nota || 0)); 
          setTotalAvaliacoes(res.data.estatisticas.total_avaliacoes);
        }
      } catch (err) {
        console.error("Ainda não existem notas cadastradas para esse jogador:", err);
        setMediaNota(0); // Define 0 (número) se não houver notas
        setTotalAvaliacoes(0);
      }
    };

    // Função para buscar a nota dada pelo olheiro logado (Mantida inalterada, pois estava OK)
    const fetchMinhasNotas = async () => {
      if (!user || !token) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/notas/minhas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.ok){
          const notaJogador = res.data.notas.find(n => n.id_jogador === parseInt(id));
          if (notaJogador) {
            setSuaNota(notaJogador.sua_nota); 
            setTemNota(1);
          } else {
            setTemNota(0);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar minhas notas:", err);
      }
    };

    if (id) {
      fetchJogador();
      fetchMediaNota();
      if (token) fetchMinhasNotas(); 
    }
  }, [id, token, user]);

  const enviarNota = async (NotaSelecionada) => {
    if(!token) {
      alert("Você precisa estar logado para avaliar um jogador.");
      return;
    }

    if (avaliando) {
        console.log("Envio bloqueado: Avaliação em andamento.");
        return;
    }
    
    setAvaliando(true);

    try {
      const res = await axios.post('http://localhost:5000/api/notas',
        {id_jogador: parseInt(id), nota: NotaSelecionada},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      // Com os status HTTP corretos no backend, esta seção só será alcançada em caso de SUCESSO (status 200/201)
      // Atualizar os dados imediatamente com a resposta do servidor
      setSuaNota(NotaSelecionada); 
      setMediaNota(res.data.estatisticas.media_nota); 
      setTotalAvaliacoes(res.data.estatisticas.total_avaliacoes);
      setTemNota(1); 
      
      // Mostrar mensagem de sucesso
      alert(res.data.msg); 
      console.log("✅ Nota enviada com sucesso!");
      
    } catch (err) {
      // 🚨 CAPTURA ERROS HTTP (400, 401, 404, 500)
      console.error("Erro ao enviar nota (AXIOS CATCH):", err.response?.data || err);
      // Mensagem de erro padrão ou a mensagem detalhada do backend
      const message = err.response?.data?.msg || 'Não foi possível enviar a nota. Verifique sua conexão ou status de login.';
      alert(`❌ Erro: ${message}`);
    } finally {
      setAvaliando(false);
    }
  };  const adicionarShortlist = async () => {
    // ... (Mantida inalterada, pois estava OK e segue a mesma lógica de erro)
    const id_jogador = parseInt(id);

    if (!id_jogador || isNaN(id_jogador)) {
      alert("ID do jogador inválido.");
      return;
    }
    if (!jogador) {
        alert("Dados do jogador não carregados.");
        return;
    }
    
    if(!token) {
        alert("Você precisa estar logado para adicionar à shortlist.");
        return;
    }

    const confirmAdd = window.confirm(`Adicionar ${jogador.nome_jogador} à shortlist?`);
    if (!confirmAdd) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/jogador/shortlist/adicionar',
        { id_jogador: id_jogador }, 
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      if (res.data.ok) {
        alert(`✅ ${jogador.nome_jogador} adicionado à shortlist com sucesso!`);
      } else {
        const message = res.data.message || 'Erro ao adicionar jogador.';
        alert(message); 
      }
    } catch (err) {
      console.error("Erro ao adicionar à shortlist:", err.response?.data || err);
      const message = err.response?.data?.message || 'Não foi possível adicionar. Tente novamente.';
      alert(`❌ Erro: ${message}`);
    }
  };


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
    // ... (Mantido inalterado)
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


  const precisao_passe = jogador.passe_total > 0 
    ? Math.round((jogador.passes_certos / jogador.passe_total) * 100) 
    : 0;
  const conversao_finalizacao = jogador.finalizacoes > 0 
    ? Math.round((jogador.gols_marcados / jogador.finalizacoes) * 100) 
    : 0;

  const estatisticas = [
    // ... (Mantido inalterado)
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
        {/* ... (Ícone, Nome, Posição, Detalhes inalterados) ... */}
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
          
          {/* Seção: Avaliação */}
          <div className="secao-avaliacao">
            <div className="avaliacoes-info">
              <h3 className="titulo-avaliacao">Avaliação do Olheiro</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className={`nota-media ${avaliando ? 'animated' : ''}`}>{parseFloat(mediaNota).toFixed(2)}</span>
                <FaStar className="star-large" size={20} />
                <span className="total-avaliacoes">({totalAvaliacoes} avaliações)</span>
              </div>
              <div style={{color: '#9fbfe8', fontSize: '0.9rem'}}>Média das avaliações feitas pelos olheiros cadastrados</div>
            </div>

            {/* Sistema de Estrelas para Avaliação Pessoal */}
            {user ? (
              <div className="avaliacao-pessoal">
                <span className="rotulo-sua-nota">Sua Nota: {suaNota > 0 ? suaNota : 'Não avaliado'}</span>
                <div className="estrelas-interativas" role="radiogroup" aria-label="Avaliar jogador">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      role="radio"
                      aria-checked={star <= suaNota}
                      onClick={() => !avaliando && enviarNota(star)}
                      style={{ cursor: avaliando ? 'not-allowed' : 'pointer' }}
                      title={`Dar ${star} estrela${star>1? 's':''}`}
                    >
                      <FaStar
                        size={24}
                        className={(star <= suaNota) ? 'filled' : 'empty'}
                      />
                    </span>
                  ))}
                </div>
                {avaliando && <p className="status-avaliacao">Enviando...</p>}
                {temNota === 1 && <p className="status-avaliacao">Sua nota atual: {suaNota}</p>}
              </div>
            ) : (
              <p className="aviso-login-avaliacao">Faça login para avaliar este jogador.</p>
            )}
          </div>

          {/* ... (Botões de Ação e Estatísticas inalteradas) ... */}
          <div className="badge-olheiros">
            <svg className="icone-olheiro" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L8.5 6.5L4 7L7 10.5L6 15L10 13L14 15L13 10.5L16 7L11.5 6.5L10 2Z"/>
            </svg>
            Estatísticas disponíveis
          </div>

          <div className="action-buttons-perfil">
            
            {user && ( 
                <button
                    onClick={adicionarShortlist}
                    className="btn-shortlist"
                    style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: '#FFD700', 
                        color: '#1a202c',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        border: 'none',
                        fontSize: '0.9rem'
                    }}
                >
                    <FaStar size={16} />
                    Adicionar à Shortlist
                </button>
            )}
            
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