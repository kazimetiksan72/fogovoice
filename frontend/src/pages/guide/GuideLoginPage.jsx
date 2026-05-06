import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

export function GuideLoginPage() {
  const { guideLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await guideLogin(email, password);
      navigate('/guide');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-8">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-black">Rehber Girişi</h1>
        {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div> : null}
        <div className="mt-5 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button className="mt-6 w-full">Giriş Yap</Button>
        <Link className="mt-4 block text-center font-bold text-cyan-700" to="/guide/register">Kayıt olun</Link>
      </form>
    </main>
  );
}
