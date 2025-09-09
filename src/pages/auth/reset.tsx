import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Validation schema
const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export default function Reset({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState("");

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    try {
      const response = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Something went wrong");
      }

      setSuccessMessage("Password reset email sent successfully!");
      form.reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        form.setError("email", { message: error.message });
      }
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Form {...form}>
          <form
            className="md:w-[300px] w-full"
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Reset Password</h1>
              <p className="text-sm text-gray-500 text-center">
                Enter your email address to receive a password reset link.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary_1">
                Send Reset Link
              </Button>
            </div>

            {successMessage && (
              <p className="text-green-500 text-sm mt-4 text-center">
                {successMessage}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
