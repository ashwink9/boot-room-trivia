import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const hosting = await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8");

await mkdir(new URL("../dist/server", import.meta.url), { recursive: true });
await mkdir(new URL("../dist/.openai", import.meta.url), { recursive: true });

await writeFile(new URL("../dist/index.html", import.meta.url), html);
await writeFile(new URL("../dist/.openai/hosting.json", import.meta.url), hosting);
await copyFile(new URL("../favicon.svg", import.meta.url), new URL("../dist/favicon.svg", import.meta.url));
await writeFile(
  new URL("../dist/server/index.js", import.meta.url),
  `const html = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return new Response("Not found", { status: 404 });
    }
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60"
      }
    });
  }
};
`
);
