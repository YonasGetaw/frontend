import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { http } from "../../api/http";
import { env } from "../../env";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { NavigationBar } from "../../components/ui/NavigationBar";
import { SpinRewardCard } from "../../components/user/SpinRewardCard";

function toPublicUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${env.API_BASE_URL}${url}`;
}

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
};

export function UserHomePage() {
  const navigate = useNavigate();
  
  const featured = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await http.get("/products/featured");
      return res.data.products as Product[];
    }
  });

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <NavigationBar 
        title="Home"
        showBack={false}
      />

      <Card className="overflow-hidden bg-gradient-to-br from-brand-600 to-brand-400 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden shrink-0 md:block">
              <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20">
                <img src="/vestoria-logo.svg" alt="Vestoria" className="h-12 w-12" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold">Vestoria</div>
              <div className="mt-1 text-sm text-white/90">Official platform</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="aspect-[16/10] w-full bg-slate-100">
            <img
              src="/image.png"
              alt="Vestoria company"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-5 md:p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">About Vestoria</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">Trusted by our community</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-600">
              Vestoria helps you buy products with clear payment instructions and transparent order status updates.
              Upload your payment proof, then track your order from Pending to Approved/Completed.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => navigate("/app/orders")}>Track orders</Button>
              <Button onClick={() => navigate("/app/products")}>Start shopping</Button>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Why choose Vestoria</div>
            <div className="text-sm text-slate-600">Simple steps, transparent status, and clear rewards</div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0 overflow-hidden">
            <div className="aspect-[16/10] w-full bg-slate-100">
              <img src="/home-1.svg" alt="Secure payments" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-slate-900">Secure payments</div>
              <div className="mt-1 text-sm text-slate-600">Use Bank, Telebirr, or CBE Birr and upload proof easily.</div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="aspect-[16/10] w-full bg-slate-100">
              <img src="/home-2.svg" alt="Fast tracking" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-slate-900">Fast order tracking</div>
              <div className="mt-1 text-sm text-slate-600">Follow your order status from Pending to Approved/Completed.</div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="aspect-[16/10] w-full bg-slate-100">
              <img src="/home-3.svg" alt="Invite and earn" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-slate-900">Invite & earn</div>
              <div className="mt-1 text-sm text-slate-600">Share your referral code and get rewards from your team.</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm font-semibold text-slate-900">Fast checkout</div>
          <div className="mt-1 text-sm text-slate-600">Choose bank / Telebirr / CBE Birr and place an order instantly.</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-900">Clear status tracking</div>
          <div className="mt-1 text-sm text-slate-600">Pending, Approved, Rejected, Completed — always transparent.</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-900">Admin curated</div>
          <div className="mt-1 text-sm text-slate-600">Products and payment details are maintained by administrators.</div>
        </Card>
      </div>

      <SpinRewardCard title="Spin (Invite Gift)" />

      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">Featured products</div>
          <div className="text-sm text-slate-600">Latest items added by the admin</div>
        </div>
        <Button variant="secondary" onClick={() => navigate("/app/products")}>See all</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(featured.data ?? []).map((p) => (
          <Card key={p.id} className="p-0 overflow-hidden">
            <div className="aspect-[16/10] w-full bg-slate-100">
              <img
                src={toPublicUrl(p.imageUrl)}
                alt={p.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="h-full w-full flex items-center justify-center text-xs text-slate-500">Image not available</div>`;
                  }
                }}
              />
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-slate-900">{p.name}</div>
              <div className="mt-1 line-clamp-2 text-sm text-slate-600">{p.description}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-brand-700">ETB {(p.priceCents / 100).toFixed(2)}</div>
                <Button onClick={() => (window.location.href = `/app/products?buy=${p.id}`)}>Buy</Button>
              </div>
            </div>
          </Card>
        ))}

        {featured.isLoading ? (
          <div className="text-sm text-slate-600">Loading…</div>
        ) : null}
      </div>
    </div>
  );
}
