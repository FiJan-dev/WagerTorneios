export default function Footer() {
  return (
    <footer className="bg-panel border-t border-panel-border text-text py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap gap-12">
          <p className="text-sm">&copy; 2025 WagerTorneios. Todos os direitos reservados.</p>
          <nav className="flex gap-10 flex-wrap">
            <a href="#home" className="text-text-muted hover:text-focus text-sm">Início</a>
            <a href="#about" className="text-text-muted hover:text-focus text-sm">Sobre</a>
            <a href="#contact" className="text-text-muted hover:text-focus text-sm">Contato</a>
            <a href="#privacy" className="text-text-muted hover:text-focus text-sm">Privacidade</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}