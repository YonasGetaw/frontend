import { Card } from "../../ui/Card";

export function UserOnlineServicePage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Online Service</div>
        <div className="mt-1 text-sm text-slate-600">Get support and assistance online.</div>
      </div>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Contact Support</div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-700 font-semibold text-xs">CS</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">Customer Support</div>
              <div className="text-sm text-slate-600 mt-1">
                Available 24/7 to help with your questions and concerns.
              </div>
              <button className="mt-2 text-sm text-blue-700 hover:text-blue-800 font-medium">
                Start Live Chat
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <span className="text-green-700 font-semibold text-xs">EM</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">Email Support</div>
              <div className="text-sm text-slate-600 mt-1">
                Send us an email and we'll respond within 24 hours.
              </div>
              <div className="mt-2 text-sm text-slate-700">
                support@vestoria.com
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
              <span className="text-purple-700 font-semibold text-xs">FAQ</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">Frequently Asked Questions</div>
              <div className="text-sm text-slate-600 mt-1">
                Find quick answers to common questions.
              </div>
              <button className="mt-2 text-sm text-purple-700 hover:text-purple-800 font-medium">
                View FAQ
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Service Hours</div>
        <div className="p-4 text-sm text-slate-700 space-y-2">
          <div>• Live Chat: 24/7</div>
          <div>• Email Support: Monday - Friday, 9AM - 6PM</div>
          <div>• Phone Support: Monday - Friday, 9AM - 6PM</div>
          <div>• Response Time: Within 24 hours for emails</div>
        </div>
      </Card>
    </div>
  );
}
