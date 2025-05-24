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

          <NavBar logoText="MyanSen" navItems={navItems} />
    );
}