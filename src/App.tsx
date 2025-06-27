import "./App.css";
// import { icons } from "./components/icons";
import { Outlet } from "react-router-dom";
import NavBarMenuPage from "@/pages/navbarMenu/navbarmenu";

import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <NavBarMenuPage />
        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer year={2025} companyName="MyanmarSentiment API" />
      </div>
      <Toaster />
    </>
  );
}

export default App;
