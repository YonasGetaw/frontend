import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { useAuthStore } from "../../state/auth";

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7).max(20).optional().or(z.literal("")),
    inviteCode: z.string().min(3).max(32).optional().or(z.literal("")),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);

  const [params] = useSearchParams();
  const inviteCodeFromUrl = useMemo(() => params.get("ref") ?? "", [params]);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", phone: "", inviteCode: inviteCodeFromUrl, password: "", confirmPassword: "" }
  });

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-slate-900">Create account</div>
        <div className="mt-1 text-sm text-slate-600">Get started in minutes</div>
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
            for (const issue of parsed.error.issues) {
              const field = issue.path[0] as keyof FormValues | undefined;
              if (field) {
                setError(field, { type: "manual", message: issue.message });
              }
            }
            setServerError("Please fix the highlighted fields.");
            return;
          }

          try {
            await registerUser({
              name: parsed.data.name,
              email: parsed.data.email,
              phone: parsed.data.phone ? parsed.data.phone : undefined,
              inviteCode: parsed.data.inviteCode ? parsed.data.inviteCode : undefined,
              password: parsed.data.password,
              confirmPassword: parsed.data.confirmPassword
            });
            navigate("/login", { replace: true });
          } catch (e: any) {
            setServerError(e?.response?.data?.message ?? "Registration failed");
          }
        })}
      >
        <Input
          label="Full name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name", {
            onChange: () => {
              clearErrors("name");
              setServerError(null);
            }
          })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email", {
            onChange: () => {
              clearErrors("email");
              setServerError(null);
            }
          })}
        />
        <Input
          label="Email/Phone (optional)"
          placeholder="Phone number"
          error={errors.phone?.message}
          {...register("phone", {
            onChange: () => {
              clearErrors("phone");
              setServerError(null);
            }
          })}
        />
        <Input
          label="Invite code (optional)"
          placeholder="Referral code"
          error={errors.inviteCode?.message}
          {...register("inviteCode", {
            onChange: () => {
              clearErrors("inviteCode");
              setServerError(null);
            }
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          error={errors.password?.message}
          {...register("password", {
            onChange: () => {
              clearErrors("password");
              setServerError(null);
            }
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            onChange: () => {
              clearErrors("confirmPassword");
              setServerError(null);
            }
          })}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Register"}
        </Button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Login
        </Link>
      </div>
    </div>
  );
}
