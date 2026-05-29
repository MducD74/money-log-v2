import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Tổng quan', icon: '⌂' },
  { to: '/expenses', label: 'Chi tiêu', icon: '+' },
  { to: '/budgets', label: 'Budget', icon: '◫' },
  { to: '/stats', label: 'Thống kê', icon: '▥' },
  { to: '/backup', label: 'Dữ liệu', icon: '⇅' },
];

export function AppLayout() {
  return (
    <div className="appShell">
      <header className="topBar">
        <div>
          <p className="eyebrow">Theo dõi chi tiêu offline</p>
          <h1>MoneyLog</h1>
        </div>
        <NavLink className="roundButton" to="/categories" aria-label="Hạng mục">
          ≡
        </NavLink>
      </header>

      <main className="mainContent">
        <Outlet />
      </main>

      <nav className="bottomNav" aria-label="Điều hướng chính">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className="navItem">
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
