import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function ChampionshipRegistrationPage() {
  const { token } = useContext(AuthContext);
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
        setFormData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          location: '',
        });
        return;
      }

      // Fallback (caso venha outro formato)
      alert('Campeonato cadastrado com sucesso!');
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
      });
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
    <div className='flex min-h-screen bg-black'>
      <SideBar_Olheiro />
      <div className='flex justify-center items-center min-h-screen w-full p-4 box-border'>
        <div className='bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-2xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
          <div className='mb-6 flex justify-center'>
            <div className='w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md'>
              C
            </div>
          </div>
          <h1 className='text-2xl sm:text-3xl text-center font-bold text-white mb-2'>
            Cadastro de Campeonato
          </h1>
          <p className='text-center text-gray-300 text-base mb-6'>
            Preencha os detalhes para criar um novo campeonato
          </p>

          <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor='name' className='text-gray-300 font-medium'>
                Nome do Campeonato *
              </label>
              <input
                id='name'
                type='text'
                placeholder='Ex: Copa América 2024, Liga dos Campeões...'
                value={formData.name}
                onChange={handleChange}
                required
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full'
              />
            </div>
            
            <div className='flex flex-col gap-1'>
              <label htmlFor='description' className='text-gray-300 font-medium'>
                Descrição (opcional)
              </label>
              <textarea
                id='description'
                placeholder='Adicione detalhes sobre o campeonato, regulamento, premiação, etc.'
                value={formData.description}
                onChange={handleChange}
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full resize-none'
                rows='3'
              />
            </div>
            
            <div className='flex flex-col gap-1'>
              <label htmlFor='startDate' className='text-gray-300 font-medium'>
                Data de Início *
              </label>
              <input
                id='startDate'
                type='date'
                value={formData.startDate}
                onChange={handleChange}
                required
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full'
              />
            </div>
            
            <div className='flex flex-col gap-1'>
              <label htmlFor='endDate' className='text-gray-300 font-medium'>
                Data de Término *
              </label>
              <input
                id='endDate'
                type='date'
                value={formData.endDate}
                onChange={handleChange}
                required
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full'
              />
            </div>
            
            <div className='flex flex-col gap-1'>
              <label htmlFor='location' className='text-gray-300 font-medium'>
                Local do Campeonato *
              </label>
              <input
                id='location'
                type='text'
                placeholder='Ex: Estádio Nacional, Arena da Baixada, Cidade/Estado...'
                value={formData.location}
                onChange={handleChange}
                required
                className='px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full'
              />
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full text-center'
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Campeonato'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
