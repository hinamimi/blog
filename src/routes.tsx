/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/blog/index.tsx";
import FirstPost from "./pages/blog/posts/2025-02-23.tsx";

export function Router() {
  return (
    <Routes>
      <Route path="/blog" element={<IndexPage />} />
      <Route path="/blog/posts/2025-02-23" element={<FirstPost />} />
    </Routes>
  );
}
