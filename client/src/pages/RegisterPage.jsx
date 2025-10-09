import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register submitted', { name, email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md">
            W
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
          Junte-se a nós
        </h1>
        <p className="text-center text-gray-300 text-base mb-6">
          Crie uma conta para começar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <small className="text-gray-400 block">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-green-500 hover:text-green-400 transition-colors duration-200 font-medium"
            >
              Entrar
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}