import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { DataTable } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { StateBlock } from '../../components/StateBlock';
import { api, unwrap } from '../../services/api';

export function AdminTourDetailPage() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get(`/admin/tours/${id}`).then(unwrap), api.get(`/tours/${id}/announcements`).then(unwrap)])
      .then(([t, a]) => { setTour(t.tour); setAnnouncements(a.announcements); })
      .catch((err) => setError(err.response?.data?.message || 'Tur detayı yüklenemedi.'));
  }, [id]);
  return (
    <>
      <PageHeader title="Tur Detayı" description="Tur bilgileri, katılımcılar ve duyurular" />
      <StateBlock loading={!tour && !error} error={error}>
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">{tour?.title}</h2><Badge status={tour?.status} /></div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Rehber" value={tour?.guideId?.name} />
              <Info label="Email" value={tour?.guideId?.email} />
              <Info label="Tur Kodu" value={tour?.tourCode} />
              <Info label="LiveKit Room" value={tour?.livekitRoomName} />
              <Info label="Başlangıç" value={tour?.createdAt ? new Date(tour.createdAt).toLocaleString('tr-TR') : '-'} />
              <Info label="Bitiş" value={tour?.endedAt ? new Date(tour.endedAt).toLocaleString('tr-TR') : '-'} />
            </dl>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5"><div className="text-3xl font-black">{tour?.participants?.length || 0}</div><div className="text-sm text-slate-500">Toplam katılımcı</div><div className="mt-4 text-3xl font-black">{tour?.participants?.filter((p) => p.isConnected).length || 0}</div><div className="text-sm text-slate-500">Bağlı katılımcı</div></div>
        </div>
        <h2 className="mb-3 text-lg font-black">Katılımcılar</h2>
        <DataTable rows={tour?.participants || []} getRowKey={(r) => r.participantId} columns={[
          { key: 'name', label: 'Ad' },
          { key: 'joinedAt', label: 'Katılım', render: (r) => new Date(r.joinedAt).toLocaleString('tr-TR') },
          { key: 'leftAt', label: 'Ayrılma', render: (r) => r.leftAt ? new Date(r.leftAt).toLocaleString('tr-TR') : '-' },
          { key: 'isConnected', label: 'Durum', render: (r) => r.isConnected ? 'Bağlı' : 'Ayrıldı' }
        ]} />
        <h2 className="mb-3 mt-6 text-lg font-black">Duyurular</h2>
        <div className="space-y-2">{announcements.length ? announcements.map((a) => <div key={a._id} className="rounded-md border border-slate-200 bg-white p-4">{a.message}<div className="mt-2 text-xs text-slate-500">{new Date(a.createdAt).toLocaleString('tr-TR')}</div></div>) : <div className="rounded-md border border-slate-200 bg-white p-4 text-slate-500">Duyuru yok.</div>}</div>
      </StateBlock>
    </>
  );
}

function Info({ label, value }) {
  return <div><dt className="text-slate-500">{label}</dt><dd className="mt-1 break-words font-bold text-slate-900">{value || '-'}</dd></div>;
}
