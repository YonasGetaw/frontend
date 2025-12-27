import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { http } from "../../api/http";

const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ defaultValues: { password: "", confirmPassword: "" } });

  if (done) {
    return (
      <div>
        <div className="text-2xl font-semibold text-slate-900">Password updated</div>
        <div className="mt-2 text-sm text-slate-600">You can now login with your new password.</div>
        <div className="mt-6">
          <Link to="/login" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-slate-900">Reset password</div>
        <div className="mt-1 text-sm text-slate-600">Choose a strong new password</div>
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
          if (!token) {
            setServerError("Missing reset token. Please use the link from your email.");
            return;
          }

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
            await http.post("/auth/reset-password", { token, ...parsed.data });
            setDone(true);
          } catch (e: any) {
            setServerError(e?.response?.data?.message ?? "Reset failed");
          }
        })}
      >
        <Input
          label="New password"
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
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
