import NavBar from "@components/NavBar";

export default function NavBarMenuPage() {
  const navItems = [
    {
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      label: "API-services",
      link: "/apiservices",
    },
   
  ];
  return <NavBar logoText="MyanSen" navItems={navItems} />;
}
