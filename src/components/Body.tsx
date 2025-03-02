/** @jsxImportSource https://esm.sh/react@19.0.0 */
import { StaticRouter } from "react-router-dom";
import { App } from "@/app.tsx";

export const Body = (location: string) => (
  <body>
    <div id="root">
      <StaticRouter location={location}>
        <App />
      </StaticRouter>
    </div>
  </body>
);
