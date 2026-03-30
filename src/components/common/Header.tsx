import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const LogoMark = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-11 shrink-0"
    viewBox="0 0 44 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 4H18L12 28H0L4 4Z" fill="#5AA0E7" />
    <path d="M16 4H30L24 28H10L16 4Z" fill="#7BBBEF" />
    <path d="M26 4H40L34 28H20L26 4Z" fill="#4B5FB3" />
  </svg>
);

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    if (user?.role === 'employer') {
      navigate('/employer/company');
    } else if (user?.role === 'applicant') {
      navigate('/applicant/profile');
    } else if (user?.role === 'curator') {
      navigate('/curator/dashboard');
    }
  };

  return (
    <header className="bg-[var(--app-surface)] text-[#f3f2ff]">
      <nav className="mx-auto flex h-[54px] max-w-[1108px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-85">
          <LogoMark />
          <span className="font-[var(--app-display)] text-[15px] tracking-[0.06em] text-[#f0f2ff]">
            ТРАМПЛИН
          </span>
        </Link>

        <div className="flex items-center gap-6 text-[14px] text-[#ececff] sm:gap-8">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleProfile}
                className="transition-colors hover:text-white"
              >
                {user?.email}
              </button>
              <button
                onClick={handleLogout}
                className="transition-colors hover:text-white"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="transition-colors hover:text-white"
              >
                Регистрация
              </Link>
              <Link
                to="/login"
                className="transition-colors hover:text-white"
              >
                Вход
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
