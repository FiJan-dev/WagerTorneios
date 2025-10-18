import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setErrMsg(result.error);
    }
    else {
      // Redirect to the dashboard after successful login
      navigate('/dashboard', { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className='login-container'>
      {/* Background Effects */}
      <div className="login-background-gradient"></div>
      <div className="login-background-grid"></div>
      
      {/* Main Content */}
      <div className='login-content'>
        {/* Logo Section */}
        <div className='login-logo-section'>
          <div className='login-logo-icon'>WT</div>
          <h2 className='login-logo-text'>WagerTorneios</h2>
        </div>

        {/* Login Card */}
        <div className='login-card'>
          <div className='login-header'>
            <h1 className='login-title'>Bem-vindo de volta</h1>
            <p className='login-subtitle'>
              Entre com suas credenciais para acessar a plataforma
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
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
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
            </div>

            {/* Password Field */}
            <div className='form-group'>
              <label htmlFor='password' className='form-label'>
                Senha
              </label>
              <div className='input-wrapper'>
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id='password'
                  type='password'
                  placeholder='Digite sua senha'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='form-input'
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className='forgot-password-link'>
              <Link to='/recover-password' className='text-link'>
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Error Message */}
            {errMsg && (
              <div className='error-message'>
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='login-button'
            >
              {loading ? (
                <>
                  <svg className="button-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className='login-footer'>
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