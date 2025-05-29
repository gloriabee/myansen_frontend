import { RegisterForm } from "@/components/auth/register-form";

const Register = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <RegisterForm />
    </div>
  );
};

export default Register;
