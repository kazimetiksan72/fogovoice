import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../../components/Button';

const readerId = 'qr-reader';

function extractTourCode(decodedText) {
  const value = String(decodedText || '').trim();
  try {
    const url = new URL(value);
    const joinMatch = url.pathname.match(/\/join\/(\d{7})/);
    if (joinMatch) return joinMatch[1];
  } catch {
    // QR can be a plain 7 digit code; ignore URL parse errors.
  }
  return value.match(/\d{7}/)?.[0] || null;
}

export function QRScannerPage() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const startedRef = useRef(false);
  const scannedRef = useRef(false);
  const [error, setError] = useState('');
  const [cameraUnavailable, setCameraUnavailable] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  useEffect(() => {
    if (!window.isSecureContext) {
      setCameraUnavailable(true);
      setError('QR kamera taraması için HTTPS gerekir. Lokal bilgisayarda localhost çalışır; ağdaki telefon/tablet için HTTPS veya manuel kod kullanın.');
      return undefined;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraUnavailable(true);
      setError('Bu tarayıcı kamera ile QR taramayı desteklemiyor. Manuel kod ile katılabilirsiniz.');
      return undefined;
    }

    const scanner = new Html5Qrcode(readerId);
    scannerRef.current = scanner;
    let cancelled = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (scannedRef.current) return;
          const code = extractTourCode(decodedText);
          if (code) {
            scannedRef.current = true;
            setScannedCode(code);
            scanner.pause(true);
            navigate(`/join/${code}`, { replace: true });
            window.setTimeout(() => {
              scanner.stop().catch(() => {});
            }, 0);
          }
        }
      )
      .then(() => {
        if (!cancelled) startedRef.current = true;
      })
      .catch(() => {
        if (!cancelled) {
          setCameraUnavailable(true);
          setError('Kamera izni alınamadı veya bu tarayıcıda QR tarama başlatılamadı. Manuel kod ile katılabilirsiniz.');
        }
      });

    return () => {
      cancelled = true;
      scannedRef.current = false;
      if (startedRef.current) scannerRef.current?.stop().catch(() => {});
      startedRef.current = false;
    };
  }, [navigate]);

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-black">QR Kod Tara</h1>
      <p className="mt-2 text-slate-600">Kamera izni gereklidir. İzin vermezseniz manuel kod girebilirsiniz.</p>
      {error ? <div className="mt-4 rounded-md bg-amber-50 p-3 text-amber-800">{error}</div> : null}
      {scannedCode ? <div className="mt-4 rounded-md bg-cyan-50 p-3 font-bold text-cyan-800">Kod okundu: {scannedCode}</div> : null}
      <div className={`mt-5 overflow-hidden rounded-md border border-slate-200 bg-white p-3 ${cameraUnavailable ? 'hidden' : ''}`}>
        <div id={readerId} />
      </div>
      <Button className="mt-5 w-full" variant="secondary" onClick={() => navigate('/join')}>Manuel Kod Gir</Button>
    </main>
  );
}
