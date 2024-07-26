import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import StoreProvider from "./store/StoreProvider";
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
