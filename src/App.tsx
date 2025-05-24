import "./App.css";
// import { icons } from "./components/icons";
import HomePage from "@/pages/home/homepage";
import NavBarMenuPage from "@/pages/navbarMenu/navbarmenu";
import Footer from "@/components/Footer";



function App() {
  
  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <NavBarMenuPage />
        <main className="flex-grow">
          <HomePage />
        </main>

        <Footer year={2025} companyName="MyanmarSentiment API" />
      </div>

    </>
  );
}

export default App;
