import { Link } from "https://esm.sh/react-router-dom@7.0.0";
import type Metadata from "../../utils/metaData.ts";
import { defaultMetadata } from "../../utils/metaData.ts";

export function meta_index(): Metadata {
  return {
    ...defaultMetadata,
    path: "/blog",
    title: "My Blog",
    description: "This is a specific blog post about something interesting",
  };
}

export default function IndexPage() {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <p>This is the home page.</p>
      <ul>
        <li>
          <Link to="/blog/posts/2025-02-23/">2025-02-23</Link>
        </li>
      </ul>
    </div>
  );
}
