import * as esbuild from "https://deno.land/x/esbuild@v0.19.12/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { Html, Html2 } from "./src/html.tsx";

let ctx: esbuild.BuildContext | null = null;

async function setupEsbuild() {
  console.log("🔧 Setting up esbuild development server...");

  // 注: 実際のエントリーポイントのパスに合わせて調整してください
  const entryPoints = ["src/render.tsx"];
  try {
    ctx = await esbuild.context({
      entryPoints,
      bundle: true,
      outdir: ".esbuild-dev/static/js",
      format: "esm",
      splitting: true,
      sourcemap: true,
      target: ["es2020", "chrome90", "firefox90", "safari13"],
      plugins: [...denoPlugins()],
      jsx: "automatic",
      jsxImportSource: "https://esm.sh/react@19.0.0",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
      banner: {
        js: `
          // 開発環境用のホットリロードコード
          const ws = new WebSocket(\`ws://\${window.location.host}/__esbuild_hmr\`);
          ws.addEventListener('message', () => window.location.reload());
        `,
      },
    });

    await ctx.rebuild();
    console.log("✅ Initial build complete");

    await ctx.watch();
    console.log("👀 Watching for changes...");
  } catch (error) {
    console.error("❌ Failed to initialize esbuild context:", error);
    await cleanup();
  }
}

const clients = new Set<WebSocket>();

async function startServer() {
  await setupEsbuild();

  console.log("🚀 Starting development server...");
  serve((req) => {
    const url = new URL(req.url);

    if (url.pathname === "/__esbuild_hmr") {
      if (req.headers.get("upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 400 });
      }

      const { socket, response } = Deno.upgradeWebSocket(req);
      clients.add(socket);

      socket.onclose = () => {
        clients.delete(socket);
      };

      return response;
    }

    if (url.pathname.startsWith("/blog/static/")) {
      return serveDir(
        new Request(
          req.url.replace("/blog/static", "/.esbuild-dev/static"),
          req,
        ),
        {
          fsRoot: ".",
        },
      );
    }

    if (url.pathname.startsWith("/static/")) {
      return serveDir(req, { fsRoot: "." });
    }

    const html = Html(url.pathname);
    return new Response(`<!DOCTYPE html>${html}`, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }, { port: 8000 });
}

async function notifyClients() {
  console.log("🔄 Changes detected, rebuilding...");
  try {
    if (ctx) {
      await ctx.rebuild();
    }
    console.log("✅ Rebuild complete");

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("reload");
      }
    });
  } catch (error) {
    console.error("❌ Build failed:", error);
  }
}

function setupFileWatcher() {
  const watcher = Deno.watchFs(["./src", "./static"]);

  (async () => {
    for await (const event of watcher) {
      if (["create", "modify", "remove"].includes(event.kind)) {
        await notifyClients();
      }
    }
  })();
}

async function cleanup() {
  console.log("🧹 Cleaning up resources...");
  if (ctx) {
    await ctx.dispose();
  }
  Deno.exit(0);
}

Deno.addSignalListener("SIGINT", () => {
  cleanup().catch((err) => {
    console.error("❌ Cleanup failed:", err);
    Deno.exit(1);
  });
});
Deno.addSignalListener("SIGTERM", () => {
  cleanup().catch((err) => {
    console.error("❌ Cleanup failed:", err);
    Deno.exit(1);
  });
});

if (import.meta.main) {
  setupFileWatcher();

  await startServer();
}
