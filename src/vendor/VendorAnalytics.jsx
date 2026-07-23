import { BarChart3 } from "lucide-react";

export default function VendorAnalytics() {
  return (
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Reports</h3>
      <p className="text-sm text-slate-600">View detailed analytics and generate reports</p>
    </div>
  );
}
