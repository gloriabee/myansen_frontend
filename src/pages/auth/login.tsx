import { LoginForm } from "@/components/auth/login-form";

const Login = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <LoginForm />
    </div>
  );
};

export default Login;
