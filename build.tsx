/** @jsxImportSource https://esm.sh/react@18.2.0 */
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server";
import { copy, ensureDir } from "https://deno.land/std@0.192.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";

// 出力ディレクトリの設定
const DIST_DIR = "dist";

// App コンポーネント（後でファイルに分離することを想定）
const App = () => (
  <html lang="ja">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>hinamimi09 - Home</title>
    </head>
    <body>
      <h1>Welcome to hinamimi09's Homepage</h1>
      <p>This is a simple example of a TSX-powered static site.</p>
    </body>
  </html>
);

// ルーティング設定（後で別ファイルに分離することを想定）
const routes = [
  {
    path: "/",
    component: App,
    output: "index.html",
  },
  // 他のルートをここに追加
];

async function build() {
  try {
    console.log("🚀 Building static site...");

    // 出力ディレクトリをクリーンアップ
    try {
      await Deno.remove(DIST_DIR, { recursive: true });
    } catch {
      // ディレクトリが存在しない場合は無視
    }

    // 出力ディレクトリの作成
    await ensureDir(DIST_DIR);

    // 各ルートに対してHTMLを生成
    for (const route of routes) {
      const html = `<!DOCTYPE html>${renderToString(<route.component />)}`;
      const outputPath = join(DIST_DIR, route.output);

      // 必要に応じて親ディレクトリを作成
      await ensureDir(
        join(DIST_DIR, route.output.split("/").slice(0, -1).join("/")),
      );

      // HTMLファイルの書き出し
      await Deno.writeTextFile(outputPath, html);
      console.log(`📝 Generated: ${outputPath}`);
    }

    // 静的ファイルのコピー
    if (await exists("static")) {
      await copy("static", join(DIST_DIR, "static"), { overwrite: true });
      console.log("📁 Copied static files");
    }

    console.log("✨ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    Deno.exit(1);
  }
}

// ユーティリティ: ファイル/ディレクトリの存在チェック
async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

if (import.meta.main) {
  await build();
}
