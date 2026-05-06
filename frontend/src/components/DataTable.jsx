export function DataTable({ columns, rows, getRowKey }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-slate-50">
                {columns.map((c) => <td key={c.key} className="px-4 py-3 text-sm text-slate-700">{c.render ? c.render(row) : row[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
