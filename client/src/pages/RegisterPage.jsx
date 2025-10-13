import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from '../assets/backg.jpg';
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

  const API_BASE = "http://localhost:5000/api/olheiro"; // não mexe no seu .env do client

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
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-emerald-900/60"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl register-floating"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl register-floating"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl register-floating"></div>
      
      {/* Main content */}
      <div className='relative z-10 w-full max-w-lg mx-4 py-8'>
        <div className='glass-register-card rounded-3xl p-10 sm:p-12 animate-fade-in-scale'>
          
          {/* Logo section */}
          <div className='mb-8 flex justify-center animate-slide-in-top delay-100'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-rotate-glow'></div>
              <div className='relative w-20 h-20 bg-gradient-to-br from-emerald-600 via-green-500 to-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl ring-4 ring-white/20'>
                WT
              </div>
            </div>
          </div>

          {/* Header section */}
          <div className='text-center mb-10 animate-slide-in-top delay-200'>
            <h1 className='text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-emerald-200 mb-4'>
              Junte-se a nós
            </h1>
            <p className='text-gray-300 text-lg leading-relaxed'>
              Crie sua conta e descubra o futuro do
              <span className='text-emerald-400 font-semibold'> scouting esportivo</span>
            </p>
          </div>

          {/* Progress indicator */}
          <div className='flex items-center justify-center mb-10 animate-slide-in-top delay-300'>
            <div className='flex items-center gap-3'>
              <div className='progress-step active'></div>
              <div className='progress-line active w-8'></div>
              <div className='progress-step active'></div>
              <div className='progress-line w-8'></div>
              <div className='progress-step'></div>
            </div>
          </div>

          {/* Form section */}
          <form onSubmit={handleSubmit} className='space-y-8 animate-slide-in-bottom delay-400'>
            
            {/* Name input */}
            <div className='space-y-2 animate-slide-in-left delay-500'>
              <label htmlFor='name' className='block text-sm font-medium text-gray-300 ml-1'>
                Nome completo
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id='name'
                  type='text'
                  placeholder='Digite seu nome completo'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='glass-register-input w-full pl-12 pr-4 py-3 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none'
                />
              </div>
            </div>

            {/* Email input */}
            <div className='space-y-2 animate-slide-in-right delay-600'>
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
                  className='glass-register-input w-full pl-12 pr-4 py-3 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none'
                />
              </div>
            </div>

            {/* Password input */}
            <div className='space-y-2 animate-slide-in-left delay-700'>
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
                  placeholder='Digite sua senha (min. 6 caracteres)'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='glass-register-input w-full pl-12 pr-4 py-3 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none'
                />
              </div>
            </div>

            {/* Confirm Password input */}
            <div className='space-y-2 animate-slide-in-right delay-800'>
              <label htmlFor='confirm-password' className='block text-sm font-medium text-gray-300 ml-1'>
                Confirmar senha
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id='confirm-password'
                  type='password'
                  placeholder='Confirme sua senha'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='glass-register-input w-full pl-12 pr-4 py-3 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none'
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className='error-message rounded-lg p-4 animate-slide-in-bottom'>
                <p className='text-center text-red-400 text-sm flex items-center justify-center gap-2'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className='success-message rounded-lg p-4 animate-slide-in-bottom'>
                <p className='text-center text-emerald-400 text-sm flex items-center justify-center gap-2'>
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
              disabled={loading || success}
              className='btn-register-primary w-full py-3 px-6 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-bottom delay-500'
            >
              <span className='flex items-center justify-center gap-2'>
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Criando conta...
                  </>
                ) : success ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Conta criada!
                  </>
                ) : (
                  <>
                    Criar Conta
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
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
            
            <div className='space-y-3'>
              <p className='text-gray-400'>
                Já tem uma conta?{' '}
                <Link
                  to='/login'
                  className='text-emerald-400 hover:text-emerald-300 font-semibold register-link-hover'
                >
                  Faça login
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

            {/* Terms and privacy */}
            <div className='pt-2 text-xs text-gray-500'>
              <p>
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to='/terms' className='text-emerald-500 hover:text-emerald-400 register-link-hover'>
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to='/privacy' className='text-emerald-500 hover:text-emerald-400 register-link-hover'>
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
