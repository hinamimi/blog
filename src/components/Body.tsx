import { StaticRouter } from "https://esm.sh/react-router-dom@7.0.0";
import { Router } from "../routes.tsx";
import { MantineProvider } from "https://esm.sh/@mantine/core@6.0.0";

export const Body = (location: string) => (
  <StaticRouter location={location}>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router />
    </MantineProvider>
  </StaticRouter>
);
