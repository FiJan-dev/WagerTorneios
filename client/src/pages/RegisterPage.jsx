import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterPage.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000/api/olheiro";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/cadastrar`, {
        nome: name,
        email,
        senha: password,
      });

      setSuccess("Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        "Erro ao cadastrar. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-container'>
      {/* Background Effects */}
      <div className="register-background-gradient"></div>
      <div className="register-background-grid"></div>
      
      {/* Main Content */}
      <div className='register-content'>
        {/* Logo Section */}
        <div className='register-logo-section'>
          <div className='register-logo-icon'>WT</div>
          <h2 className='register-logo-text'>WagerTorneios</h2>
        </div>

        {/* Register Card */}
        <div className='register-card'>
          <div className='register-header'>
            <h1 className='register-title'>Criar sua conta</h1>
            <p className='register-subtitle'>
              Preencha os dados abaixo para começar sua jornada
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='register-form'>
            {/* Name Field */}
            <div className='form-group'>
              <label htmlFor='name' className='form-label'>
                Nome completo
              </label>
              <input
                id='name'
                type='text'
                placeholder='Digite seu nome completo'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='form-input'
              />
            </div>

            {/* Email Field */}
            <div className='form-group'>
              <label htmlFor='email' className='form-label'>
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='form-input'
              />
            </div>

            {/* Password Field */}
            <div className='form-group'>
              <label htmlFor='password' className='form-label'>
                Senha
              </label>
              <input
                id='password'
                type='password'
                placeholder='Mínimo 6 caracteres'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='form-input'
              />
            </div>

            {/* Confirm Password Field */}
            <div className='form-group'>
              <label htmlFor='confirm-password' className='form-label'>
                Confirmar senha
              </label>
              <input
                id='confirm-password'
                type='password'
                placeholder='Confirme sua senha'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='form-input'
              />
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
              disabled={loading || success}
              className='register-button'
            >
              {loading ? (
                <>
                  <svg className="button-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Criando conta...
                </>
              ) : success ? (
                <>
                  <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Conta criada!
                </>
              ) : (
                <>
                  Criar Conta
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className='register-footer'>
            <p className='footer-text'>
              Já tem uma conta?{' '}
              <Link to='/login' className='footer-link'>
                Fazer login
              </Link>
            </p>
            <Link to='/' className='back-link'>
              <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao início
            </Link>
            <p className='terms-text'>
              Ao criar uma conta, você concorda com nossos{' '}
              <Link to='/terms' className='terms-link'>
                Termos de Uso
              </Link>
              {' e '}
              <Link to='/privacy' className='terms-link'>
                Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
