export function Badge({ status }) {
  const active = status === 'active';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{active ? 'Aktif' : 'Bitti'}</span>;
}
