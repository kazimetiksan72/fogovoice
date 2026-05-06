import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function GuideLayout() {
  const { guideLogout, guideUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/guide" className="text-lg font-black">FogoVoice Rehber</Link>
          <div className="flex items-center gap-3">
            <NavLink className="text-sm font-bold text-slate-600 hover:text-cyan-700" to="/guide">Turlarım</NavLink>
            <span className="hidden text-sm text-slate-500 sm:inline">{guideUser?.name}</span>
            <button title="Çıkış" onClick={() => { guideLogout(); navigate('/'); }} className="rounded-md p-2 hover:bg-slate-100"><LogOut size={18} /></button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6"><Outlet /></main>
    </div>
  );
}
