import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  balanceCents: number;
  points: number;
  orders: {
    id: string;
    status: string;
    amountCents: number;
    createdAt: string;
  }[];
};

export function UserTeamPage() {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await http.get("/me/team");
      return res.data.teamMembers as TeamMember[];
    }
  });

  const totalOrders = teamMembers?.reduce((sum, member) => sum + member.orders.length, 0) ?? 0;
  const totalRevenue = teamMembers?.reduce((sum, member) => 
    sum + member.orders.filter(order => order.status === "APPROVED").reduce((orderSum, order) => orderSum + order.amountCents, 0), 0
  ) ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">My Team</div>
        <div className="mt-1 text-sm text-slate-600">View and manage your referred team members.</div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Metric title="Team Members" value={String(teamMembers?.length ?? 0)} />
          <Metric title="Total Orders" value={String(totalOrders)} />
          <Metric title="Total Revenue" value={`ETB ${(totalRevenue / 100).toFixed(2)}`} />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Team Members</div>
        <div className="divide-y divide-slate-200">
          {teamMembers?.map((member) => (
            <div key={member.id} className="px-4 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900">{member.name}</div>
                    <StatusPill isActive={member.isActive} />
                  </div>
                  <div className="text-sm text-slate-600">{member.email}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Joined: {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Balance:</span>
                      <span className="ml-2 font-medium text-slate-900">ETB {(member.balanceCents / 100).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Points:</span>
                      <span className="ml-2 font-medium text-slate-900">{member.points}</span>
                    </div>
                  </div>
                  {member.orders.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-600 mb-2">Recent Orders ({member.orders.length})</div>
                      <div className="space-y-1">
                        {member.orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">
                                ETB {(order.amountCents / 100).toFixed(2)}
                              </span>
                              <OrderStatusPill status={order.status} />
                            </div>
                          </div>
                        ))}
                        {member.orders.length > 3 && (
                          <div className="text-xs text-slate-500">
                            +{member.orders.length - 3} more orders
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Loading…</div> : null}
          {!isLoading && (teamMembers?.length ?? 0) === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-600">
              No team members yet. Start referring friends to build your team!
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function Metric(props: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{props.title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{props.value}</div>
    </div>
  );
}

function StatusPill({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-green-50 text-green-800 border-green-200"
          : "bg-slate-50 text-slate-800 border-slate-200"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function OrderStatusPill({ status }: { status: string }) {
  const colors = {
    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
    APPROVED: "bg-green-50 text-green-800 border-green-200",
    REJECTED: "bg-red-50 text-red-800 border-red-200",
    COMPLETED: "bg-blue-50 text-blue-800 border-blue-200"
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[status as keyof typeof colors] || colors.PENDING}`}>
      {status}
    </span>
  );
}
