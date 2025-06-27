import { Link, useNavigate } from "react-router-dom";
import type { User } from "@/types/User";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { googleLogout } from "@react-oauth/google";
import { icons } from "../icons";

interface UserProps {
  user: User | null;
}

const AuthDropDown = ({ user }: UserProps) => {
  const navigate = useNavigate();
  if (!user) {
    return (
      <Button asChild>
        <Link to="/login">
          Sign In
          <span className="sr-only">Sign In</span>
        </Link>
      </Button>
    );
  }


  const displayName = user?.email?.[0]?.toUpperCase() ?? "?";


  // google logout function
  function handleLogout() {
    googleLogout();

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("userChanged"));

    navigate("/login");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="size-8 rounded-full">
          {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <icons.exit className="size-4 mr-2" aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropDown;
