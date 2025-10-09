export default function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-sm border-t border-green-700 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <p className="text-sm text-gray-300">&copy; 2025 WagerTorneios. Todos os direitos reservados.</p>
          <nav className="flex gap-6 flex-wrap">
            <a href="#home" className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">Início</a>
            <a href="#about" className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">Sobre</a>
            <a href="#contact" className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">Contato</a>
            <a href="#privacy" className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">Privacidade</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}