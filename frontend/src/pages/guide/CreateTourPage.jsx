import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PageHeader } from '../../components/PageHeader';
import { api, unwrap } from '../../services/api';

export function CreateTourPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const data = unwrap(await api.post('/tours', { title }));
      navigate(`/guide/tours/${data.tour._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Tur oluşturulamadı.');
    }
  }

  return (
    <>
      <PageHeader title="Yeni Tur Başlat" description="Tur başlığı girildiğinde sistem 7 haneli kod ve QR join link üretir." />
      <form onSubmit={submit} className="max-w-xl rounded-md border border-slate-200 bg-white p-5">
        {error ? <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div> : null}
        <Input label="Tur başlığı" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Button className="mt-6 w-full sm:w-auto">Oluştur</Button>
      </form>
    </>
  );
}
