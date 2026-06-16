import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { limparTentativas, listarTentativas } from "../lib/workshopStorage.js";

function formatarData(iso) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

function mascararSenha(senha) {
  const texto = String(senha);
  if (texto.length <= 3) return texto;
  return texto.slice(0, 3) + "*".repeat(texto.length - 3);
}

export default function PainelPage() {
  const [tentativas, setTentativas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setTentativas(await listarTentativas());
      setErro(null);
    } catch {
      setErro("Nao foi possivel carregar o painel.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    const id = setInterval(carregar, 2000);
    return () => clearInterval(id);
  }, [carregar]);

  async function limpar() {
    if (!confirm("Limpar todas as tentativas desta sessao?")) return;
    await limparTentativas();
    carregar();
  }

  return (
    <div className="page painel-page">
      <header className="painel-header">
        <div>
          <span className="badge-educativo">Painel do Instrutor</span>
          <h1>Tentativas registradas</h1>
          <p className="painel-desc">
            Atualiza a cada 2 segundos. Tentativas com mais de 10 minutos sao
            removidas automaticamente.
          </p>
        </div>
        <div className="painel-actions">
          <Link to="/" className="btn-secondary">
            Pagina de login
          </Link>
          <button type="button" className="btn-danger" onClick={limpar}>
            Limpar sessao
          </button>
        </div>
      </header>

      {erro && <div className="alert alert-erro">{erro}</div>}

      {carregando && !erro && <p className="muted">Carregando...</p>}

      {!carregando && !erro && tentativas.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma tentativa ainda.</p>
          <p className="muted">
            Peça aos participantes para usar credenciais ficticias na pagina de
            login.
          </p>
        </div>
      )}

      <ul className="tentativas-lista">
        {tentativas.map((t) => (
          <li key={t.id} className="tentativa-card">
            <div className="tentativa-top">
              <strong>{t.usuario}</strong>
              <time>{formatarData(t.dataHora)}</time>
            </div>
            <dl className="tentativa-detalhes">
              <div>
                <dt>Senha (ficticia)</dt>
                <dd>
                  <code>{mascararSenha(t.senha)}</code>
                </dd>
              </div>
              <div>
                <dt>Navegador</dt>
                <dd>{t.navegador}</dd>
              </div>
              <div>
                <dt>Sistema</dt>
                <dd>{t.sistema}</dd>
              </div>
              <div>
                <dt>Dispositivo</dt>
                <dd>{t.dispositivo}</dd>
              </div>
              <div>
                <dt>IP</dt>
                <dd>
                  <code>{t.ip}</code>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
