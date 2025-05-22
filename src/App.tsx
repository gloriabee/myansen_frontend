import "./App.css";
// import { icons } from "./components/icons";
import HomePage from "@/pages/home/homepage";
import NavBarMenuPage from "@/pages/navbarMenu/navbarmenu";


function App() {
  
  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <icons.dropdown />
      <icons.export />
      <icons.upload />
      <icons.loop /> */}
     <NavBarMenuPage/>
     <HomePage/>
    </>
  );
}

export default App;
