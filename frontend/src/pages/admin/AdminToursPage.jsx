import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { DataTable } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { StateBlock } from '../../components/StateBlock';
import { api, unwrap } from '../../services/api';

export function AdminToursPage({ type }) {
  const active = type === 'active';
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get(active ? '/admin/tours/active' : '/admin/tours/history').then(unwrap).then((d) => setTours(d.tours)).catch((err) => setError(err.response?.data?.message || 'Turlar yüklenemedi.')).finally(() => setLoading(false));
  }, [active]);
  return (
    <>
      <PageHeader title={active ? 'Aktif Turlar' : 'Geçmiş Turlar'} description={active ? 'Şu anda açık olan turlar' : 'Tamamlanan tur oturumları'} />
      <StateBlock loading={loading} error={error} empty={!tours.length}>
        <DataTable rows={tours} getRowKey={(r) => r._id} columns={[
          { key: 'title', label: 'Tur Başlığı', render: (r) => <Link className="font-bold text-cyan-700 hover:underline" to={`/admin/tours/${r._id}`}>{r.title}</Link> },
          { key: 'guide', label: 'Rehber', render: (r) => r.guideId?.name || '-' },
          { key: 'tourCode', label: 'Tur Kodu' },
          { key: 'participants', label: 'Katılımcı', render: (r) => r.participants?.length || 0 },
          { key: 'createdAt', label: 'Başlangıç', render: (r) => new Date(r.createdAt).toLocaleString('tr-TR') },
          { key: 'status', label: 'Durum', render: (r) => <Badge status={r.status} /> }
        ]} />
      </StateBlock>
    </>
  );
}
