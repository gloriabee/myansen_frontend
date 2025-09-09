import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "./components/ui/toaster";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ToastProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ToastProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
