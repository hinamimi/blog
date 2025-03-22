import { ensureDir } from "https://deno.land/std@0.192.0/fs/mod.ts";
import { dirname, join } from "https://deno.land/std@0.192.0/path/mod.ts";
import { copy } from "https://deno.land/std@0.224.0/fs/copy.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.19.12/mod.js";
import { Html } from "./src/components/Html.tsx";
import { esbuildContext } from "./esbuild.ts";
import { routes } from "./src/routes.tsx";

const buildClient = async () => {
  console.log("🔨 Building client bundle with esbuild...");

  const result = await esbuild.build(esbuildContext("build"));

  if (result.errors.length > 0) {
    console.error("❌ Client build failed:", result.errors);
    Deno.exit(1);
  }

  console.log("✅ Client bundle built successfully!");
  return result;
};

const generateStaticHTML = async () => {
  console.log("📄 Generating static HTML...");

  const DIST_DIR = "dist";
  try {
    await Deno.remove(DIST_DIR, { recursive: true });
  } catch {
    // ディレクトリが存在しない場合は無視
  }
  await ensureDir(DIST_DIR);

  await copy("./static", "./dist/blog/static", { overwrite: true });
  await copy(".dev/static/css", "./dist/blog/static/css", { overwrite: true });
  await copy(".dev/static/js", "./dist/blog/static/js", { overwrite: true });

  for (const [route] of Object.entries(routes)) {
    const outputPath =
      route === "/" ? join(DIST_DIR, "index.html") : join(DIST_DIR, route, "index.html");
    await ensureDir(dirname(outputPath));

    const html = Html(route);
    await Deno.writeTextFile(outputPath, `<!DOCTYPE html>${html}`);
    console.log(`📝 Generated: ${outputPath}`);
  }

  console.log("✅ Static HTML generated successfully!");
};

const build = async () => {
  try {
    console.log("🚀 Building static site...");

    await generateStaticHTML();
    await buildClient();

    console.log("✨ Build completed successfully!");

    esbuild.stop();
    Deno.exit(0);
  } catch (error) {
    console.error("❌ Build failed:", error);
    esbuild.stop();
    Deno.exit(1);
  }
};

if (import.meta.main) {
  await build();
}
