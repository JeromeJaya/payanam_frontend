

export const getVendorStatusClasses = (status) => {
  if (status === "APPROVED") return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
  if (status === "REJECTED") return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400";
};

export const formatVendorStat = (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (key === 'buses' || key === 'flights') {
      return (
        <div className="text-right">
          <div className="text-sm text-slate-500">{value.total !== undefined ? `Total: ${value.total}` : '-'}</div>
          {value.active !== undefined && (
            <div className="text-sm text-green-600">Active: {value.active}</div>
          )}
          {value.inactive !== undefined && (
            <div className="text-sm text-slate-500">Inactive: {value.inactive}</div>
          )}
        </div>
      );
    }
    if (key === 'bookings') {
      return (
        <div className="text-right">
          <div className="text-sm text-slate-500">Total: {value.total !== undefined ? value.total : 0}</div>
          {value.confirmed !== undefined && (
            <div className="text-sm text-green-600">Confirmed: {value.confirmed}</div>
          )}
        </div>
      );
    }
    return JSON.stringify(value);
  }
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
};
