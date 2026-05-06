import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api, unwrap } from '../../services/api';
import { requestWebPushPlayerId } from '../../services/oneSignal';

export function TouristJoinPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [touristName, setTouristName] = useState('');
  const [tourCode, setTourCode] = useState(params.tourCode || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.tourCode) setTourCode(params.tourCode);
  }, [params.tourCode]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      let oneSignalPlayerId = null;
      try {
        oneSignalPlayerId = await requestWebPushPlayerId();
      } catch {
        oneSignalPlayerId = null;
      }
      const data = unwrap(await api.post('/tours/join', { tourCode, touristName, oneSignalPlayerId }));
      sessionStorage.setItem('touristSession', JSON.stringify({ participantId: data.participantId, livekitToken: data.livekitToken, tour: data.tour }));
      navigate(`/listen/${data.tour.tourCode}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Tura katılamadınız. Kod ve ismi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-8">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black">Tura Katıl</h1>
        <p className="mt-2 text-slate-600">Adınızı ve 7 haneli tur kodunu girin. Bildirim izni istenirse isteğe bağlıdır.</p>
        {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div> : null}
        <div className="mt-5 space-y-4">
          <Input label="Adınız" value={touristName} onChange={(e) => setTouristName(e.target.value)} required autoComplete="name" />
          <Input label="7 haneli tur kodu" value={tourCode} onChange={(e) => setTourCode(e.target.value.replace(/\D/g, '').slice(0, 7))} inputMode="numeric" pattern="[0-9]{7}" required />
        </div>
        <div className="mt-6 grid gap-3">
          <Button disabled={loading}>{loading ? 'Katılınıyor...' : 'Katıl'}</Button>
          <Link to="/scan"><Button type="button" variant="secondary" className="w-full">QR Kod ile Katıl</Button></Link>
        </div>
      </form>
    </main>
  );
}
