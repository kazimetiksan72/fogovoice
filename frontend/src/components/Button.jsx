export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-cyan-700 text-white hover:bg-cyan-800',
    secondary: 'bg-slate-200 text-slate-950 hover:bg-slate-300',
    danger: 'bg-red-700 text-white hover:bg-red-800',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
  };
  return (
    <button
      className={`min-h-12 rounded-md px-5 py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
