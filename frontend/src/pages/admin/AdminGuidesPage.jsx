import { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { StateBlock } from '../../components/StateBlock';
import { api, unwrap } from '../../services/api';

export function AdminGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/guides').then(unwrap).then((d) => setGuides(d.guides)).catch((err) => setError(err.response?.data?.message || 'Rehberler yüklenemedi.')).finally(() => setLoading(false));
  }, []);
  return (
    <>
      <PageHeader title="Rehberler" description="Kayıtlı rehber hesapları" />
      <StateBlock loading={loading} error={error} empty={!guides.length}>
        <DataTable rows={guides} getRowKey={(r) => r._id} columns={[
          { key: 'name', label: 'Rehber Adı' },
          { key: 'email', label: 'Email' },
          { key: 'createdAt', label: 'Oluşturulma', render: (r) => new Date(r.createdAt).toLocaleString('tr-TR') },
          { key: 'tourCount', label: 'Toplam Tur' }
        ]} />
      </StateBlock>
    </>
  );
}
