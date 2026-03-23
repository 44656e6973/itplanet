import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth';
import { useAuthStore } from '@/stores/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (data: { email: string; password: string }) => {
    clearError();
    await login(data.email, data.password);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a2e]">
      <div className="w-1/2 px-16 py-20 flex flex-col justify-start">
        <h1 className="text-white text-[32px] font-normal mb-8 mt-8">Вход</h1>

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

        <p className="mt-6 text-white text-xs">
          Нет аккаунта?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-white underline hover:text-[#eaffff]"
          >
            Зарегистрироваться
          </button>
        </p>
      </div>

      <div className="w-1/2 bg-[#eaffff]" />
    </div>
  );
};
