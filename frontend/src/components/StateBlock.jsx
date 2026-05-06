export function StateBlock({ loading, error, empty, children }) {
  if (loading) return <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-500">Yükleniyor...</div>;
  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  if (empty) return <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-500">Kayıt bulunamadı.</div>;
  return children;
}
