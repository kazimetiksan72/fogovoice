import { Link, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-black text-slate-950">FogoVoice</Link>
          <div className="flex items-center gap-2">
            <Link className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100" to="/join">Tura Katıl</Link>
            <Link className="rounded-md bg-cyan-700 px-3 py-2 text-sm font-bold text-white hover:bg-cyan-800" to="/guide/login">Rehber Girişi</Link>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
