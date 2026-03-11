import { useMemo, useState } from 'react';

type Row = { id: string; name: string; status: string; createdAt: string; deleted?: boolean };

export function CrudPage({ title }: { title: string }) {
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 8 }).map((_, i) => ({
      id: `${title.slice(0, 3).toUpperCase()}-${i + 1}`,
      name: `${title} Item ${i + 1}`,
      status: i % 2 ? 'active' : 'pending',
      createdAt: new Date(Date.now() - i * 86400000).toLocaleDateString()
    }))
  );
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => rows.filter(r => !r.deleted && r.name.toLowerCase().includes(query.toLowerCase())), [rows, query]);

  const softDelete = (id: string) => setRows(prev => prev.map(row => (row.id === id ? { ...row, deleted: true } : row)));

  return (
    <main className="content">
      <div className="row">
        <h2>{title}</h2>
        <button onClick={() => setModalOpen(true)}>Create {title.slice(0, -1)}</button>
      </div>
      <div className="panel">
        <div className="row">
          <input placeholder="Filter..." value={query} onChange={e => setQuery(e.target.value)} />
          <span>{filtered.length} results</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.status}</td>
                <td>{row.createdAt}</td>
                <td>
                  <button>Edit</button>
                  <button className="danger" onClick={() => softDelete(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create {title.slice(0, -1)}</h3>
            <input placeholder="Name" />
            <textarea placeholder="Notes" />
            <div className="row">
              <button onClick={() => setModalOpen(false)}>Cancel</button>
              <button
                onClick={() => {
                  setRows(prev => [
                    { id: `${title.slice(0, 3).toUpperCase()}-${prev.length + 1}`, name: `${title} Item ${prev.length + 1}`, status: 'active', createdAt: new Date().toLocaleDateString() },
                    ...prev
                  ]);
                  setModalOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
