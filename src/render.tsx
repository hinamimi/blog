import { createRoot } from "https://esm.sh/react-dom@19.0.0/client?bundle";
import { Body } from "./components/Body.tsx";
import process from "https://esm.sh/process@0.11.10";

globalThis.process = process;

const execRender = () => {
  createRoot(document.querySelector("body")!).render(
    <>
      {Body(location.pathname)}
    </>,
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
    console.log(Body(location.pathname));
    execRender();
  });
} else {
  console.log("Script loaded after DOMContentLoaded");
  console.log(Body(location.pathname));
  execRender();
}
