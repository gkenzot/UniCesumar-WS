const { spawn } = require("node:child_process");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [];
let shuttingDown = false;

function start(name, args) {
  const child = spawn(npmCommand, args, {
    cwd: __dirname,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  processes.push(child);

  child.stdout.on("data", (data) => {
    process.stdout.write(prefixLines(name, data));
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(prefixLines(name, data));
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;

    if (code && code !== 0) {
      console.error(`[${name}] encerrou com codigo ${code}`);
      shutdown(code);
    } else if (signal) {
      console.error(`[${name}] encerrado por sinal ${signal}`);
      shutdown(1);
    }
  });

  return child;
}

function prefixLines(name, data) {
  return data
    .toString()
    .split(/\r?\n/)
    .map((line) => (line ? `[${name}] ${line}` : line))
    .join("\n");
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exitCode = code;
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Iniciando backend e frontend...");
console.log("Login:  http://localhost:5173/");
console.log("Painel: http://localhost:5173/painel");
console.log("Use Ctrl+C para encerrar.\n");

start("backend", ["run", "dev", "--prefix", "server"]);

function iniciarFrontend() {
  start("frontend", ["run", "dev", "--prefix", "client"]);
}

function aguardarBackend(tentativa = 0) {
  const http = require("node:http");
  const req = http.get("http://127.0.0.1:3001/api/health", (res) => {
    res.resume();
    if (res.statusCode === 200) {
      iniciarFrontend();
      return;
    }
    repetir();
  });

  req.on("error", repetir);
  req.setTimeout(1000, () => {
    req.destroy();
    repetir();
  });

  function repetir() {
    if (tentativa >= 20) {
      console.error("Backend indisponivel. Iniciando frontend mesmo assim.\n");
      iniciarFrontend();
      return;
    }
    setTimeout(() => aguardarBackend(tentativa + 1), 500);
  }
}

setTimeout(() => aguardarBackend(), 500);
