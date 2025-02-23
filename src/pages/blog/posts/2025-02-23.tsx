/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { Link } from "react-router-dom";

export default function FirstPost() {
  return (
    <div>
      <h1>My First Post</h1>
      <p>Posted on February 23, 2025</p>
      <Link to="/blog">Home</Link>
    </div>
  );
}
