import { useState } from 'react';
import './CadCamp.css';

export default function ChampionshipRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para submissão do formulário (cadastrar campeonato)
    console.log('Campeonato cadastrado:', formData);
    // Aqui você pode integrar com uma API para salvar os dados
  };

  return (
    <div className="container grid-center login-page">
      <div className="login-card stack-lg">
        <div className="logo-container grid-center">
          <div className="logo">Logo</div>
        </div>

        <h1>Cadastro de Campeonato</h1>
        <p>Preencha os detalhes para criar um novo campeonato</p>

        <form onSubmit={handleSubmit} className="stack">
          <div className="stack-sm">
            <label htmlFor="name" className="sr-only">Nome do Campeonato</label>
            <input
              id="name"
              type="text"
              placeholder="Digite o nome do campeonato"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field stack-sm"
            />
          </div>

          <div className="stack-sm">
            <label htmlFor="description" className="sr-only">Descrição</label>
            <textarea
              id="description"
              placeholder="Descreva o campeonato"
              value={formData.description}
              onChange={handleChange}
              required
              className="input-field stack-sm"
              rows="4"
            />
          </div>

          <div className="stack-sm">
            <label htmlFor="startDate" className="sr-only">Data de Início</label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="input-field stack-sm"
            />
          </div>

          <div className="stack-sm">
            <label htmlFor="endDate" className="sr-only">Data de Término</label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="input-field stack-sm"
            />
          </div>

          <div className="stack-sm">
            <label htmlFor="location" className="sr-only">Local</label>
            <input
              id="location"
              type="text"
              placeholder="Digite o local do campeonato"
              value={formData.location}
              onChange={handleChange}
              required
              className="input-field stack-sm"
            />
          </div>

          <button type="submit" className="submit-button stack-sm">
            Cadastrar Campeonato
          </button>
        </form>
      </div>
    </div>
  );
}