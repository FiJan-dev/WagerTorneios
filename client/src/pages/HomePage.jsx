import { Link } from 'react-router-dom';
import backgroundImage from '../assets/backg.jpg';
import './HomePage.css';

export default function HomePage() {
  const features = [
    {
      icon: "🏆",
      title: "Gestão de Torneios",
      description: "Organize e acompanhe campeonatos com facilidade"
    },
    {
      icon: "⚽",
      title: "Controle de Partidas",
      description: "Gerencie resultados e estatísticas em tempo real"
    },
    {
      icon: "👥",
      title: "Perfis de Jogadores",
      description: "Monitore e avalie o desempenho dos atletas"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center animate-fade-in-scale">
            <div className="relative group animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-glow"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-white/20">
                WT
              </div>
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl font-black mb-6 gradient-text leading-relaxed animate-slide-up delay-100">
            WagerTorneios
          </h1>
          
          {/* Subtitle */}
          <div className="relative animate-slide-up delay-200">
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
              A plataforma definitiva para{' '}
              <span className="text-green-400 font-semibold">olheiros profissionais</span>
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Descubra talentos, organize competições e acompanhe o desempenho dos atletas 
              com ferramentas avançadas de gestão esportiva
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up delay-300">
            <Link
              to="/login"
              className="btn-primary group relative px-8 py-4 text-white font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 hover-lift overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                Entrar na Plataforma
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-green-500 hover:text-green-400 hover:shadow-lg transition-all duration-300 hover-lift"
            >
              Criar Conta
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group glass-card rounded-2xl p-8 text-center hover:bg-white/10 hover:border-green-500/30 transition-all duration-500 hover-lift animate-slide-up delay-${(index + 4) * 100}`}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}