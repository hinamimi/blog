import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.19.12/mod.js";
import { Html } from "./src/components/Html.tsx";
import { esbuildContext } from "./esbuild.ts";
import { ensureDir, walk } from "https://deno.land/std@0.213.0/fs/mod.ts";
import { compileSass } from "./sass.ts";

let ctx: esbuild.BuildContext | null = null;
const clients = new Set<WebSocket>();

const setupEsbuild = async () => {
  console.log("🔧 Setting up esbuild development server...");

  try {
    ctx = await esbuild.context(esbuildContext("dev"));
    await ctx.rebuild();
    console.log("✅ Initial build complete");

    await ctx.watch();
    console.log("👀 Watching for changes...");
  } catch (error) {
    console.error("❌ Failed to initialize esbuild context:", error);
    await cleanup();
  }
};

const startServer = async () => {
  await setupEsbuild();

  console.log("🚀 Starting development server...");
  serve(
    (req) => {
      const url = new URL(req.url);

      console.log(`🌐 ${req.method} ${url.pathname}`);

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
        return serveDir(new Request(req.url.replace("/blog/static", "/.dev/static"), req), {
          fsRoot: ".",
        });
      }

      if (url.pathname.startsWith("/static/")) {
        return serveDir(req, { fsRoot: "." });
      }

      const html = Html(url.pathname);
      return new Response(`<!DOCTYPE html>${html}`, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    },
    { port: 8000 },
  );
};

const notifyClients = async () => {
  console.log("🔄 Changes detected, rebuilding...");
  try {
    if (ctx) {
      await ctx.rebuild();
    }
    console.log("✅ Rebuild complete");

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("reload");
      }
    }
  } catch (error) {
    console.error("❌ Build failed:", error);
  }
};

const setupFileWatcher = () => {
  const watcher = Deno.watchFs(["./src", "./static", "./src/styles"]);

  (async () => {
    for await (const event of watcher) {
      if (["create", "modify", "remove"].includes(event.kind)) {
        if (event.paths.some((path) => path.endsWith(".scss"))) {
          await compileSass(".dev/static/css");
        }
        await notifyClients();
      }
    }
  })();
};

const cleanup = async () => {
  console.log("🧹 Cleaning up resources...");
  if (ctx) {
    await ctx.dispose();
  }
  Deno.exit(0);
};

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

const cleanDevDir = async (devDir: string) => {
  try {
    await Deno.remove(devDir, { recursive: true });
  } catch {
    console.warn("⚠️ No existing dev directory to clean up");
  }
};

const createSymlinks = async (srcDir: string, distDir: string) => {
  for await (const entry of walk(srcDir, { includeDirs: false, includeFiles: true })) {
    const absPath = await Deno.realPath(entry.path);
    const relPath = entry.path.substring(srcDir.length + 1);
    const linkPath = `${distDir}/${relPath}`;

    await ensureDir(linkPath.substring(0, linkPath.lastIndexOf("/")));

    try {
      await Deno.symlink(absPath, linkPath);
      console.log(`Linked: ${absPath} -> ${linkPath}`);
    } catch (error) {
      console.warn(`Skipping: ${linkPath} (already exists or error)`);
    }
  }
};

if (import.meta.main) {
  await cleanDevDir(".dev/static");
  await createSymlinks("static", ".dev/static");
  await compileSass(".dev/static/css");

  setupFileWatcher();
  await startServer();
}
