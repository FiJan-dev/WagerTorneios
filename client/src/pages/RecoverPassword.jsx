import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Aurora from '../components/Aurora';
import './RecoverPassword.css';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Por favor, insira um email válido.');
      return;
    }

    if (!novaSenha.trim()) {
      setError('Por favor, insira uma nova senha.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Enviando requisição para:', `http://localhost:5000/api/olheiro/recuperar-senha/${email}`);
      const response = await fetch(`http://localhost:5000/api/olheiro/recuperar-senha/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nova_senha: novaSenha }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSuccess('Senha atualizada com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Email não encontrado.');
      }
    } catch (err) {
      console.error('Erro completo:', err);
      setError(`Erro ao conectar com o servidor: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen relative flex items-center justify-center py-8 px-4 bg-neutral-900">
      <Aurora
        colorStops={["#7cff67", "#A78BFA", "#5239FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      
      {/* Main Content */}
      <div className='login-content'>
        {/* Recover Password Card */}
        <div className='login-card'>
          <div className='login-header'>
            <h1 className='login-title'>Recuperar Senha</h1>
            <p className='login-subtitle'>
              Insira seu email e sua nova senha
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='login-form'>
            {/* Email Field */}
            <div className='form-group'>
              <label htmlFor='email' className='form-label'>
                Email
              </label>
              <div className='input-wrapper'>
                <input
                  id='email'
                  type='email'
                  placeholder='Digite seu email cadastrado'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='form-input'
                />
              </div>
            </div>

            {/* Nova Senha Field */}
            <div className='form-group'>
              <label htmlFor='novaSenha' className='form-label'>
                Nova Senha
              </label>
              <div className='input-wrapper'>
                <input
                  id='novaSenha'
                  type='password'
                  placeholder='Digite sua nova senha'
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  className='form-input'
                />
              </div>
            </div>

            {/* Confirmar Senha Field */}
            <div className='form-group'>
              <label htmlFor='confirmarSenha' className='form-label'>
                Confirmar Senha
              </label>
              <div className='input-wrapper'>
                <input
                  id='confirmarSenha'
                  type='password'
                  placeholder='Confirme sua nova senha'
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className='form-input'
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='error-message'>
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className='success-message'>
                <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting || success}
              className='login-button'
            >
              {isSubmitting ? (
                <>
                  <svg className="button-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Atualizando senha...
                </>
              ) : success ? (
                <>
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Senha atualizada!
                </>
              ) : (
                <>
                  Atualizar Senha
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className='login-footer'>
            <p className='footer-text'>
              Lembrou da senha?{' '}
              <Link to='/login' className='footer-link'>
                Fazer login
              </Link>
            </p>
            <p className='footer-text'>
              Não tem uma conta?{' '}
              <Link to='/register' className='footer-link'>
                Criar conta
              </Link>
            </p>
            <Link to='/' className='back-link'>
              <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}