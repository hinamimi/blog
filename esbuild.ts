import type { esbuild } from "https://deno.land/x/esbuild_deno_loader@0.9.0/deps.ts";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";

const js = `// 開発環境用のホットリロードコード
const ws = new WebSocket(\`ws://\${window.location.host}/__esbuild_hmr\`);
ws.addEventListener('message', () => window.location.reload());`;

const devContext = {
  outdir: ".esbuild-dev/static/js",
  sourcemap: false,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

const buildContext = {
  outdir: "dist/blog/static/js",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

export const esbuildContext = (mode: "dev" | "build"): esbuild.BuildOptions => {
  return {
    entryPoints: ["tsx", "ts"].map((ext) => `src/**/*.${ext}`),
    bundle: true,
    format: "esm",
    splitting: true,
    target: ["es2020"],
    plugins: [...denoPlugins()],
    jsx: "automatic",
    jsxImportSource: "https://esm.sh/react@19.0.0",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    banner: {
      js,
    },
    ...(mode === "dev" ? devContext : buildContext),
  };
};
