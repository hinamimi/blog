/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./src/app.tsx";

serve((req) => {
  const url = new URL(req.url);

  const html = renderToString(
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Blog</title>
      </head>
      <body>
        <div id="root">
          <StaticRouter location={url.pathname}>
            <App />
          </StaticRouter>
        </div>
      </body>
    </html>,
  );

  return new Response(`<!DOCTYPE html>${html}`, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
