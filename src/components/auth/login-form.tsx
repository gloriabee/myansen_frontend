import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password_input";
import {
  Link,
  // useActionData,
  // useNavigation,
  // useSubmit,
} from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleLogin } from "@/utils/googleAuth";

// Validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);

      //fetch user profile with token
      const profileResponse = await fetch("http://localhost:8000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await profileResponse.json();

      const normalizedUser = {
        ...userData,
        name: userData.username,
      };
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      window.dispatchEvent(new Event("userChanged"));

      console.log("Login successful!");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        form.setError("email", { message: error.message });
      } else {
        console.error("Login error:", error);
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          className="md:w-[250px] w-full"
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Log In</h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="off"
                          placeholder="Email"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PasswordInput
                          placeholder="password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center">
                        <Link
                          to="/reset"
                          className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-primary_1">
                Login
              </Button>
            </div>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or Continue with
              </span>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLogin(credentialResponse.credential, navigate);
                }}
                onError={() => console.log("Login Failed")}
              />
            </div>
          </div>
        </form>
      </Form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
