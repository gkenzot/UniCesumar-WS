import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { limparTentativas, listarTentativas, removerTentativa } from "../lib/workshopStorage.js";
import "../studeo-login.css";

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
    document.title = "Painel | Studeo Unicesumar";
    carregar();
    const id = setInterval(carregar, 2000);
    return () => clearInterval(id);
  }, [carregar]);

  async function limpar() {
    if (!confirm("Limpar todas as tentativas desta sessao?")) return;
    await limparTentativas();
    carregar();
  }

  async function apagarEntrada(id) {
    await removerTentativa(id);
    carregar();
  }

  return (
    <div className="studeo-page">
      <div className="painel-page-container">
        <div className="painel-scroll">
          <div className="container painel-content">
            <div className="text-center">
              <div
                className="logo-studeo logo-studeo-compact"
                role="img"
                aria-label="Studeo Unicesumar"
              />
            </div>

            <div className="aviso-card home-glass">
              <span className="aviso-badge">Painel do instrutor</span>
              <h1 className="aviso-card-titulo font-studeo bold">
                Tentativas registradas
              </h1>
              <p className="painel-desc">
                Atualiza a cada 2 segundos. Tentativas com mais de 10 minutos
                sao removidas automaticamente.
              </p>
              <div className="painel-actions">
                <Link
                  to="/"
                  className="btn btn-lg btn-studeo font-studeo all-caps fs-16 bold aviso-btn-opaco"
                >
                  Pagina de login
                </Link>
                <button
                  type="button"
                  className="btn btn-lg btn-studeo-danger font-studeo all-caps fs-16 bold aviso-btn-opaco"
                  onClick={limpar}
                >
                  Limpar sessao
                </button>
              </div>
            </div>

            {erro && (
              <div className="painel-alert-erro" role="alert">
                {erro}
              </div>
            )}

            {carregando && !erro && (
              <p className="painel-muted">Carregando...</p>
            )}

            {!carregando && !erro && tentativas.length === 0 && (
              <div className="aviso-card home-glass painel-empty">
                <p className="painel-empty-titulo font-studeo bold">
                  Nenhuma tentativa ainda
                </p>
                <p className="painel-desc">
                  Peça aos participantes para usar credenciais ficticias na
                  pagina de login.
                </p>
              </div>
            )}

            <ul className="painel-lista">
              {tentativas.map((t) => (
                <li key={t.id} className="aviso-card home-glass painel-item">
                  <div className="painel-item-top">
                    <strong className="painel-item-usuario">{t.usuario}</strong>
                    <div className="painel-item-meta">
                      <time className="painel-item-data">
                        {formatarData(t.dataHora)}
                      </time>
                      <button
                        type="button"
                        className="painel-btn-remover"
                        onClick={() => apagarEntrada(t.id)}
                        aria-label={`Remover tentativa de ${t.usuario}`}
                        title="Remover"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <dl className="aviso-credencial-detalhes">
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
        </div>
      </div>
    </div>
  );
}
