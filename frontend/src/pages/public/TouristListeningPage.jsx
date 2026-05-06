import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { StateBlock } from '../../components/StateBlock';
import { api, unwrap } from '../../services/api';
import { useLiveAudioRoom } from '../../hooks/useLiveAudioRoom';

export function TouristListeningPage() {
  const { tourCode } = useParams();
  const navigate = useNavigate();
  const session = useMemo(() => JSON.parse(sessionStorage.getItem('touristSession') || 'null'), []);
  const [tour, setTour] = useState(session?.tour || null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const audio = useLiveAudioRoom();

  const load = useCallback(async () => {
    try {
      const current = unwrap(await api.get(`/tours/code/${tourCode}`)).tour;
      setTour((old) => ({ ...old, ...current }));
      const items = unwrap(await api.get(`/tours/${current._id || current.id}/announcements`)).announcements;
      setAnnouncements(items);
    } catch {
      setTour((old) => old ? { ...old, status: 'ended' } : old);
    }
  }, [tourCode]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (tour?.status === 'ended') audio.disconnect();
  }, [tour?.status]);

  async function startListening() {
    try {
      if (!session?.livekitToken) throw new Error('Session not found');
      await audio.connect(session.livekitToken);
      setStarted(true);
    } catch {
      setError('Canlı sese bağlanılamadı. Sayfayı yenileyip tekrar katılın.');
    }
  }

  async function leave() {
    if (tour?._id && session?.participantId) await api.post(`/tours/${tour._id}/leave`, { participantId: session.participantId }).catch(() => {});
    await audio.disconnect();
    sessionStorage.removeItem('touristSession');
    navigate('/');
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <StateBlock error={error} loading={!tour && !error}>
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h1 className="text-2xl font-black">{tour?.title}</h1>
          <p className="mt-2 text-slate-600">Rehber: {tour?.guideId?.name || tour?.guide?.name || '-'}</p>
          <div className="mt-5 rounded-md bg-cyan-50 p-4 text-cyan-800">
            Bağlantı: {audio.connected ? 'Dinleniyor' : started ? 'Bağlanıyor' : 'Hazır'} · Ses kanalı: {audio.remoteAudioTrackCount > 0 ? 'Alınıyor' : 'Bekleniyor'} · Tur: {tour?.status === 'ended' ? 'Sona erdi' : 'Aktif'}
          </div>
          <p className="mt-4 text-sm text-slate-500">Mobil tarayıcıda sesin kesilmemesi için ekranı açık tutun.</p>
          {tour?.status === 'ended' ? (
            <div className="mt-5 rounded-md bg-slate-100 p-4 font-bold text-slate-700">Tur sona erdi.</div>
          ) : (
            <Button className="mt-5 w-full text-lg" onClick={startListening} disabled={audio.connected}>Dinlemeyi Başlat</Button>
          )}
          <h2 className="mt-6 text-lg font-black">Duyurular</h2>
          <div className="mt-3 space-y-2">
            {announcements.length === 0 ? <p className="text-slate-500">Henüz duyuru yok.</p> : null}
            {announcements.map((item) => <div key={item._id} className="rounded-md border border-slate-200 p-3">{item.message}</div>)}
          </div>
          <Button variant="danger" className="mt-6 w-full" onClick={leave}>Turdan Çık</Button>
        </div>
      </StateBlock>
    </main>
  );
}
