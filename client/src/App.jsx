import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import PainelPage from "./pages/PainelPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/painel" element={<PainelPage />} />
      <Route
        path="*"
        element={
          <div className="center">
            <p>Pagina nao encontrada.</p>
            <Link to="/">Voltar ao login</Link>
          </div>
        }
      />
    </Routes>
  );
}
