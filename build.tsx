/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";
import { StaticRouter } from "https://esm.sh/react-router-dom@7.0.0";
import { App } from "./src/app.tsx";
import { ensureDir } from "https://deno.land/std@0.192.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";
import { copy } from "https://deno.land/std@0.224.0/fs/copy.ts";

// ビルド対象のパス
const routes = [
  "/blog",
  "/blog/posts/2025-02-23",
];

async function build() {
  try {
    console.log("🚀 Building static site...");

    // 出力ディレクトリのクリーンアップと作成
    const DIST_DIR = "dist";
    try {
      await Deno.remove(DIST_DIR, { recursive: true });
    } catch {
      // ディレクトリが存在しない場合は無視
    }
    await ensureDir(DIST_DIR);
    await copy("./static", "./dist/blog/static", { overwrite: true });

    // 各ルートに対してHTMLを生成
    for (const route of routes) {
      const html = renderToString(
        <html lang="ja">
          <head>
            <meta charSet="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>My Blog</title>
          </head>
          <body>
            <div id="root">
              <StaticRouter location={route}>
                <App />
              </StaticRouter>
            </div>
          </body>
        </html>,
      );

      // 出力パスの設定
      const outputPath = route === "/"
        ? join(DIST_DIR, "index.html")
        : join(DIST_DIR, route, "index.html");

      // 出力ディレクトリの作成
      await ensureDir(join(DIST_DIR, route));

      // HTMLファイルの書き出し
      await Deno.writeTextFile(outputPath, `<!DOCTYPE html>${html}`);
      console.log(`📝 Generated: ${outputPath}`);
    }

    console.log("✨ Build completed successfully!");
    Deno.exit(0);
  } catch (error) {
    console.error("❌ Build failed:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await build();
}
