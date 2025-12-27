import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { http } from "../../api/http";

export function UserChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await http.post("/me/change-password", data);
      return res.data;
    },
    onSuccess: () => {
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
      alert("Password changed successfully!");
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Failed to change password. Please try again." });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 4) {
      newErrors.newPassword = "Password must be at least 4 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    changePasswordMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Change Password</div>
        <div className="mt-1 text-sm text-slate-600">Update your account password for security.</div>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          )}

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.currentPassword ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <div className="mt-1 text-xs text-red-600">{errors.currentPassword}</div>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.newPassword ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="Enter your new password"
            />
            {errors.newPassword && (
              <div className="mt-1 text-xs text-red-600">{errors.newPassword}</div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.confirmPassword ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <div className="mt-1 text-xs text-red-600">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600 space-y-1">
            <div>• Password must be at least 4 characters long</div>
            <div>• Choose a strong password with letters and numbers</div>
            <div>• Don't reuse passwords from other accounts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
