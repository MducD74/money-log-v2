import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Tổng quan', icon: <i className="bi bi-house-door-fill"></i> },
  { to: '/expenses', label: 'Chi tiêu', icon: <i className="bi bi-database-fill-add"></i> },
  { to: '/budgets', label: 'Budget', icon: <i className="bi bi-cash-stack"></i> },
  { to: '/stats', label: 'Thống kê', icon: <i className="bi bi-graph-up"></i> },
  { to: '/backup', label: 'Dữ liệu', icon: <i className="bi bi-cloud-arrow-down"></i> },
];

export function AppLayout() {
  return (
    <>
      <header className="topBar">
          <div>
            <h1 style={{ padding: '0 14px' }}>MoneyLog</h1>
          </div>
          <NavLink className="roundButton" to="/categories" aria-label="Hạng mục">
            ≡
          </NavLink>
      </header>
      <div className="appShell">
        <main className="mainContent">
          <Outlet />
        </main>

        <nav className="bottomNav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="navItem">
              <span aria-hidden="true">{item.icon}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
