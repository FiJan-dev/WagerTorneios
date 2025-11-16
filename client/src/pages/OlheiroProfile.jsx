import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SideBar_Olheiro from '../components/SideBar_Olheiro';
import './OlheiroProfile.css';

export default function OlheiroProfile() {
  const { token, user, updateUser } = useContext(AuthContext);
  const [olheiro, setOlheiro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nome_usuario: '',
    email_usuario: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const API_URL = 'http://localhost:5000/api/olheiro';

  useEffect(() => {
    if (user) {
      setOlheiro({
        id_usuario: user.id,
        nome_usuario: user.nome,
        email_usuario: user.email,
        admin: user.admin,
      });
      setEditForm({
        nome_usuario: user.nome,
        email_usuario: user.email,
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição - restaurar valores originais
      setEditForm({
        nome_usuario: olheiro.nome_usuario,
        email_usuario: olheiro.email_usuario,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await axios.put(
        `${API_URL}/atualizar/${olheiro.id_usuario}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok || response.data.message) {
        // Atualizar dados locais no estado
        setOlheiro(prev => ({
          ...prev,
          nome_usuario: editForm.nome_usuario,
          email_usuario: editForm.email_usuario,
        }));
        
        // Atualizar contexto de autenticação (para persistir após refresh)
        updateUser({
          nome: editForm.nome_usuario,
          email: editForm.email_usuario,
        });
        
        setIsEditing(false);
        alert('Perfil atualizado com sucesso!');
      } else {
        setError(response.data.error || 'Erro ao atualizar perfil.');
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.response?.data?.error || 'Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.novaSenha.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/recuperar-senha/${olheiro.email_usuario}`,
        { nova_senha: passwordForm.novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message) {
        setPasswordSuccess('Senha alterada com sucesso!');
        setPasswordForm({
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: '',
        });
        setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(response.data.error || 'Erro ao alterar senha.');
      }
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setPasswordError(err.response?.data?.error || 'Erro ao alterar senha.');
    }
  };

  if (isLoading) {
    return (
      <div className="olheiro-profile-page">
        <SideBar_Olheiro />
        <div className="profile-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !olheiro) {
    return (
      <div className="olheiro-profile-page">
        <SideBar_Olheiro />
        <div className="profile-container">
          <div className="error-state">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="olheiro-profile-page">
      <SideBar_Olheiro />
      
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="page-title">Meu Perfil</h1>
              <p className="page-subtitle">Gerencie suas informações pessoais</p>
            </div>
            {!isEditing && !isChangingPassword && (
              <button className="btn-edit" onClick={handleEditToggle}>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Avatar and Basic Info */}
          <div className="profile-card main-card">
            <div className="avatar-section">
              <div className="avatar-large">
                {olheiro.nome_usuario?.charAt(0).toUpperCase() || 'O'}
              </div>
              {olheiro.admin === 1 && (
                <span className="admin-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Administrador
                </span>
              )}
            </div>

            {!isEditing ? (
              <div className="info-display">
                <h2 className="user-name">{olheiro.nome_usuario}</h2>
                <p className="user-email">{olheiro.email_usuario}</p>
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-label">ID</span>
                    <span className="stat-value">#{olheiro.id_usuario}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tipo</span>
                    <span className="stat-value">{olheiro.admin === 1 ? 'Admin' : 'Olheiro'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="edit-form">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    name="nome_usuario"
                    value={editForm.nome_usuario}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    minLength={2}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email_usuario"
                    value={editForm.email_usuario}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {error && (
                  <div className="error-message">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" onClick={handleEditToggle} className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-save">
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Security Section */}
          {!isEditing && (
            <div className="profile-card security-card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Segurança
                </h3>
              </div>

              {!isChangingPassword ? (
                <div className="security-content">
                  <p className="security-description">
                    Mantenha sua conta segura alterando sua senha regularmente.
                  </p>
                  <button 
                    className="btn-change-password"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Alterar Senha
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label className="form-label">Nova Senha</label>
                    <input
                      type="password"
                      name="novaSenha"
                      value={passwordForm.novaSenha}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                      minLength={6}
                      placeholder="Digite a nova senha"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={passwordForm.confirmarSenha}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                      minLength={6}
                      placeholder="Confirme a nova senha"
                    />
                  </div>

                  {passwordError && (
                    <div className="error-message">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="success-message">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
                        setPasswordError('');
                      }}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save">
                      Alterar Senha
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}