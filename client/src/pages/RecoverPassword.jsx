import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        alert('Email de recuperação enviado com sucesso!');
        setEmail('');
        setIsSubmitting(false);
      }, 1000);
    } else {
      alert('Por favor, insira um email válido.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-md w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
            R
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
          Recuperação de Senha
        </h1>
        <p className="text-center text-gray-300 text-base mb-6">
          Insira seu email para receber o link de recuperação
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full max-w-md text-center"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
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
          <small className="text-gray-400 block">
            Ainda não possui uma conta?{' '}
            <Link
              to="/register"
              className="text-green-500 hover:text-green-400 transition-colors duration-200 font-medium"
            >
              Registrar
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}