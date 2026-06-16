# UniCesumar WS — Workshop de Segurança

Material educativo para demonstrar, em ambiente controlado, como uma página falsa de login pode induzir pessoas a informar credenciais — e como reconhecer e prevenir esse tipo de ataque.

**Repositório:** [github.com/gkenzot/UniCesumar-WS](https://github.com/gkenzot/UniCesumar-WS)

**Demonstração online:** [gkenzot.github.io/UniCesumar-WS](https://gkenzot.github.io/UniCesumar-WS/)

> Use apenas com participantes informados, em ambiente autorizado, e **somente com credenciais fictícias**.

## O que o projeto faz

- Réplica visual educativa da tela de login do Studeo UniCesumar.
- Após o envio, exibe **"Senha incorreta."** (comportamento plausível de um site falso).
- Aviso educativo aparece **após a 3ª tentativa** de login.
- Painel do instrutor em `/painel` com tentativas registradas.
- Link **"Esqueceu sua senha?"** leva ao painel.

## Desenvolvimento local

```powershell
npm run install:all
npm run dev
```

- Login: `http://localhost:5173/`
- Painel: `http://localhost:5173/painel`

Para testar com backend local (painel centralizado no PC):

```powershell
npm run install:server
npm run dev:full
```

## Publicar no GitHub Pages

O deploy é automático via GitHub Actions ao fazer push na branch `main`.

1. No repositório GitHub: **Settings → Pages → Source: GitHub Actions**
2. Após o workflow concluir: `https://gkenzot.github.io/UniCesumar-WS/`

Build local (opcional):

```powershell
$env:GITHUB_PAGES="true"; npm run build:pages
```

## Fluxo da demonstração

1. Compartilhe o link do GitHub Pages com os participantes.
2. Participantes usam credenciais **fictícias** (ex.: `12345678901` / `senha-ficticia-123`).
3. A página simula erro de senha; a tentativa aparece no painel (`/painel`).
4. Discuta sinais de alerta: URL, HTTPS, rede Wi-Fi, MFA, etc.
5. Tentativas com mais de 10 minutos são removidas automaticamente.

## Estrutura

```text
client/          Frontend React (login + painel)
server/          API local opcional para testes
scripts/         Preparação do GitHub Pages
.github/         Workflow de deploy
```

## Uso ético

Este projeto existe apenas para educação e conscientização defensiva. Imitar serviços reais fora de um contexto autorizado, capturar credenciais verdadeiras ou operar em redes de terceiros sem consentimento é inadequado e pode ser ilegal.
