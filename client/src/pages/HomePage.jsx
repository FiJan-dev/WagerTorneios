import { Link } from 'react-router-dom';
import backgroundImage from '../assets/backg.jpg';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/50 bg-cover bg-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(4px)',
          zIndex: -1,
        }}
      ></div>
      <div className="relative bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-8 sm:p-12 max-w-2xl w-full mx-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md">
            WT
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
          Bem-vindo ao WagerTorneios
        </h1>
        <p className="text-gray-200 text-base sm:text-lg mb-6">
          A plataforma definitiva para olheiros gerenciarem torneios, partidas e perfis de jogadores com facilidade. Descubra talentos, organize competições e acompanhe o desempenho dos atletas em tempo real.
        </p>
        <Link
          to="/login"
          className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all duration-200"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}