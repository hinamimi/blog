/** @jsxImportSource https://esm.sh/react@19.0.0 */
import * as esbuild from "https://deno.land/x/esbuild@v0.19.12/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";
import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";
import { ensureDir } from "https://deno.land/std@0.192.0/fs/mod.ts";
import { dirname, join } from "https://deno.land/std@0.192.0/path/mod.ts";
import { copy } from "https://deno.land/std@0.224.0/fs/copy.ts";
import { Body } from "@/components/Body.tsx";
import { Head } from "@/components/Head.tsx";
import { metadataMap } from "@/routes.tsx";
import { defaultMetadata } from "@/utils/metaData.ts";

// ビルド対象のパス
const routes = [
  "/blog/",
  "/blog/posts/2025-02-23/",
];

async function buildClient() {
  console.log("🔨 Building client bundle with esbuild...");

  // クライアントサイドのエントリーポイント
  const entryPoints = ["src/client.tsx"];

  const result = await esbuild.build({
    entryPoints,
    bundle: true,
    outdir: "dist/blog/static/js",
    format: "esm",
    splitting: true,
    minify: true,
    sourcemap: true,
    target: ["es2020", "chrome90", "firefox90", "safari13"],
    plugins: [...denoPlugins()],
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  if (result.errors.length > 0) {
    console.error("❌ Client build failed:", result.errors);
    Deno.exit(1);
  }

  console.log("✅ Client bundle built successfully!");
  return result;
}

async function generateStaticHTML() {
  console.log("📄 Generating static HTML...");

  // 出力ディレクトリのクリーンアップと作成
  const DIST_DIR = "dist";
  try {
    await Deno.remove(DIST_DIR, { recursive: true });
  } catch {
    // ディレクトリが存在しない場合は無視
  }
  await ensureDir(DIST_DIR);

  // 静的ファイルのコピー
  await copy("./static", "./dist/blog/static", { overwrite: true });

  // 各ルートに対してHTMLを生成
  for (const route of routes) {
    const html = renderToString(
      <html lang="ja">
        {Head(metadataMap[route]?.() ?? defaultMetadata)}
        {Body(route)}
      </html>,
    );

    // 出力パスの設定
    const outputPath = route === "/"
      ? join(DIST_DIR, "index.html")
      : join(DIST_DIR, route, "index.html");

    // 出力ディレクトリの作成
    await ensureDir(dirname(outputPath));

    // HTMLファイルの書き出し
    await Deno.writeTextFile(outputPath, `<!DOCTYPE html>${html}`);
    console.log(`📝 Generated: ${outputPath}`);
  }

  console.log("✅ Static HTML generated successfully!");
}

async function build() {
  try {
    console.log("🚀 Building static site...");

    // クライアントサイドのバンドルを生成
    await buildClient();

    // 静的HTMLを生成
    await generateStaticHTML();

    console.log("✨ Build completed successfully!");

    esbuild.stop();
    Deno.exit(0);
  } catch (error) {
    console.error("❌ Build failed:", error);
    esbuild.stop();
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await build();
}
