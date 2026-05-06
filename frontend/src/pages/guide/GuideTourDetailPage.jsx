import { useCallback, useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { PageHeader } from '../../components/PageHeader';
import { StateBlock } from '../../components/StateBlock';
import { Textarea } from '../../components/Textarea';
import { api, unwrap } from '../../services/api';
import { config } from '../../utils/config';
import { useLiveAudioRoom } from '../../hooks/useLiveAudioRoom';

export function GuideTourDetailPage() {
  const { id } = useParams();
  const audio = useLiveAudioRoom();
  const [tour, setTour] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [audioError, setAudioError] = useState('');
  const joinLink = useMemo(() => tour ? `${config.publicUrl}/join/${tour.tourCode}` : '', [tour]);

  const load = useCallback(async () => {
    try {
      const [tourData, announcementData] = await Promise.all([
        api.get(`/tours/${id}`).then(unwrap),
        api.get(`/tours/${id}/announcements`).then(unwrap)
      ]);
      setTour(tourData.tour);
      setAnnouncements(announcementData.announcements);
    } catch (err) {
      setError(err.response?.data?.message || 'Tur yüklenemedi.');
    }
  }, [id]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load]);

  async function startMic() {
    try {
      setAudioError('');
      const data = unwrap(await api.post('/livekit/guide-token', { tourId: id }));
      await audio.connect(data.livekitToken);
      await audio.publishMicrophone();
    } catch (err) {
      setAudioError(err.message || err.response?.data?.message || 'Mikrofon başlatılamadı.');
    }
  }

  async function sendAnnouncement() {
    if (!message.trim()) return;
    await api.post(`/tours/${id}/announcements`, { message: message.trim() });
    setMessage('');
    await load();
  }

  async function endTour() {
    if (!window.confirm('Turu bitirmek istediğinize emin misiniz?')) return;
    await api.post(`/tours/${id}/end`);
    await audio.disconnect();
    await load();
  }

  return (
    <>
      <PageHeader title="Tur Detayı" description="Canlı ses yayını, QR kod, katılımcılar ve duyurular" />
      <StateBlock loading={!tour && !error} error={error}>
        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <section className="rounded-md border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-black">{tour?.title}</h2><p className="mt-1 text-slate-500">Kod</p></div><Badge status={tour?.status} /></div>
            <div className="my-4 text-center text-5xl font-black text-cyan-700">{tour?.tourCode}</div>
            <div className="flex justify-center rounded-md bg-white p-3"><QRCodeSVG value={joinLink} size={220} /></div>
            <div className="mt-4 break-all rounded-md bg-slate-50 p-3 text-sm text-slate-700">{joinLink}</div>
            <Button className="mt-3 w-full" variant="secondary" onClick={() => navigator.clipboard.writeText(joinLink)}><Copy className="mr-2 inline" size={18} />Join Link Kopyala</Button>
          </section>
          <section className="space-y-5">
            <div className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black">Canlı Ses</h2>
              <div className="mt-3 rounded-md bg-cyan-50 p-4 text-cyan-800">Bağlantı: {audio.connected ? 'Canlı' : 'Kapalı'} · Mikrofon: {audio.micEnabled ? 'Açık' : 'Kapalı'}</div>
              {audioError ? <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">{audioError}</div> : null}
              {!audio.connected ? <Button className="mt-4 w-full sm:w-auto" onClick={startMic} disabled={tour?.status === 'ended'}>Mikrofonu Aç</Button> : <Button className="mt-4 w-full sm:w-auto" onClick={audio.toggleMicrophone}>{audio.micEnabled ? 'Mikrofonu Kapat' : 'Mikrofonu Aç'}</Button>}
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black">Katılımcılar ({tour?.participants?.filter((p) => p.isConnected).length || 0})</h2>
              <div className="mt-3 grid gap-2">{tour?.participants?.length ? tour.participants.map((p) => <div key={p.participantId} className="rounded-md border border-slate-200 p-3">{p.name} · {p.isConnected ? 'Bağlı' : 'Ayrıldı'}</div>) : <p className="text-slate-500">Henüz katılımcı yok.</p>}</div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black">Duyuru</h2>
              <Textarea className="mt-3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Kısa duyuru yazın" />
              <Button className="mt-3" onClick={sendAnnouncement} disabled={tour?.status === 'ended'}>Duyuruyu Gönder</Button>
              <div className="mt-4 space-y-2">{announcements.map((a) => <div key={a._id} className="rounded-md bg-slate-50 p-3">{a.message}</div>)}</div>
            </div>
            <div className="rounded-md border border-red-200 bg-white p-5">
              <Button variant="danger" onClick={endTour} disabled={tour?.status === 'ended'}>Turu Bitir</Button>
            </div>
          </section>
        </div>
      </StateBlock>
    </>
  );
}
