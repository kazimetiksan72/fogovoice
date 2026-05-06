export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span> : null}
      <input
        className={`h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100 ${className}`}
        {...props}
      />
    </label>
  );
}
