import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { registrarTentativa } from "../lib/workshopStorage.js";
import "../studeo-login.css";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [avisoAberto, setAvisoAberto] = useState(false);
  const [tentativas, setTentativas] = useState(0);

  useEffect(() => {
    document.title = "Login | Studeo Unicesumar";
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setMensagem(null);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      await Promise.all([registrarTentativa(usuario, senha), delay(1200)]);

      const proximas = tentativas + 1;
      setTentativas(proximas);
      if (proximas >= 3) {
        setAvisoAberto(true);
      }

      setMensagem({ tipo: "erro", texto: "Senha incorreta." });
      setSenha("");
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err.message || "Nao foi possivel conectar ao servidor.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="studeo-page">
      {avisoAberto && (
        <div
          className="aviso-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aviso-titulo"
        >
          <div className="aviso-popup">
            <button
              type="button"
              className="aviso-fechar"
              onClick={() => setAvisoAberto(false)}
              aria-label="Fechar aviso"
            >
              ×
            </button>
            <h2 id="aviso-titulo" className="aviso-titulo">
              Simulação educativa
            </h2>
            <p className="aviso-texto">
              Esta é uma <strong>página falsa</strong> criada para workshop de
              segurança. Não informe credenciais reais.
            </p>
            <button
              type="button"
              className="aviso-btn"
              onClick={() => setAvisoAberto(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <div className="home-container">
        <div className="pull-bottom full-width bg-white home-glass text-center p-t-10 p-b-10">
          <img src="/studeo/logo-bottom-std.png" alt="" />
        </div>

        <div className="full-height">
          <div className="container home-bottom-img full-height p-t-10">
            <div className="row-home">
              <div className="hidden-xs col-sm-6">
                <div className="home-slogan home-glass font-studeo bold">
                  Seu
                  <br />
                  ambiente
                  <br />
                  virtual de
                  <br />
                  aprendizagem
                </div>
                <div className="info-text-home">
                  <span className="text-info-home-studeo">
                    A Universidade Unicesumar investe na melhoria da qualidade do
                    ensino, sempre atenta às necessidades e anseios da região.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-xs-offset-1 col-xs-10 col-sm-6 col-sm-offset-0">
              <div className="row" id="row-form">
                <div
                  className="col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-7"
                  id="login-form-studeo"
                >
                  <div className="text-center">
                    <div className="logo-studeo" role="img" aria-label="Studeo Unicesumar" />
                  </div>

                  <span className="login-info-studeo">
                    Entre com sua conta do Studeo ou CPF
                  </span>

                  <form
                    onSubmit={handleSubmit}
                    className="form-login-studeo"
                    name="formLogin"
                    autoComplete="on"
                  >
                    <div className="form-group form-group-default home-glass">
                      <label className="label-login fade" htmlFor="cpf">
                        Usuário/CPF
                      </label>
                      <div className="controls">
                        <input
                          type="text"
                          name="cpf"
                          id="cpf"
                          className="form-control"
                          placeholder="Digite o CPF"
                          value={usuario}
                          onChange={(e) => setUsuario(e.target.value)}
                          autoComplete="username"
                          inputMode="numeric"
                          aria-label="CPF"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="form-group form-group-default home-glass">
                      <label className="label-login fade" htmlFor="password">
                        Senha
                      </label>
                      <div className="controls">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="form-control"
                          placeholder="Digite a senha"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          autoComplete="current-password"
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        <button
                          type="submit"
                          className="btn btn-lg btn-studeo btn-block font-studeo all-caps fs-16 bold home-glass"
                          disabled={enviando}
                        >
                          {enviando ? "Carregando..." : "Entrar"}
                        </button>
                      </div>
                    </div>

                    {mensagem && (
                      <p
                        className={`studeo-feedback studeo-feedback-${mensagem.tipo}`}
                      >
                        {mensagem.texto}
                      </p>
                    )}
                  </form>

                  <Link
                    to="/painel"
                    className="padding-10 block text-center m-t-10 bold bg-white home-glass studeo-forgot-link"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
