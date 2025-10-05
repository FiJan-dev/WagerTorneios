import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (login or register) here
    console.log('Form submitted');
  };

  return (
    <div className="container grid-center login-page">
      <div className="login-card stack-lg">
        <div className="logo-container grid-center">
          <div className="logo">Logo</div>
        </div>

        <h1>{isLogin ? 'Bem vindo de volta' : 'Junte-se a nós'}</h1>
        <p>{isLogin ? 'Faça login para continuar sua jornada' : 'Crie uma conta para começar'}</p>

        <form onSubmit={handleSubmit} className="stack">
          {!isLogin && (
            <div className="stack-sm">
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                required={!isLogin}
                className="input-field stack-sm"
              />
            </div>
          )}

          <div className="stack-sm">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              required
              className="input-field stack-sm"
            />
          </div>

          <div className="stack-sm">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              required
              className="input-field stack-sm"
            />
          </div>

          {!isLogin && (
            <div className="stack-sm">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua senha"
                required={!isLogin}
                className="input-field stack-sm"
              />
            </div>
          )}

          <button type="submit" className="submit-button stack-sm">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="stack-sm grid-center">
          <small>
            {isLogin ? "Não tem uma conta? " : 'Já tem uma conta? '}
            <a href="#" onClick={toggleForm} className="toggle-link">
              {isLogin ? 'Registrar' : 'Entrar'}
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}