import { useState } from 'react';
import SideBar_Olheiro from '../components/SideBar_Olheiro';

export default function PlayerProfile() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideBar_Olheiro />
      <div className="flex justify-center items-center min-h-screen w-full p-4 box-border">
        <div className="bg-black/90 backdrop-blur-sm border border-green-700 rounded-2xl p-6 sm:p-10 shadow-xl max-w-md w-full flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full grid place-items-center text-2xl font-bold text-white shadow-md">
              P
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mb-2">
            Perfil do Jogador
          </h1>
          <p className="text-center text-gray-300 text-base mb-6">
            Avalie o desempenho e histórico do jogador
          </p>

          {/* Player Info */}
          <div className="w-full flex flex-col items-center gap-4 mb-6">
            <div className="w-full flex flex-col items-center">
              <h2 className="text-xl font-semibold text-white">João Silva</h2>
              <p className="text-gray-300">Idade: 23 | Time: Estrela FC</p>
            </div>

            {/* Photo Area */}
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
              <span>Foto do Jogador</span>
            </div>

            {/* Description Area */}
            <div className="w-full">
              <h3 className="text-lg font-medium text-white mb-2">Descrição</h3>
              <p className="text-gray-300 text-sm">
                João é um meio-campista versátil com excelente visão de jogo e precisão nos passes. Destaque em assistências e gols decisivos na última temporada.
              </p>
            </div>

            {/* Statistics Area */}
            <div className="w-full">
              <h3 className="text-lg font-medium text-white mb-2">Estatísticas</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>Jogos: 45</li>
                <li>Gols: 12</li>
                <li>Assistências: 18</li>
                <li>Minutos Jogados: 3.820</li>
              </ul>
            </div>
          </div>

          {/* Comments Area */}
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-lg font-medium text-white">Comentários</h3>
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário sobre o jogador"
                className="px-4 py-2 rounded-lg border border-green-700 bg-black text-gray-100 text-center focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all duration-200 w-full max-w-md resize-none"
                rows="3"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2.5 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full max-w-md text-center"
              >
                Adicionar Comentário
              </button>
            </form>
            <div className="max-h-40 overflow-y-auto w-full">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-t border-green-700 py-2 text-gray-300 text-sm">
                    {comment.text}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Nenhum comentário ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}