import React from 'react';
import './Perfil.css';

const Perfil = () => {
  const jogador = {
    nome: "Lucas Mendes",
    posicao: "Meia Atacante",
    idade: 22,
    clube: "Flamengo RJ",
    altura: "1,78m",
    pe: "Direito",
    valor_mercado: "R$ 28M",
    olheiros: 12,
    disponivel: true,
  };

  const stats = {
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
  };

  const precisao_passe = Math.round((stats.passes_certos / stats.passe_total) * 100);
  const conversao_finalizacao = stats.finalizacoes > 0 
    ? Math.round((stats.gols_marcados / stats.finalizacoes) * 100) 
    : 0;

  const estatisticas = [
    {
      categoria: "Físico",
      itens: [
        { label: "Aceleração", valor: stats.aceleracao, max: 100 },
        { label: "Força do Chute", valor: stats.chute_forca, max: 100 },
      ],
    },
    {
      categoria: "Técnico",
      itens: [
        { label: "Drible", valor: stats.drible, max: 100 },
        { label: "Precisão de Passe", valor: precisao_passe, max: 100 },
        { label: "Conversão de Finalização", valor: conversao_finalizacao, max: 100 },
      ],
    },
    {
      categoria: "Ataque",
      itens: [
        { label: "Gols Marcados", valor: stats.gols_marcados, max: 30 },
        { label: "Assistências", valor: stats.assistencias, max: 20 },
        { label: "Finalizações", valor: stats.finalizacoes, max: 100 },
      ],
    },
    {
      categoria: "Defesa & Disciplina",
      itens: [
        { label: "Roubadas de Bola", valor: stats.roubadas_bola, max: 100 },
        { label: "Cartões Amarelos", valor: stats.cartoes_amarelos, max: 10, alerta: "amarelo" },
        { label: "Cartões Vermelhos", valor: stats.cartoes_vermelhos, max: 2, alerta: "vermelho" },
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
          <h1 className="nome-jogador">{jogador.nome}</h1>
          <p className="posicao-clube">
            {jogador.posicao} <span className="separador">•</span> {jogador.clube}
          </p>
          <p className="detalhes">
            {jogador.idade} anos • {jogador.altura} • Pé {jogador.pe} • {jogador.valor_mercado}
          </p>

          <div className="badge-olheiros">
            <svg className="icone-olheiro" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L8.5 6.5L4 7L7 10.5L6 15L10 13L14 15L13 10.5L16 7L11.5 6.5L10 2Z"/>
            </svg>
            Observado por {jogador.olheiros} olheiros
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