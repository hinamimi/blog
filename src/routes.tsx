import { Route, Routes } from "https://esm.sh/react-router-dom@7.0.0";
import IndexPage, { meta_index } from "./pages/blog/index.tsx";
import FirstPost, { meta_20250223 } from "./pages/blog/posts/2025-02-23.tsx";
import type Metadata from "./utils/metaData.ts";

export const metadataMap: Record<string, () => Metadata> = {
  "/blog/": meta_index,
  "/blog/posts/2025-02-23/": meta_20250223,
};

export function Router() {
  return (
    <Routes>
      <Route path="/blog" element={<IndexPage />} />
      <Route path="/blog/posts/2025-02-23" element={<FirstPost />} />
    </Routes>
  );
}
