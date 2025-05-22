import NavBar from "@components/NavBar";
import { Button } from "@/components/ui/button";

export default function HomePage() {
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
        <NavBar logoText="MyanSen" navItems={navItems} />
        <Button variant="outline">Button</Button>
      </>
    );
}
