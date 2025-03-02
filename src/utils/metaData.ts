export default interface Metadata {
  path: string;
  title: string;
  description?: string;
  ogImage?: string;
  additionalMeta?: Array<{ name: string; content: string }>;
}

export const defaultMetadata: Partial<Metadata> = {
  title: "Hinamimi's Blog",
  description: "A blog about programming and technology",
  additionalMeta: [
    { name: "author", content: "hinamimi" },
    { name: "keywords", content: "blog, article, technology" },
  ],
};
