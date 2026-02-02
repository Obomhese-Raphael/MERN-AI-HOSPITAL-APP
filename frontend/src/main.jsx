import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
// src/main.jsx or src/App.jsx (whichever is rendered first)
import { initializeVapi } from './utils/vapi-client';

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

// Run once when app starts
if (PUBLIC_KEY) {
  try {
    initializeVapi(PUBLIC_KEY);
    console.log("Vapi client initialized globally at app start");
  } catch (err) {
    console.error("Global Vapi init failed:", err);
  }
} else {
  console.warn("VITE_VAPI_PUBLIC_KEY missing – voice calls disabled");
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("VITE_PUBLISHABLE_KEY is not defined");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>,
);
