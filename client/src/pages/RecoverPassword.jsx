import { useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/backg.jpg';
import './RecoverPassword.css';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Por favor, insira um email válido.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um formato de email válido.');
      return;
    }

    setIsSubmitting(true);
    
    // Simula chamada da API
    setTimeout(() => {
      setSuccess('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setEmail('');
      setIsSubmitting(false);
    }, 2000);
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
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-red-900/60"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl recover-floating"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl recover-floating"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl recover-floating"></div>
      
      {/* Main content */}
      <div className='relative z-10 w-full max-w-lg mx-4 py-8'>
        <div className='glass-recover-card rounded-3xl p-10 sm:p-12 animate-fade-in-scale'>
          
          {/* Logo section */}
          <div className='mb-10 flex justify-center animate-slide-in-top delay-100'>
            <div className='relative group animate-lock-float'>
              <div className='absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-glow'></div>
              <div className='relative w-24 h-24 recover-logo rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-white/20'>
                <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Header section */}
          <div className='text-center mb-10 animate-slide-in-top delay-200'>
            <h1 className='text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-red-200 mb-4'>
              Recuperar Senha
            </h1>
            <p className='text-gray-300 text-lg leading-relaxed'>
              Não se preocupe! Insira seu email e enviaremos um
              <span className='text-red-400 font-semibold'> link de recuperação</span>
            </p>
          </div>

          {/* Steps indicator */}
          <div className='flex items-center justify-center mb-10 animate-slide-in-top delay-300'>
            <div className='flex items-center gap-3'>
              <div className='recover-step active'></div>
              <div className='recover-step-line active w-8'></div>
              <div className='recover-step'></div>
              <div className='recover-step-line w-8'></div>
              <div className='recover-step'></div>
            </div>
          </div>
          {/* Form section */}
          <form onSubmit={handleSubmit} className='space-y-8 animate-slide-in-bottom delay-400'>
            
            {/* Email input */}
            <div className='space-y-3 animate-slide-in-bottom delay-500'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-300 ml-1'>
                Endereço de Email
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
                  placeholder='Digite seu email cadastrado'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='glass-recover-input w-full pl-12 pr-4 py-4 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none text-lg'
                />
              </div>
              <p className='text-xs text-gray-500 ml-1'>
                Enviaremos um link seguro para redefinir sua senha
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className='error-recover-message rounded-lg p-4 animate-slide-in-bottom animate-email-pulse'>
                <p className='text-center text-red-400 text-sm flex items-center justify-center gap-2'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className='success-recover-message rounded-lg p-4 animate-slide-in-bottom animate-email-pulse'>
                <p className='text-center text-green-400 text-sm flex items-center justify-center gap-2'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type='submit'
              disabled={isSubmitting || success}
              className='btn-recover-primary w-full py-4 px-6 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-bottom delay-300'
            >
              <span className='flex items-center justify-center gap-3'>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Enviando email...
                  </>
                ) : success ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email enviado!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Link de Recuperação
                  </>
                )}
              </span>
            </button>
          </form>
          {/* Links section */}
          <div className='mt-12 text-center space-y-6 animate-slide-in-bottom delay-600'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-600'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-black/50 text-gray-400'>ou</span>
              </div>
            </div>
            
            <div className='space-y-4'>
              <p className='text-gray-400'>
                Lembrou da senha?{' '}
                <Link
                  to='/login'
                  className='text-red-400 hover:text-red-300 font-semibold recover-link-hover'
                >
                  Fazer login
                </Link>
              </p>
              
              <p className='text-gray-400'>
                Não tem uma conta?{' '}
                <Link
                  to='/register'
                  className='text-red-400 hover:text-red-300 font-semibold recover-link-hover'
                >
                  Criar conta
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

            {/* Security note */}
            <div className='pt-4 px-4 py-3 bg-gray-900/30 rounded-lg border border-gray-700/50'>
              <div className='flex items-start gap-3'>
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className='text-left'>
                  <p className='text-sm font-medium text-blue-400 mb-1'>Segurança</p>
                  <p className='text-xs text-gray-400'>
                    O link de recuperação é válido por 1 hora e pode ser usado apenas uma vez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}