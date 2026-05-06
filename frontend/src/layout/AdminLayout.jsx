import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Headphones, History, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/guides', label: 'Rehberler', icon: Users },
  { to: '/admin/tours/active', label: 'Aktif Turlar', icon: Headphones },
  { to: '/admin/tours/history', label: 'Geçmiş Turlar', icon: History }
];

export function AdminLayout() {
  const { adminLogout, adminUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20">
          <div><div className="font-black">FogoVoice</div><div className="text-xs text-slate-500">Admin Panel</div></div>
          <button className="rounded-md p-2 hover:bg-slate-100 lg:hidden" onClick={() => { adminLogout(); navigate('/admin/login'); }}><LogOut size={18} /></button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return <NavLink key={item.to} end={item.to === '/admin'} to={item.to} className={({ isActive }) => `flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold ${isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-600 hover:bg-slate-100'}`}><Icon size={18} />{item.label}</NavLink>;
          })}
        </nav>
      </aside>
      <main className="flex-1">
        <header className="hidden h-16 items-center justify-end border-b border-slate-200 bg-white px-6 lg:flex">
          <span className="mr-4 text-sm text-slate-600">{adminUser?.name || adminUser?.email}</span>
          <button className="rounded-md p-2 hover:bg-slate-100" onClick={() => { adminLogout(); navigate('/admin/login'); }}><LogOut size={18} /></button>
        </header>
        <div className="p-4 sm:p-6"><Outlet /></div>
      </main>
    </div>
  );
}
