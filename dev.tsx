/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { renderToString } from "react-dom/server";
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { metadataMap } from "@/routes.tsx";
import { defaultMetadata } from "@/utils/metaData.ts";
import { Head } from "@/components/Head.tsx";
import { Body } from "@/components/Body.tsx";

serve((req) => {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/blog/static/")) {
    return serveDir(
      new Request(req.url.replace("/blog/static", "/static"), req),
      {
        fsRoot: ".",
      },
    );
  }

  const html = renderToString(
    <html lang="ja">
      {Head(metadataMap[url.pathname]?.() ?? defaultMetadata)}
      {Body(url.pathname)}
    </html>,
  );

  return new Response(`<!DOCTYPE html>${html}`, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
