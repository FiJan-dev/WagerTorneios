import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CadastroPartida from "./pages/CadastroPartida";
import Footer from "./components/Footer"; // Adjust path as needed
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PlayerProfile from "./pages/PlayerProfile";
import CadastroCampeonato from "./pages/CadastroCampeonato";
import RecoverPassword from "./pages/RecoverPassword";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/cadastropartida" element={<CadastroPartida />} />
          <Route path="/cadastrocampeonato" element={<CadastroCampeonato />} />
          <Route path="/playerprofile" element={<PlayerProfile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;