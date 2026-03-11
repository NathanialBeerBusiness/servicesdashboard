import { NavLink, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { CrudPage } from './pages/CrudPage';
import { useMemo, useState } from 'react';

const sections = ['Dashboard', 'Accounts', 'Jobs', 'Service Reports', 'Invoices', 'Notifications', 'Settings'];

export function App() {
  const [dark, setDark] = useState(false);
  const themeClass = dark ? 'theme-dark' : 'theme-light';
  const nav = useMemo(
    () => [
      { label: 'Dashboard', path: '/' },
      { label: 'Accounts', path: '/accounts' },
      { label: 'Jobs', path: '/jobs' },
      { label: 'Service Reports', path: '/service-reports' },
      { label: 'Invoices', path: '/invoices' },
      { label: 'Notifications', path: '/notifications' },
      { label: 'Settings', path: '/settings' }
    ],
    []
  );

  return (
    <div className={`app ${themeClass}`}>
      <aside className="sidebar">
        <h1>ServiceFlow</h1>
        {nav.map(item => (
          <NavLink key={item.path} to={item.path} className="nav-link">
            {item.label}
          </NavLink>
        ))}
      </aside>
      <div className="main">
        <header className="topbar">
          <input placeholder="Global search..." />
          <div className="topbar-right">
            <button onClick={() => setDark(v => !v)}>Dark mode</button>
            <button>🔔</button>
            <div className="avatar">AD</div>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {sections.slice(1).map(name => (
            <Route key={name} path={`/${name.toLowerCase().replace(' ', '-').replace(' ', '-')}`} element={<CrudPage title={name} />} />
          ))}
        </Routes>
      </div>
    </div>
  );
}
