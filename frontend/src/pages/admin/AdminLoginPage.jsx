import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-black">Admin Girişi</h1>
        {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div> : null}
        <div className="mt-5 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button className="mt-6 w-full">Giriş Yap</Button>
      </form>
    </main>
  );
}
