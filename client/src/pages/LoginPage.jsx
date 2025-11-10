import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Aurora from '../components/Aurora';
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
      navigate('/jogadores', { replace: true });
    }
    setLoading(false);
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
                <input
                  id='email'
                  type='email'
                  placeholder='Digite seu email'
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