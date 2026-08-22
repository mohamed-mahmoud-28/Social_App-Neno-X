import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({ inputProps }) {
  const [isVisible, setIsVisible] = useState(false);
  const { className, ...restInputProps } = inputProps;

  return (
    <div className="relative">
      <input
        {...restInputProps}
        type={isVisible ? "text" : "password"}
        className={className}
      />

      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        title={isVisible ? "Hide password" : "Show password"}
        disabled={restInputProps.disabled}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
      >
        {isVisible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
