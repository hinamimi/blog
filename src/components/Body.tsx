import { StaticRouter } from "https://esm.sh/react-router-dom@7.0.0";
import { Router } from "../routes.tsx";

export const Body = (location: string) => (
  <StaticRouter location={location}>
    <Router />
  </StaticRouter>
);
