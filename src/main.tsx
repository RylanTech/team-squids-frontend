import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChurchProvider } from "./context/churchContext";
import { ChurchUserProvider } from "./context/churchUserContext";
import { EventProvider } from "./context/eventContext";
import './theme/index.css'
import { AppUserProvider } from "./context/appUserContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AppUserProvider>
      <ChurchUserProvider>
        <ChurchProvider>
          <EventProvider>
            <App />
          </EventProvider>
        </ChurchProvider>``
      </ChurchUserProvider>
    </AppUserProvider>
  </React.StrictMode>
);
