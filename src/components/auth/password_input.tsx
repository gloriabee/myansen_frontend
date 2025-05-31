import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-1 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={props.value === "" || props.disabled}
      >
        {showPassword ? (
          <EyeClosedIcon className="w-4 h-4" aria-hidden="true" />
        ) : (
          <EyeOpenIcon className="w-4 h-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
});
PasswordInput.displayName = "passwordInput";

export { PasswordInput };
