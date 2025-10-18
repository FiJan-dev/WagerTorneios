import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './CadastroCampeonato.css';

export default function ChampionshipRegistrationPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'http://localhost:5000/api/campeonato/criarC';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Precisa de token por causa do authSoft no back
    if (!token) {
      alert('Faça login para continuar.');
      return;
    }

    const { name, startDate, endDate, location } = formData;

    if (!name || !startDate || !endDate || !location) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    const dtInicio = new Date(startDate);
    const dtFim = new Date(endDate);
    if (isNaN(dtInicio.getTime()) || isNaN(dtFim.getTime())) {
      alert('Datas inválidas.');
      return;
    }
    if (dtInicio >= dtFim) {
      alert('A data de início deve ser anterior à data de fim.');
      return;
    }

    // Aviso amigável para datas no passado (mas não bloqueia)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Reset para início do dia para comparação justa
    
    if (dtInicio < hoje) {
      const confirmar = confirm(
        'A data de início está no passado. Tem certeza que deseja criar este campeonato? ' +
        'Isso pode ser útil para registros históricos.'
      );
      if (!confirmar) {
        return;
      }
    }
    
    if (dtFim < hoje) {
      const confirmar = confirm(
        'A data de fim está no passado. Tem certeza que deseja criar este campeonato? ' +
        'Este campeonato aparecerá como "Encerrado".'
      );
      if (!confirmar) {
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const payload = {
        nome_campeonato: name,
        data_inicio: startDate,
        data_fim: endDate,
        local_campeonato: location,
      };

      const resp = await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = resp?.data;

      // Resposta "suave" do back (authSoft bloqueou)
      if (body && typeof body === 'object' && body.ok === false) {
        alert(body.msg || 'Acesso não permitido.');
        return; // não limpa o formulário
      }

      // Sucesso padrão (nosso controller retorna { ok:true, ... })
      if (body && typeof body === 'object' && body.ok === true) {
        alert('Campeonato cadastrado com sucesso!');
        navigate('/cadastrocampeonatolista');
        return;
      }

      // Fallback (caso venha outro formato)
      alert('Campeonato cadastrado com sucesso!');
      navigate('/cadastrocampeonatolista');
    } catch (err) {
      console.error(err);
      const data = err?.response?.data;
      const msg =
        data?.msg ||
        data?.error ||
        (Array.isArray(data) ? data.join('; ') : null) ||
        err?.response?.statusText ||
        err?.message ||
        'Erro ao cadastrar campeonato.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="campeonato-cadastro-page">
      <SideBar_Olheiro />
      
      <div className="cadastro-container">
        <div className="page-header-cadastro">
          <h1>Cadastrar Campeonato</h1>
          <p>Preencha as informações para criar um novo campeonato</p>
        </div>

        <div className="cadastro-card">
          <form onSubmit={handleSubmit} className="campeonato-form">
            <div className="form-section">
              <h2 className="section-title">Informações Básicas</h2>
              
              <div className="form-group">
                <label htmlFor="name">
                  Nome do Campeonato <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Copa América 2024, Liga dos Campeões..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  placeholder="Adicione detalhes sobre o campeonato, regulamento, premiação, etc."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Local <span className="required">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Estádio Nacional, Arena da Baixada, Cidade/Estado..."
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Período</h2>
              
              <div className="date-inputs-row">
                <div className="form-group">
                  <label htmlFor="startDate">
                    Data de Início <span className="required">*</span>
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="form-input"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">
                    Data de Término <span className="required">*</span>
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="form-input"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <p className="form-hint">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Você pode cadastrar campeonatos com datas passadas para registros históricos
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/cadastrocampeonatolista')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Campeonato'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
