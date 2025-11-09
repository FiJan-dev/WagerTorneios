import './Footer.css';

export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-content-simple">
          <p className="footer-copyright">
            © 2025 WagerTorneios. Todos os direitos reservados.
          </p>
          <nav className="footer-nav">
            <a href="#recursos" className="footer-link">Recursos</a>
            <a href="#sobre" className="footer-link">Sobre</a>
            <a href="#contato" className="footer-link">Contato</a>
            <a href="#privacidade" className="footer-link">Privacidade</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}