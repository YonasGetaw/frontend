import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type User = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export function AdminUsersPage() {
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await http.get("/admin/users");
      return res.data.users as User[];
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">User Management</div>
        <div className="mt-1 text-sm text-slate-600">View registered users and activity basics</div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-4 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
          <div>Name</div>
          <div>Email</div>
          <div>Status</div>
          <div>Joined</div>
        </div>
        <div className="divide-y divide-slate-200">
          {(users.data ?? []).map((u) => (
            <div key={u.id} className="grid grid-cols-4 gap-2 px-4 py-3 text-sm">
              <div className="font-medium text-slate-900">{u.name}</div>
              <div className="text-slate-700">{u.email}</div>
              <div>
                <span
                  className={
                    "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " +
                    (u.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800")
                  }
                >
                  {u.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <div className="text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</div>
            </div>
          ))}

          {(users.data ?? []).length === 0 ? <div className="px-4 py-8 text-sm text-slate-600">No users.</div> : null}
        </div>
      </Card>

      {users.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}
