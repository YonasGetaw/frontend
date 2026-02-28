import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Gift, ArrowRight } from "lucide-react";

import { http } from "../../api/http";
import { env } from "../../env";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
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
    <div className="space-y-8">
      {/* Hero Card */}
      <Card className="overflow-hidden p-0 border-0 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 text-white shadow-lg shadow-teal-800/15">
        <div className="relative p-6 md:p-8">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}} />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden shrink-0 md:block">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                  <span className="text-2xl font-bold text-white">V</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">Vestoria</div>
                <div className="mt-1 text-sm text-teal-200">Your trusted commerce platform</div>
              </div>
            </div>
            <Button
              variant="accent"
              className="w-fit"
              onClick={() => navigate("/app/products")}
            >
              Start shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-slate-50">
            <img
              src="/image.png"
              alt="Vestoria company"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              About Vestoria
            </div>
            <div className="mt-3 text-xl font-bold text-slate-900 tracking-tight">Trusted by our community</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-500">
              Vestoria helps you buy products with clear payment instructions and transparent order status updates.
              Upload your payment proof, then track your order from Pending to Approved/Completed.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate("/app/orders")}>Track orders</Button>
              <Button onClick={() => navigate("/app/products")}>Browse products</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Feature Cards */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">Why choose Vestoria</div>
            <div className="text-sm text-slate-500">Simple steps, transparent status, and clear rewards</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Shield className="h-5 w-5" />}
            color="teal"
            title="Secure payments"
            desc="Use Bank, Telebirr, or CBE Birr and upload proof easily."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            color="amber"
            title="Fast order tracking"
            desc="Follow your order status from Pending to Approved/Completed."
          />
          <FeatureCard
            icon={<Gift className="h-5 w-5" />}
            color="teal"
            title="Invite & earn"
            desc="Share your referral code and get rewards from your team."
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-teal-500">
          <div className="text-sm font-bold text-slate-900">Fast checkout</div>
          <div className="mt-1 text-sm text-slate-500 leading-relaxed">Choose bank / Telebirr / CBE Birr and place an order instantly.</div>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <div className="text-sm font-bold text-slate-900">Clear status tracking</div>
          <div className="mt-1 text-sm text-slate-500 leading-relaxed">{"Pending, Approved, Rejected, Completed \u2014 always transparent."}</div>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <div className="text-sm font-bold text-slate-900">Admin curated</div>
          <div className="mt-1 text-sm text-slate-500 leading-relaxed">Products and payment details are maintained by administrators.</div>
        </Card>
      </div>

      <SpinRewardCard title="Spin (Invite Gift)" />

      {/* Featured Products */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-bold text-slate-900 tracking-tight">Featured products</div>
          <div className="text-sm text-slate-500">Latest items added by the admin</div>
        </div>
        <Button variant="secondary" onClick={() => navigate("/app/products")}>
          See all
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(featured.data ?? []).map((p) => (
          <Card key={p.id} className="p-0 overflow-hidden group">
            <div className="aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
              <img
                src={toPublicUrl(p.imageUrl)}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="h-full w-full flex items-center justify-center text-xs text-slate-400">Image not available</div>`;
                  }
                }}
              />
            </div>
            <div className="p-5">
              <div className="text-sm font-bold text-slate-900">{p.name}</div>
              <div className="mt-1 line-clamp-2 text-sm text-slate-500">{p.description}</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-base font-bold text-teal-700">ETB {(p.priceCents / 100).toFixed(2)}</div>
                <Button onClick={() => (window.location.href = `/app/products?buy=${p.id}`)}>Buy</Button>
              </div>
            </div>
          </Card>
        ))}

        {featured.isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FeatureCard(props: { icon: React.ReactNode; color: "teal" | "amber"; title: string; desc: string }) {
  return (
    <Card className="group">
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          props.color === "teal"
            ? "bg-teal-50 text-teal-700 group-hover:bg-teal-100"
            : "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
        }`}
      >
        {props.icon}
      </div>
      <div className="text-sm font-bold text-slate-900">{props.title}</div>
      <div className="mt-1 text-sm text-slate-500 leading-relaxed">{props.desc}</div>
    </Card>
  );
}
