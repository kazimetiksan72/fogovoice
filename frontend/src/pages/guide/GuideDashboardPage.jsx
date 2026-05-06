import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { PageHeader } from '../../components/PageHeader';
import { StateBlock } from '../../components/StateBlock';
import { api, unwrap } from '../../services/api';

export function GuideDashboardPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setTours(unwrap(await api.get('/tours/my')).tours);
    } catch (err) {
      setError(err.response?.data?.message || 'Turlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  const active = tours.filter((t) => t.status === 'active');
  const history = tours.filter((t) => t.status === 'ended');

  return (
    <>
      <PageHeader title="Turlarım" description="Aktif ve geçmiş tur oturumlarınız" actions={<Link to="/guide/tours/new"><Button>Yeni Tur Başlat</Button></Link>} />
      <StateBlock loading={loading} error={error}>
        <TourList title="Aktif Turlar" tours={active} />
        <TourList title="Geçmiş Turlar" tours={history} />
      </StateBlock>
    </>
  );
}

function TourList({ title, tours }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-black">{title}</h2>
      <div className="grid gap-3">
        {tours.length === 0 ? <div className="rounded-md border border-slate-200 bg-white p-4 text-slate-500">Kayıt yok.</div> : null}
        {tours.map((tour) => (
          <Link key={tour._id} to={`/guide/tours/${tour._id}`} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 hover:border-cyan-300">
            <div><div className="font-black">{tour.title}</div><div className="mt-1 text-sm text-slate-500">{tour.tourCode} · {tour.participants.length} katılımcı</div></div>
            <Badge status={tour.status} />
          </Link>
        ))}
      </div>
    </section>
  );
}
