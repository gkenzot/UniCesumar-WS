import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listarTentativas } from "../lib/workshopStorage.js";
import { assetUrl } from "../lib/assetUrl.js";
import "../studeo-login.css";

export default function WorkshopAvisoPage() {
  const location = useLocation();
  const [credenciais, setCredenciais] = useState([]);

  useEffect(() => {
    document.title = "Aviso | Studeo Unicesumar";
  }, []);

  useEffect(() => {
    listarTentativas().then((itens) => {
      if (itens.length > 0) {
        setCredenciais([...itens].reverse());
        return;
      }

      if (location.state?.usuario) {
        setCredenciais([
          {
            usuario: location.state.usuario,
            senha: location.state.senha,
          },
        ]);
      }
    });
  }, [location.state]);

  return (
    <div className="studeo-page">
      <div className="home-container aviso-page-container">
        <div className="pull-bottom full-width bg-white home-glass text-center p-t-10 p-b-10">
          <img src={assetUrl("studeo/logo-bottom-std.png")} alt="" />
        </div>

        <div className="full-height aviso-scroll">
          <div className="container home-bottom-img full-height p-t-10">
            <div className="aviso-content">
              <div className="text-center">
                <div
                  className="logo-studeo logo-studeo-compact"
                  role="img"
                  aria-label="Studeo Unicesumar"
                />
              </div>

              <div className="aviso-card home-glass">
                <span className="aviso-badge">Workshop de segurança</span>
                <h1 className="aviso-card-titulo font-studeo bold">
                  Você participou de uma simulação
                </h1>
                <p className="aviso-card-lead">
                  Esta <strong>não é</strong> a página oficial do Studeo
                  Unicesumar. Trata-se de um exercício educativo para
                  conscientização sobre golpes digitais.
                </p>

                <div className="aviso-destaque">
                  <p>
                    <strong>Seus dados não foram enviados</strong> para a
                    Unicesumar nem para qualquer sistema real. Nada do que você
                    digitou aqui foi salvo de forma permanente.
                  </p>
                </div>
              </div>

              {credenciais.length > 0 && (
                <div className="aviso-card home-glass">
                  <h2 className="aviso-secao-titulo font-studeo bold">
                    Dados informados nesta simulação
                  </h2>
                  <p className="aviso-secao-texto">
                    Em um ataque real, estas informações seriam capturadas pelo
                    golpista:
                  </p>
                  <div className="aviso-credenciais">
                    {credenciais.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="aviso-credencial-item"
                      >
                        {credenciais.length > 1 && (
                          <span className="aviso-credencial-label">
                            Tentativa {index + 1}
                          </span>
                        )}
                        <dl className="aviso-credencial-detalhes">
                          <div>
                            <dt>Usuário/CPF</dt>
                            <dd>
                              <code>{item.usuario}</code>
                            </dd>
                          </div>
                          <div>
                            <dt>Senha</dt>
                            <dd>
                              <code>{item.senha}</code>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="aviso-card home-glass">
                <h2 className="aviso-secao-titulo font-studeo bold">
                  Como funciona o golpe Evil Twin
                </h2>
                <p className="aviso-secao-texto">
                  O <em>Evil Twin</em> (gêmeo maligno) é uma página falsa que
                  imita o visual de um site legítimo — como o login do Studeo,
                  do banco ou de redes sociais. O objetivo é enganar a vítima
                  para que ela informe usuário e senha, que são capturados pelo
                  atacante.
                </p>
                <ol className="aviso-lista">
                  <li>
                    Você recebe um link por e-mail, SMS ou mensagem em grupo
                    (ex.: &quot;atualize sua senha&quot; ou &quot;confira sua
                    nota&quot;).
                  </li>
                  <li>
                    O link leva a uma página quase idêntica à original, mas em
                    um endereço diferente.
                  </li>
                  <li>
                    Ao digitar suas credenciais, o atacante as recebe — mesmo
                    que a página mostre &quot;senha incorreta&quot; ou um erro
                    falso.
                  </li>
                  <li>
                    Com seu login, o criminoso pode acessar sua conta real,
                    alterar dados ou aplicar outros golpes.
                  </li>
                </ol>
              </div>

              <div className="aviso-card home-glass">
                <h2 className="aviso-secao-titulo font-studeo bold">
                  Como se proteger
                </h2>
                <ul className="aviso-lista aviso-lista-check">
                  <li>
                    <strong>Confira a URL</strong> — o site oficial da Unicesumar
                    não usa endereços estranhos ou encurtadores suspeitos.
                  </li>
                  <li>
                    <strong>Verifique o cadeado HTTPS</strong> — mas lembre-se:
                    sites falsos também podem ter HTTPS.
                  </li>
                  <li>
                    <strong>Desconfie de links em mensagens</strong> — acesse
                    portais digitando o endereço você mesmo ou usando favoritos
                    salvos.
                  </li>
                  <li>
                    <strong>Cuidado com redes Wi-Fi públicas</strong> — evite
                    acessar contas sensíveis em redes abertas.
                  </li>
                  <li>
                    <strong>Ative a verificação em duas etapas (MFA)</strong> —
                    mesmo que alguém obtenha sua senha, terá mais dificuldade
                    para entrar.
                  </li>
                  <li>
                    <strong>Nunca reutilize a mesma senha</strong> em serviços
                    diferentes.
                  </li>
                </ul>
              </div>

              <div className="aviso-botoes">
                <Link
                  to="/"
                  className="btn btn-lg btn-studeo font-studeo all-caps fs-16 bold aviso-btn-opaco"
                >
                  Voltar ao início
                </Link>
                <Link
                  to="/painel"
                  className="btn btn-lg btn-studeo-painel font-studeo all-caps fs-16 bold aviso-btn-opaco"
                >
                  Ir para o painel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
