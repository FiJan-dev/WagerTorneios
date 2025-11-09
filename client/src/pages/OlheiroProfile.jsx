import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function OlheiroProfile() {

  return (
    <div className="flex min-h-screen bg-black">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-8 pt-20 box-border">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-8 sm:p-12 shadow-xl max-w-2xl w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              O
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-4">
            Perfil do Olheiro
          </h1>
          <p className="text-center text-gray-300 text-base mb-8">
            Informações e histórico do olheiro
          </p>

          {/* Olheiro Info */}
          <div className="w-full flex flex-col items-center gap-6 mb-8">
            <div className="w-full flex flex-col items-center mb-2">
              <h2 className="text-xl font-semibold text-white mb-1">Carlos Santos</h2>
              <p className="text-gray-300">Email: carlos.santos@email.com</p>
            </div>

            {/* Photo Area */}
            <div className="w-36 h-36 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 my-4">
              <span>Foto do Olheiro</span>
            </div>

            {/* Description Area */}
            <div className="w-full mb-4">
              <h3 className="text-lg font-medium text-white mb-3">Sobre</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Olheiro experiente com mais de 10 anos de experiência no futebol. Especialista em identificar talentos jovens e avaliar potencial técnico e tático dos jogadores.
              </p>
            </div>

            {/* Statistics Area */}
            <div className="w-full">
              <h3 className="text-lg font-medium text-white mb-3">Estatísticas</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>Jogadores Avaliados: 150</li>
                <li>Relatórios Criados: 89</li>
                <li>Campanhas Acompanhadas: 12</li>
                <li>Anos de Experiência: 10</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}