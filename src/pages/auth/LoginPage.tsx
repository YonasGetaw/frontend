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
      <div className="mb-6">
        <div className="text-2xl font-semibold text-slate-900">Welcome back</div>
        <div className="mt-1 text-sm text-slate-600">Login to your dashboard</div>
      </div>

      {serverError ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {serverError}
        </div>
      ) : null}

      <form
        className="space-y-4"
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
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Forgot password?
          </Link>
          <Link to="/register" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Create account
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Login"}
        </Button>
      </form>

      <div className="mt-6 text-xs text-slate-500">
        Admin access is managed via seeded admin credentials.
      </div>
    </div>
  );
}
