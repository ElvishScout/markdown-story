const fs = require("node:fs/promises");
const path = require("node:path");
const child_process = require("child_process");
const http = require("http");
const httpProxy = require("http-proxy");

const HOME_PORT = 5173;
const TEMPLATE_PORT = 5174;
const SERVER_PORT = 5175;

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
    proxy.on("proxyRes", (proxyRes, req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");
    });
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

    server.listen(SERVER_PORT).on("listening", () => {
      console.log(`Proxy server running on http://localhost:${SERVER_PORT}`);
    });
  },
};

const command = process.argv[2];
if (command && command in scripts) {
  scripts[command]();
}
