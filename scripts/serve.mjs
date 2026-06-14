import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"]
]);

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = normalize(cleanPath === "/" ? "/index.html" : cleanPath);
  const absolute = resolve(join(root, candidate));
  if (!absolute.startsWith(root)) {
    return null;
  }
  return absolute;
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || "/");
  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes.get(extname(filePath)) || "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`Signal Below running at http://localhost:${port}`);
});
