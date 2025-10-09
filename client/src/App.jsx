import LoginPage from "./pages/LoginPage";
import CadastroCamp from "./pages/CadastroPartida";
import Footer from "./components/Footer"; // Adjust path as needed
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SideBar from "./components/SideBar";
import PlayerProfile from "./pages/PlayerProfile";
import CadCamp from "./pages/CadCamp";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastrocamp" element={<CadastroCamp />} />
          <Route path="/cadcamp" element={<CadCamp />} />
          <Route path="/playerprofile" element={<PlayerProfile/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;