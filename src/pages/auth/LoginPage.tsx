import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { useAuthStore } from "../../state/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "" }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</div>
        <div className="mt-1.5 text-sm text-slate-500">Sign in to continue to your dashboard</div>
      </div>

      {serverError ? (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      ) : null}

      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          setServerError(null);
          const parsed = schema.safeParse(values);
          if (!parsed.success) {
            setServerError("Please enter valid credentials.");
            return;
          }

          try {
            await login(parsed.data);
            navigate("/", { replace: true });
          } catch (e: any) {
            setServerError(e?.response?.data?.message ?? "Login failed");
          }
        })}
      >
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors">
            Forgot password?
          </Link>
          <Link to="/register" className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
            Create account
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured with end-to-end encryption
      </div>
    </div>
  );
}
