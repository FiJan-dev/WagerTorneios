import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CadastroPartidaLista from './pages/CadastroPartidaLista';
import CadastroPartida from './pages/CadastroPartida';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OlheiroProfile from './pages/OlheiroProfile';
import CadastroCampeonato from './pages/CadastroCampeonato';
import CadastroCampeonatoLista from './pages/CadastroCampeonatoLista';
import RecoverPassword from './pages/RecoverPassword';
import HomePage from './pages/HomePage';
import PlayerList from './pages/PlayerList';
import PlayerListCadastro from './pages/PlayerListCadastro';
import './App.css';
import GraficoDados from './pages/Grafico';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/recover-password' element={<RecoverPassword />} />
            <Route
              path='/cadastropartidalista'
              element={
                <ProtectedRoute>
                  <CadastroPartidaLista />
                </ProtectedRoute>
              }
            />
            <Route
              path='/cadastropartida'
              element={
                <ProtectedRoute>
                  <CadastroPartida />
                </ProtectedRoute>
              }
            />
            <Route
              path='/cadastrocampeonatolista'
              element={
                <ProtectedRoute>
                  <CadastroCampeonatoLista />
                </ProtectedRoute>
              }
            />
            <Route
              path='/cadastrocampeonato'
              element={
                <ProtectedRoute>
                  <CadastroCampeonato />
                </ProtectedRoute>
              }
            />
            <Route
              path='/olheiropropfile'
              element={
                <ProtectedRoute>
                  <OlheiroProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <PlayerList />
                </ProtectedRoute>
              }
            />
            <Route
              path='/cadastrojogador'
              element={
                <ProtectedRoute>
                  <PlayerListCadastro />
                </ProtectedRoute>
              }
            />
            <Route
              path='/grafico/:id'
              element={
                <ProtectedRoute>
                  <GraficoDados />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<h1 className='text-white'>Página não encontrada</h1>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;