import { ensureDir } from "https://deno.land/std@0.213.0/fs/mod.ts";
import { dirname, join } from "https://deno.land/std@0.213.0/path/mod.ts";
import * as sass from "npm:sass@^1.86.0";

const inputDir = "src/styles";
const outputDir = ".dev/static/css";

export const compileSass = async () => {
  for await (const entry of Deno.readDir(inputDir)) {
    if (entry.isFile && entry.name.endsWith(".scss")) {
      const inputPath = join(inputDir, entry.name);
      const outputPath = join(outputDir, entry.name.replace(/\.scss$/, ".css"));
      await ensureDir(dirname(outputPath));
      const result = sass.compile(inputPath);
      await Deno.writeTextFile(outputPath, result.css);
    }
  }
};

if (import.meta.main) {
  await compileSass();
}
