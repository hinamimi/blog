import type { JSX } from "https://esm.sh/@types/react@19.0.10/index.js";
import { Route, Routes } from "https://esm.sh/react-router-dom@7.0.0";
import IndexPage, { meta_index } from "./pages/blog/index.tsx";
import Post_20250223, { meta_20250223 } from "./pages/blog/posts/2025-02-23.tsx";
import type Metadata from "./utils/metaData.ts";

interface RouteConfig {
  path: string;
  meta: Metadata;
  element: JSX.Element;
}

export const routes: Record<string, RouteConfig> = {
  "/blog/": { path: "/blog/", meta: meta_index(), element: <IndexPage /> },
  "/blog/posts/2025-02-23/": {
    path: "/blog/posts/2025-02-23/",
    meta: meta_20250223(),
    element: <Post_20250223 />,
  },
};

export const Router = () => {
  return (
    <Routes>
      {Object.entries(routes).map(([key, { path, element }]) => (
        <Route key={key} path={path} element={element} />
      ))}
    </Routes>
  );
};
