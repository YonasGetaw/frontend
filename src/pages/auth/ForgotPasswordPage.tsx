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
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
          <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">Check your email</div>
        <div className="mt-2 text-sm text-slate-500 leading-relaxed">
          If the email exists, a reset link has been sent. Please check your inbox.
        </div>
        <div className="mt-6">
          <Link to="/login" className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">Forgot password</div>
        <div className="mt-1.5 text-sm text-slate-500">{"We'll send you a secure reset link"}</div>
      </div>

      {serverError ? (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {serverError}
        </div>
      ) : null}

      <form
        className="space-y-5"
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

      <div className="mt-6 text-sm text-slate-500">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
