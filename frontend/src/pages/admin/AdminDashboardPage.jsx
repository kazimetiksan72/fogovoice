import { useEffect, useState } from 'react';
import { Headphones, History, UserRound, Users } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { StateBlock } from '../../components/StateBlock';
import { api, unwrap } from '../../services/api';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/dashboard').then(unwrap).then((d) => setStats(d.stats)).catch((err) => setError(err.response?.data?.message || 'Dashboard yüklenemedi.'));
  }, []);
  const cards = [
    ['Toplam Rehber', stats?.guideCount, UserRound],
    ['Aktif Tur', stats?.activeTourCount, Headphones],
    ['Tamamlanan Tur', stats?.endedTourCount, History],
    ['Toplam Katılımcı', stats?.participantCount, Users]
  ];
  return (
    <>
      <PageHeader title="Dashboard" description="Canlı tur operasyon özeti" />
      <StateBlock loading={!stats && !error} error={error}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, Icon]) => <div key={label} className="rounded-md border border-slate-200 bg-white p-5"><Icon className="mb-4 text-cyan-700" size={24} /><div className="text-3xl font-black">{value ?? 0}</div><div className="mt-1 text-sm text-slate-500">{label}</div></div>)}
        </div>
      </StateBlock>
    </>
  );
}
