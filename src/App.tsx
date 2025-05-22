import "./App.css";
import { icons } from "./components/icons";
import NavBar from "@components/NavBar";
import { Button } from "@/components/ui/button";

function App() {
  const navItems = [
    {
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      label: "API-services",
      link: "/apiservices",
    },
    {
      label: "Pricing",
      link: "/pricing",
    },
    {
      label: "Profile",
      link: "/profile",
    },
  ];
  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <icons.dropdown />
      <icons.export />
      <icons.upload />
      <icons.loop /> */}

      <NavBar logoText="MyanSen" navItems={navItems} />
      <Button variant="outline">Button</Button>
    </>
  );
}

export default App;
