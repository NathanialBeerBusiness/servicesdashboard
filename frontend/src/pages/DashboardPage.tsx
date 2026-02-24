export function DashboardPage() {
  const cards = [
    ['Total accounts', '5'],
    ['Total jobs', '10'],
    ['Active jobs', '4'],
    ['Overdue invoices', '2'],
    ['Revenue this month', '$18,400'],
    ['Jobs completed', '6']
  ];

  return (
    <main className="content">
      <h2>Admin Dashboard</h2>
      <div className="cards">
        {cards.map(([label, value]) => (
          <article key={label} className="card">
            <p>{label}</p>
            <h3>{value}</h3>
          </article>
        ))}
      </div>
      <section className="panel">
        <h3>Recent Activity</h3>
        <ul>
          <li>Account created: ToxinResin Commercial</li>
          <li>Job marked complete: JOB-1004</li>
          <li>Invoice sent: INV-8892</li>
        </ul>
      </section>
    </main>
  );
}
