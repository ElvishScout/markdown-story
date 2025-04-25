const fs = require("node:fs/promises");
const path = require("node:path");
const child_process = require("node:child_process");
const http = require("node:http");

const httpProxy = require("http-proxy");
const liveServer = require("live-server");

const HOME_PORT = 5171;
const TEMPLATE_PORT = 5172;
const SERVER_PORT_DEV = 5173;
const SERVER_PORT_PREVIEW = 4173;

const OUT_DIR = path.resolve(__dirname, "dist");

/** @param {{command: string; label: string}[]} tasks */
async function runAll(tasks) {
  const maxLabelLength = tasks.reduce((maxLength, { label }) => Math.max(maxLength, label.length), 0);
  return Promise.all(
    tasks.map(({ command, label }) => {
      return new Promise((resolve) => {
        const cp = child_process.exec(command);
        cp.stdout.on("data", (chunk) => {
          chunk.split("\n").forEach((line) => {
            const space = maxLabelLength - label.length;
            const left = Math.floor(space / 2);
            const right = space - left;
            const lbl = " ".repeat(left) + label + " ".repeat(right);
            console.log(`[ ${lbl} ]`, line);
          });
        });
        cp.on("exit", () => resolve());
      });
    })
  );
}

const scripts = {
  /** Currently `npm run dev` apply to `home` only. */
  dev() {
    runAll([
      { command: `cd home && npm run dev -- --port ${HOME_PORT}`, label: "home" },
      // { command: `cd template && npm run dev -- --port ${TEMPLATE_PORT}`, label: "template" },
    ]);

    const proxy = httpProxy.createProxyServer();
    proxy.on("error", (err, req, res) => {
      console.error(err);
      res.writeHead(404);
      res.end();
    });

    const server = http.createServer(async (req, res) => {
      const { pathname } = new URL(req.url, `http://${req.headers.host}`);

      if (pathname === "/template.html") {
        const template = await fs.readFile(path.resolve(__dirname, "dist/template.html"));
        res.writeHead(200, { "content-type": "text/html" });
        res.end(template);
        return;
      }

      proxy.web(req, res, {
        target: `http://localhost:${HOME_PORT}`,
      });
    });

    server.listen(SERVER_PORT_DEV).on("listening", () => {
      console.log(`Proxy server running on http://localhost:${SERVER_PORT_DEV}`);
    });
  },

  async build() {
    let stats = null;
    try {
      stats = await fs.stat(OUT_DIR);
    } catch {}

    if (stats) {
      if (!stats.isDirectory()) {
        return;
      }
      const entries = await fs.readdir(OUT_DIR);
      await Promise.all(
        entries.map(async (entry) => {
          await fs.rm(path.join(OUT_DIR, entry), { recursive: true });
        })
      );
    } else {
      await fs.mkdir(OUT_DIR, { recursive: true });
    }

    await runAll([
      { command: "cd home && npm run build", label: "home" },
      { command: "cd template && npm run build", label: "template" },
    ]);
  },

  preview() {
    liveServer.start({
      port: SERVER_PORT_PREVIEW,
      root: OUT_DIR,
      open: false,
      logLevel: 2,
    });
  },
};

const command = process.argv[2];
if (command && command in scripts) {
  scripts[command]();
}
