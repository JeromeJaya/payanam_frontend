
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, type, onPageChange }) {
  if (pagination.totalPages <= 1) return null;
  return (
    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(pagination.currentPage - 1, type)} disabled={pagination.currentPage === 1} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => onPageChange(pagination.currentPage + 1, type)} disabled={pagination.currentPage === pagination.totalPages} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
