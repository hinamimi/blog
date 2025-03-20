/** @jsxImportSource https://esm.sh/react@19.0.0 */
import * as esbuild from "https://deno.land/x/esbuild@v0.19.12/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { metadataMap } from "@/routes.tsx";
import { defaultMetadata } from "@/utils/metaData.ts";
import { Head } from "@/components/Head.tsx";
import { Body } from "@/components/Body.tsx";

let ctx: esbuild.BuildContext | null = null;

async function setupEsbuild() {
  console.log("🔧 Setting up esbuild development server...");

  // 注: 実際のエントリーポイントのパスに合わせて調整してください
  const entryPoints = ["src/client.tsx"];

  ctx = await esbuild.context({
    entryPoints,
    bundle: true,
    outdir: ".esbuild-dev/static/js",
    format: "esm",
    splitting: true,
    sourcemap: true,
    target: ["es2020", "chrome90", "firefox90", "safari13"],
    plugins: [...denoPlugins()],
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    define: {
      "process.env.NODE_ENV": '"development"',
    },
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

  // ホットリロードのためのウォッチモードを開始
  await ctx.watch();
  console.log("👀 Watching for changes...");
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

    const html = renderToString(
      <html lang="ja">
        {Head(metadataMap[url.pathname]?.() ?? defaultMetadata)}
        {Body(url.pathname)}
        {/* クライアントサイドスクリプトの挿入 */}
        <script type="module" src="/blog/static/js/client.js"></script>
      </html>,
    );

    return new Response(`<!DOCTYPE html>${html}`, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }, { port: 8000 });

  console.log("🌐 Server running at http://localhost:8000/");
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

Deno.addSignalListener("SIGINT", cleanup);
Deno.addSignalListener("SIGTERM", cleanup);

if (import.meta.main) {
  setupFileWatcher();

  await startServer();
}
