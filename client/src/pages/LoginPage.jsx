import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import backgroundImage from '../assets/backg.jpg';
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
    <div className='min-h-screen relative overflow-hidden flex justify-center items-center'>
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.3)',
        }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-green-900/60"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl floating-element"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl floating-element"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl floating-element"></div>
      
      {/* Main content */}
      <div className='relative z-10 w-full max-w-md mx-4'>
        <div className='glass-login-card rounded-3xl p-8 sm:p-10 animate-fade-in-scale'>
          
          {/* Logo section */}
          <div className='mb-8 flex justify-center animate-slide-in-top delay-100'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-glow'></div>
              <div className='relative w-20 h-20 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl ring-4 ring-white/20'>
                WT
              </div>
            </div>
          </div>

          {/* Header section */}
          <div className='text-center mb-8 animate-slide-in-top delay-200'>
            <h1 className='text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-green-200 mb-3'>
              Bem-vindo de volta
            </h1>
            <p className='text-gray-300 text-lg leading-relaxed'>
              Faça login para continuar sua jornada na 
              <span className='text-green-400 font-semibold'> plataforma</span>
            </p>
          </div>

          {/* Form section */}
          <form onSubmit={handleSubmit} className='space-y-6 animate-slide-in-bottom delay-300'>
            
            {/* Email input */}
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-300 ml-1'>
                Email
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id='email'
                  type='email'
                  placeholder='Digite seu email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='glass-input w-full pl-12 pr-4 py-3 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none'
                />
              </div>
            </div>

            {/* Password input */}
            <div className='space-y-2'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-300 ml-1'>
                Senha
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id='password'
                  type='password'
                  placeholder='Digite sua senha'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='glass-input w-full pl-12 pr-4 py-3 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none'
                />
              </div>
            </div>

            {/* Error message */}
            {errMsg && (
              <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-slide-in-bottom'>
                <p className='text-center text-red-400 text-sm flex items-center justify-center gap-2'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errMsg}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type='submit'
              disabled={loading}
              className='btn-login-primary w-full py-3 px-6 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <span className='flex items-center justify-center gap-2'>
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Links section */}
          <div className='mt-8 text-center space-y-4 animate-slide-in-bottom delay-500'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-600'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-black/50 text-gray-400'>ou</span>
              </div>
            </div>
            
            <div className='space-y-3'>
              <p className='text-gray-400'>
                Não tem uma conta?{' '}
                <Link
                  to='/register'
                  className='text-green-400 hover:text-green-300 font-semibold link-hover-effect'
                >
                  Criar conta
                </Link>
              </p>
              <p className='text-gray-400'>
                <Link
                  to='/recover-password'
                  className='text-green-400 hover:text-green-300 font-medium link-hover-effect'
                >
                  Esqueceu sua senha?
                </Link>
              </p>
            </div>

            {/* Back to home */}
            <div className='pt-4'>
              <Link
                to='/'
                className='inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm'
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}