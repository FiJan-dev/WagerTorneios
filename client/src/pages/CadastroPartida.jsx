import React, { useState } from 'react';
import './CadastroPartida.css';
import SideBar from '../components/SideBar';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function CadastroCamp() {
  const [formData, setFormData] = useState({
    championship: '',
    team1: '',
    team2: '',
    date: '',
    time: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (Object.values(formData).every((value) => value.trim() !== '')) {
      setIsSubmitting(true);
      setTimeout(() => {
        alert('Partida Registrada com Sucesso!');
        setFormData({ championship: '', team1: '', team2: '', date: '', time: '', location: '' });
        setIsSubmitting(false);
      }, 1000);
    } else {
      alert('Preencha todos os campos.');
    }
  };

  return (
    <div className="cadastro">
      <SideBar_Olheiro/>
      <div className="login-page">
        <div className="login-card">
          <div className="logo-container">
            <div className="logo">M</div>
          </div>
          <h1>Registrar uma partida</h1>
          <p>Coloque todas as informações</p>
          <div className="form-field">
            <input
              type="text"
              name="championship"
              value={formData.championship}
              onChange={handleInputChange}
              placeholder="Nome do Campeonato"
              className="input-field"
            />
          </div>
          <div className="form-container">
            <input
              type="text"
              name="team1"
              value={formData.team1}
              onChange={handleInputChange}
              placeholder="Time 1"
              className="input-field"
            />
            <input
              type="text"
              name="team2"
              value={formData.team2}
              onChange={handleInputChange}
              placeholder="Time 2"
              className="input-field"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Localização da Partida"
              className="input-field"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Partida'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}