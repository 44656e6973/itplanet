import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface DashboardLayoutProps {
  title: string;
  navigation: Array<{
    label: string;
    to: string;
  }>;
}

export const DashboardLayout = ({ title, navigation }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-white">
      {/* Header */}
      <header className="bg-[var(--app-surface)] border-b border-[#2e303a]/30">
        <div className="max-w-[1108px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#5f5ab4]">{title}</h1>
            {user && (
              <p className="text-sm text-[#6d69c2]">
                {user.profile?.first_name} {user.profile?.last_name} • {user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-[#6d69c2] hover:text-[#ecfffd]"
            >
              На главную
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-[#d9534f] hover:text-[#c9302c]"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1108px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.to ||
                  (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#5c5cc0] text-[#ecfffd]'
                        : 'text-[#6d69c2] hover:bg-[var(--app-mint)] hover:text-[#5f5ab4]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
