import { AlertTriangle, CheckCircle2, X } from "lucide-react";

export default function NotificationBanner({ type, message, onDismiss }) {
  const isError = type === "error";
  const borderColor = isError ? "border-red-200" : "border-lime-200";
  const bgColor = isError ? "bg-red-50" : "bg-lime-50";
  const textColor = isError ? "text-red-700" : "text-lime-800";
  const Icon = isError ? AlertTriangle : CheckCircle2;
  const iconColor = isError ? "text-red-500" : "text-lime-600";
  const hoverBg = isError ? "hover:bg-red-100 dark:hover:bg-red-900/30" : "hover:bg-lime-100 dark:hover:bg-lime-900/30";
  const dismissColor = isError ? "text-red-700 dark:text-red-400" : "text-lime-800 dark:text-lime-400";

  return (
    <div className={`mb-6 rounded-xl border ${borderColor} ${bgColor} px-4 py-3 text-sm ${textColor} flex items-center justify-between shadow-sm`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor} shrink-0`} />
        <span>{message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className={`p-1 ${hoverBg} rounded-lg transition-colors ${dismissColor}`}
        aria-label={`Dismiss ${type}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
