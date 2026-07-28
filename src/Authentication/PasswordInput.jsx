import { useState } from "react";
import {Eye,EyeOff} from "lucide-react";

export default function PasswordInput({ id, name, value, onChange, placeholder, autoComplete, required, className, onKeyDown }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={className}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
      >
        {visible ? <Eye /> : <EyeOff />}
        
      </button>
    </div>
  );
}
