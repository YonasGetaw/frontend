import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { http } from "../../api/http";

const schema = z.object({ email: z.string().email() });

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ defaultValues: { email: "" } });

  if (done) {
    return (
      <div>
        <div className="text-2xl font-semibold text-slate-900">Check your email</div>
        <div className="mt-2 text-sm text-slate-600">
          If the email exists, a reset link has been sent. Please check your inbox.
        </div>
        <div className="mt-6">
          <Link to="/login" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-slate-900">Forgot password</div>
        <div className="mt-1 text-sm text-slate-600">We’ll send you a secure reset link</div>
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
            setServerError("Please enter a valid email.");
            return;
          }

          try {
            await http.post("/auth/forgot-password", parsed.data);
            setDone(true);
          } catch (e: any) {
            setServerError(e?.response?.data?.message ?? "Request failed");
          }
        })}
      >
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Login
        </Link>
      </div>
    </div>
  );
}
