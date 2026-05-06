import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

export function GuideRegisterPage() {
  const { guideRegister } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await guideRegister(form.name, form.email, form.password);
      navigate('/guide');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız.');
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-8">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-black">Rehber Kayıt</h1>
        {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div> : null}
        <div className="mt-5 space-y-4">
          <Input label="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Şifre" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <Button className="mt-6 w-full">Kayıt Ol</Button>
      </form>
    </main>
  );
}
