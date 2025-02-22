/** @jsxImportSource https://esm.sh/react@18.2.0 */
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.192.0/media_types/mod.ts";

// Static file handler
async function handleStaticFile(pathname: string): Promise<Response | null> {
  try {
    const filePath = join("static", pathname);
    const file = await Deno.readFile(filePath);
    const mimeType = contentType(pathname.split(".").pop() || "") ||
      "application/octet-stream";
    return new Response(file, {
      headers: { "content-type": mimeType },
    });
  } catch {
    return null;
  }
}

const App = () => (
  <html lang="ja">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>hinamimi09 - Home</title>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
          // Simple Live Reload
          const ws = new WebSocket('ws://' + location.host + '/_live');
          ws.onmessage = () => location.reload();
        `,
        }}
      />
    </head>
    <body>
      <h1>Welcome to hinamimi09's Homepage</h1>
      <p>This is a simple example of a TSX-powered Deno server.</p>
    </body>
  </html>
);

// WebSocket connections for live reload
const clients = new Set<WebSocket>();

serve(async (req) => {
  const url = new URL(req.url);

  // Handle WebSocket connections for live reload
  if (url.pathname === "/_live") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    clients.add(socket);
    socket.onclose = () => clients.delete(socket);
    return response;
  }

  // Handle static files
  if (url.pathname !== "/") {
    const staticResponse = await handleStaticFile(url.pathname);
    if (staticResponse) return staticResponse;
  }

  // Render React app
  const html = `<!DOCTYPE html>${renderToString(<App />)}`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});

// Watch for file changes and trigger live reload
if (import.meta.main) {
  const watcher = Deno.watchFs(".");
  for await (const event of watcher) {
    if (event.kind === "modify") {
      for (const client of clients) {
        client.send("reload");
      }
    }
  }
}
