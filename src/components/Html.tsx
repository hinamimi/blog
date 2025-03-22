import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";
import { routes } from "../routes.tsx";
import { defaultMetadata } from "../utils/metaData.ts";
import { Body } from "./Body.tsx";
import { Head } from "./Head.tsx";

export function Html(key: string) {
  return renderToString(
    <html lang="ja">
      <head>
        {Head(routes[key]?.meta ?? defaultMetadata)}
        <link rel="stylesheet" href="/blog/static/css/global.css" />
      </head>
      <body>{Body(key)}</body>
    </html>,
  );
}
