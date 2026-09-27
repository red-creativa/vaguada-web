import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VaguadaLanding from "./VaguadaLanding.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VaguadaLanding />
  </StrictMode>,
);
