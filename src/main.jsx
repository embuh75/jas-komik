import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, persister } from "./lib/queryClient.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister }}>
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
);
