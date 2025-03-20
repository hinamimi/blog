/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";
import { Body } from "@/components/Body.tsx";
import { Head } from "@/components/Head.tsx";
import { metadataMap } from "@/routes.tsx";
import { defaultMetadata } from "@/utils/metaData.ts";

export function Html(key: string) {
  return renderToString(
    <html lang="ja">
      {Head(metadataMap[key]?.() ?? defaultMetadata)}
      {Body(key)}
      {/* クライアントサイドスクリプトの挿入 */}
      <script type="module" src="/blog/static/js/client.js"></script>
    </html>,
  );
}
