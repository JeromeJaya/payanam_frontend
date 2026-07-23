import { useRef } from "react";

export default function ProfileSidebar({ imagePreview, profileImage, form, savedProfile, onImageUpload }) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-6 lg:col-span-1">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-lg relative overflow-hidden">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-lime-600 to-lime-500 text-xl font-bold text-lime-950 shadow-md overflow-hidden">
          {imagePreview || profileImage ? (
            <img src={imagePreview || profileImage} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            (form.name || "AD").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{savedProfile.name || form.name || "Adventurer"}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{savedProfile.email || form.email}</p>
        <p className="text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400 mt-1">Role : {form.role || "Explorer"}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lime-100 dark:bg-lime-900/30 px-3 py-1 text-xs font-semibold text-lime-800 dark:text-lime-400">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse"></span> Verified Member
        </div>
      </div>
    </div>
  );
}
