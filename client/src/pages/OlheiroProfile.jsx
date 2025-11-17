import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './OlheiroProfile.css';

export default function OlheiroProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;

        try {
          // Enviar para o backend
          const token = localStorage.getItem('token');
          console.log('Enviando foto para o servidor...', { userId: user.id });
          
          const response = await fetch(`http://localhost:5000/api/olheiro/atualizar-foto/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ foto_perfil: base64String })
          });

          const data = await response.json();
          console.log('Resposta do servidor:', data);

          if (response.ok) {
            // Atualizar o contexto do usuário e localStorage
            const updatedUser = { ...user, foto_perfil: data.foto_perfil };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Foto de perfil atualizada com sucesso!');
          } else {
            console.error('Erro na resposta:', data);
            alert(data.error || 'Erro ao atualizar foto de perfil.');
          }
        } catch (fetchError) {
          console.error('Erro na requisição:', fetchError);
          alert('Erro ao conectar com o servidor.');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        alert('Erro ao ler o arquivo.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      alert('Erro ao fazer upload da foto.');
      setIsUploading(false);
    }
  };

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
            <div 
              className="avatar-container"
              onMouseEnter={() => setShowEditIcon(true)}
              onMouseLeave={() => setShowEditIcon(false)}
              onClick={handleImageClick}
            >
              {user.foto_perfil ? (
                <img 
                  src={user.foto_perfil} 
                  alt="Foto de perfil" 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-large">
                  {avatarLetter}
                </div>
              )}
              {showEditIcon && (
                <div className="avatar-overlay">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <span className="edit-text">
                    {isUploading ? 'Carregando...' : 'Editar foto'}
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
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