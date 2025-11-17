import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './OlheiroProfile.css';

export default function OlheiroProfile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="olheiro-profile-page">
        <SideBar_Olheiro />
        <div className="profile-container">
          <div className="loading-state">
            <p>Carregando informações do usuário...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get the first letter of the name for the avatar
  const avatarLetter = user.nome ? user.nome.charAt(0).toUpperCase() : 'O';
  const isUserAdmin = user.admin === 1;

  return (
    <div className="olheiro-profile-page">
      <SideBar_Olheiro />
      <div className="profile-container">
        <div className="profile-content">
          
          {/* Header Section */}
          <div className="profile-header">
            <div className="avatar-large">
              {avatarLetter}
            </div>
            <h1 className="profile-title">
              {user.nome}
            </h1>
            <p className="profile-email">
              {user.email}
            </p>
            {isUserAdmin && (
              <span className="admin-badge">
                Administrador
              </span>
            )}
          </div>

          {/* Info Cards Grid */}
          <div className="info-grid">
            
            {/* About Card */}
            <div className="info-card">
              <h3 className="card-title">Sobre</h3>
              <p className="card-text">
                {isUserAdmin 
                  ? 'Administrador da plataforma com acesso completo a todas as funcionalidades do sistema.'
                  : 'Olheiro responsável por avaliar e acompanhar jogadores, criar relatórios e identificar talentos promissores.'}
              </p>
            </div>

            {/* Account Info Card */}
            <div className="info-card">
              <h3 className="card-title">Informações da Conta</h3>
              <ul className="info-list">
                <li>
                  <span className="info-label">ID:</span>
                  <span className="info-value">{user.id}</span>
                </li>
                <li>
                  <span className="info-label">Nome:</span>
                  <span className="info-value">{user.nome}</span>
                </li>
                <li>
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </li>
                <li>
                  <span className="info-label">Tipo:</span>
                  <span className="info-value">{isUserAdmin ? 'Administrador' : 'Olheiro'}</span>
                </li>
                <li>
                  <span className="info-label">Status:</span>
                  <span className="status-active">Ativo</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}