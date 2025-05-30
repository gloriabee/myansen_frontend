import "./App.css";
import HomePage from "@/pages/home/homepage";
import NavBarMenuPage from "@/pages/navbarMenu/navbarmenu";
import TestMLOpsPage from "@/pages/testMLOps/testMLOpsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Footer from "@/components/Footer";
import { Route, Routes } from "react-router-dom";
import ApiServicesPage from "./pages/apiservices/ApiServicesPage";

import Footer from "@/components/Footer";

function App() {
  
  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <NavBarMenuPage />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/testmlops" element={<TestMLOpsPage />}></Route>
            <Route path="/apiservices" element={<ApiServicesPage />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer year={2025} companyName="MyanmarSentiment API" />
      </div>
    </>
  );
}

export default App;
