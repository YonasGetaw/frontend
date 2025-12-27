import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { env } from "../../env";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { NavigationBar } from "../../components/ui/NavigationBar";
import { ProductCard } from "../../components/user/ProductCard";

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
  isActive: boolean;
  createdAt: string;
};

type PaymentSettings = {
  commercialBankName: string;
  commercialAccountNumber: string;
  telebirrPhone: string;
  cbeBirrPhone: string;
};

export function UserProductsPage() {
  const [params] = useSearchParams();
  const preselect = useMemo(() => params.get("buy"), [params]);

  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await http.get("/products");
      return res.data.products as Product[];
    }
  });

  const payment = useQuery({
    queryKey: ["payment-settings"],
    queryFn: async () => {
      const res = await http.get("/orders/payment-details");
      return res.data.settings as PaymentSettings;
    }
  });

  const [activeProductId, setActiveProductId] = useState<string | null>(preselect);

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <NavigationBar 
        title="Products"
        backTo="/app/home"
      />

      {/* Products Grid */}
      <div className="grid gap-6">
        {(products.data ?? []).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onPurchase={(productId) => setActiveProductId(productId)}
          />
        ))}

        {products.data && products.data.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back later for new products.</p>
          </Card>
        )}
      </div>

      {/* Payment Modal */}
      {activeProductId && (
        <PaymentPanel
          productId={activeProductId}
          settings={payment.data}
          onClose={() => setActiveProductId(null)}
        />
      )}

      {products.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}

function PaymentPanel(props: { productId: string; settings?: PaymentSettings; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COMMERCIAL_BANK" | "TELEBIRR" | "CBE_BIRR">("COMMERCIAL_BANK");

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading payment proof:", file.name);
      const res = await http.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Upload response:", res.data);
      setPaymentProof(res.data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus(err?.response?.data?.message || "Failed to upload proof");
    } finally {
      setUploading(false);
    }
  };

  const methods = [
    { key: "COMMERCIAL_BANK" as const, title: "Commercial Bank" },
    { key: "TELEBIRR" as const, title: "Telebirr" },
    { key: "CBE_BIRR" as const, title: "CBE Birr" }
  ];

  const handleSubmit = async () => {
    if (!paymentProof) return;
    setLoading(true);
    setStatus(null);
    try {
      await http.post("/orders", { productId: props.productId, paymentMethod, paymentProofImageUrl: paymentProof });
      setStatus("Order placed successfully!");
      setTimeout(() => {
        window.location.href = "/app/orders";
      }, 1200);
    } catch (e: any) {
      setStatus(e?.response?.data?.message ?? "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">Complete payment</div>
        <button className="text-sm font-medium text-slate-600 hover:text-slate-900" onClick={props.onClose}>
          Close
        </button>
      </div>

      {/* Admin payment details first */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin payment details</div>
        <div className="mt-2 grid gap-1 text-sm text-slate-700">
          <div>
            <span className="font-medium text-slate-900">Bank:</span> {props.settings?.commercialBankName ?? "—"}
          </div>
          <div>
            <span className="font-medium text-slate-900">Account:</span> {props.settings?.commercialAccountNumber ?? "—"}
          </div>
          <div>
            <span className="font-medium text-slate-900">Telebirr:</span> {props.settings?.telebirrPhone ?? "—"}
          </div>
          <div>
            <span className="font-medium text-slate-900">CBE Birr:</span> {props.settings?.cbeBirrPhone ?? "—"}
          </div>
        </div>
      </div>

      {/* Payment method selector */}
      <div className="mt-4">
        <div className="mb-1 text-sm font-medium text-slate-700">Select payment method</div>
        <div className="grid gap-2">
          {methods.map((m) => (
            <label key={m.key} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="paymentMethod"
                value={m.key}
                checked={paymentMethod === m.key}
                onChange={() => setPaymentMethod(m.key)}
              />
              <span>{m.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Upload screenshot */}
      <div className="mt-4">
        <div className="mb-1 text-sm font-medium text-slate-700">Upload payment proof (screenshot)</div>
        <input
          type="file"
          accept="image/*"
          onChange={handleProofUpload}
          disabled={uploading}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-rose-50 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
        />
        {uploading && <div className="mt-1 text-xs text-slate-500">Uploading…</div>}
        {paymentProof && (
          <div className="mt-2">
            <img src={toPublicUrl(paymentProof)} alt="Proof" className="h-32 w-32 rounded-xl object-cover border border-slate-200" />
          </div>
        )}
      </div>

      {/* Submit button only after upload */}
      {paymentProof ? (
        <div className="mt-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Payment proof uploaded. Click Submit to place your order.
          </div>
          <button
            className="mt-3 w-full rounded-xl border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting…" : "Submit order"}
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Please upload a payment proof screenshot to submit your order.
        </div>
      )}

      {status && (
        <div className={`mt-3 rounded-xl border px-3 py-2 text-sm ${status.includes("success") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}
