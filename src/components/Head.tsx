import type Metadata from "../utils/metaData.ts";

export const Head = (metaData: Metadata) => (
  <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{metaData.title}</title>
    {metaData.description && <meta name="description" content={metaData.description} />}
    {metaData.ogImage && <meta property="og:image" content={metaData.ogImage} />}
    {metaData.description && <meta property="og:description" content={metaData.description} />}
    <meta property="og:title" content={metaData.title} />
    <meta property="og:type" content="website" />
    {metaData.additionalMeta?.map((meta) => (
      <meta key={meta.name} name={meta.name} content={meta.content} />
    ))}
    <link rel="icon" href="/blog/static/favicon.ico" />
  </>
);
