import { Link } from 'react-router-dom';
import { Headphones, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/Button';

export function LandingPage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">Canlı sesli tur deneyimi</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Rehberler anlatımı web tarayıcısından canlı yayınlar; turistler uygulama indirmeden QR kod veya 7 haneli kod ile dinler.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/guide/login"><Button className="w-full sm:w-auto">Rehber Girişi</Button></Link>
            <Link to="/join"><Button variant="secondary" className="w-full sm:w-auto">Tura Katıl</Button></Link>
          </div>
        </div>
        <div className="grid gap-3">
          {[
            { icon: Headphones, title: 'Sadece canlı ses', text: 'Video yok, sade ve düşük dikkat dağıtan yayın.' },
            { icon: QrCode, title: 'QR veya kod', text: 'Mobil Safari, Android Chrome ve masaüstünde hızlı katılım.' },
            { icon: ShieldCheck, title: 'Yetkili roller', text: 'Rehber yayıncı, turist sadece dinleyici.' }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-md border border-slate-200 bg-white p-5">
                <Icon className="mb-4 text-cyan-700" size={28} />
                <h2 className="text-lg font-black">{item.title}</h2>
                <p className="mt-2 text-slate-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
