import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";
import { Body } from "./components/Body.tsx";
import { Head } from "./components/Head.tsx";
import { metadataMap } from "./routes.tsx";
import { defaultMetadata } from "./utils/metaData.ts";

export function Html(key: string) {
  return renderToString(
    <html lang="ja">
      <head>{Head(metadataMap[key]?.() ?? defaultMetadata)}</head>
      <body>{Body(key)}</body>
    </html>,
  );
}

// TODO
export function Html2(key: string) {
  return renderToString(
    <html lang="ja">
      <head>
        {Head(metadataMap[key]?.() ?? defaultMetadata)}
        <script type="module" src="/blog/static/js/render.js" />
      </head>
      <body />
    </html>,
  );
}
