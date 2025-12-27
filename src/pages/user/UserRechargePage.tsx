import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type PaymentSettings = {
  commercialBankName: string;
  commercialAccountNumber: string;
  telebirrPhone: string;
  cbeBirrPhone: string;
};

export function UserRechargePage() {
  const { data: settings } = useQuery({
    queryKey: ["payment-settings"],
    queryFn: async () => {
      const res = await http.get("/payment-settings");
      return res.data.settings as PaymentSettings;
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Recharge Wallet</div>
        <div className="mt-1 text-sm text-slate-600">Add funds to your wallet using any of the payment methods below.</div>
      </div>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Payment Methods</div>
        <div className="p-4 space-y-4">
          {settings ? (
            <>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-sm">CB</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Commercial Bank</div>
                    <div className="text-sm text-slate-600">Bank transfer</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bank Name:</span>
                    <span className="font-medium text-slate-900">{settings.commercialBankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Account Number:</span>
                    <span className="font-medium text-slate-900">{settings.commercialAccountNumber}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <span className="text-orange-700 font-semibold text-sm">TB</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Telebirr</div>
                    <div className="text-sm text-slate-600">Mobile payment</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phone Number:</span>
                    <span className="font-medium text-slate-900">{settings.telebirrPhone}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">CB</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">CBE Birr</div>
                    <div className="text-sm text-slate-600">Mobile payment</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phone Number:</span>
                    <span className="font-medium text-slate-900">{settings.cbeBirrPhone}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-600">Loading payment information...</div>
          )}
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Instructions</div>
        <div className="p-4 text-sm text-slate-700 space-y-2">
          <div>1. Choose any of the payment methods above</div>
          <div>2. Send your desired amount to the provided account/number</div>
          <div>3. Include your User ID in the payment description/remark</div>
          <div>4. Wait for admin to approve and credit your account</div>
          <div className="text-xs text-slate-500 mt-3">Note: Processing may take 1-24 hours during business days.</div>
        </div>
      </Card>
    </div>
  );
}
