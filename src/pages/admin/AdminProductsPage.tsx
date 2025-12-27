import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Package } from "lucide-react";

import { http } from "../../api/http";
import { env } from "../../env";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { AdminProductCard } from "../../components/admin/AdminProductCard";

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

export function AdminProductsPage() {
  const qc = useQueryClient();

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await http.get("/admin/products");
      return res.data.products as Product[];
    }
  });

  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [active, setActive] = useState<Product | null>(null);

  const sorted = useMemo(() => {
    return (products.data ?? []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products.data]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <SectionHeader 
        title="Product Management"
        subtitle="Add, edit, delete products. Changes are instantly visible to users."
        action={
          <Button
            onClick={() => {
              setActive(null);
              setMode("create");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
        variant="admin"
      />

      {mode ? (
        <ProductEditor
          mode={mode}
          initial={active}
          onClose={() => {
            setMode(null);
            setActive(null);
          }}
          onSaved={async () => {
            await qc.invalidateQueries({ queryKey: ["admin-products"] });
            setMode(null);
            setActive(null);
          }}
        />
      ) : null}

      {/* Products Grid */}
      <div className="grid gap-6">
        {sorted.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onUpdate={async (id, data) => {
              try {
                await http.patch(`/products/${id}`, data);
                await qc.invalidateQueries({ queryKey: ["admin-products"] });
              } catch (e: any) {
                alert(e?.response?.data?.message ?? "Failed to update product");
              }
            }}
            onDelete={async (id) => {
              try {
                await http.delete(`/products/${id}`);
                await qc.invalidateQueries({ queryKey: ["admin-products"] });
              } catch (e: any) {
                alert(e?.response?.data?.message ?? "Failed to delete product");
              }
            }}
          />
        ))}

        {sorted.length === 0 && (
          <Card className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first product.</p>
            <Button
              onClick={() => {
                setActive(null);
                setMode("create");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </Card>
        )}
      </div>

      {products.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}

function ProductEditor(props: {
  mode: "create" | "edit";
  initial: Product | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(props.initial?.name ?? "");
  const [description, setDescription] = useState(props.initial?.description ?? "");
  const [priceEtb, setPriceEtb] = useState(props.initial ? String(props.initial.priceCents / 100) : "");
  const [imageUrl, setImageUrl] = useState(props.initial?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(props.initial?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading image:", file.name);
      const res = await http.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Upload response:", res.data);
      setImageUrl(res.data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{props.mode === "create" ? "Add product" : "Edit product"}</div>
          <div className="mt-1 text-sm text-slate-600">Name, description, price, image URL</div>
        </div>
        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={props.onClose}>
          Close
        </button>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input label="Product name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Price (ETB)" value={priceEtb} onChange={(e) => setPriceEtb(e.target.value)} />
        <div className="md:col-span-2">
          <div className="mb-1 text-sm font-medium text-slate-700">Product image</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-rose-50 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
          />
          {uploading && <div className="mt-1 text-xs text-slate-500">Uploading…</div>}
          {imageUrl && (
            <div className="mt-2">
              <img
                src={toPublicUrl(imageUrl)}
                alt="Preview"
                className="h-24 w-24 rounded-xl object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <a
                href={toPublicUrl(imageUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-xs text-blue-600 hover:underline"
              >
                Open image in new tab
              </a>
            </div>
          )}
        </div>
        <label className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">Active</div>
            <div className="text-xs text-slate-500">Inactive products won’t show on the user side</div>
          </div>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        </label>
        <label className="md:col-span-2">
          <div className="mb-1 text-sm font-medium text-slate-700">Description</div>
          <textarea
            className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={props.onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setError(null);
            setSaving(true);
            try {
              const priceCents = Math.round(Number(priceEtb) * 100);
              if (!name.trim() || !description.trim() || !Number.isFinite(priceCents) || priceCents <= 0) {
                setError("Please provide valid name, description, and price.");
                return;
              }

              if (props.mode === "create") {
                await http.post("/products", { name, description, priceCents, imageUrl });
              } else {
                await http.patch(`/products/${props.initial!.id}`, { name, description, priceCents, imageUrl, isActive });
              }

              await props.onSaved();
            } catch (e: any) {
              setError(e?.response?.data?.message ?? "Save failed");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
