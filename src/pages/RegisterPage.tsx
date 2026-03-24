import { useNavigate } from 'react-router-dom';
import { Registration } from '@/components/auth';
import { useAuthStore } from '@/stores/authStore';
import type { RegistrationData } from '@/components/auth/types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (data: RegistrationData) => {
    clearError();
    await register(data);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a2e]">
      <div className="w-1/2 px-16 py-20 flex flex-col justify-start">
        <h1 className="text-white text-[32px] font-normal mb-8 mt-8">Регистрация</h1>

        <Registration onSubmit={handleSubmit} isLoading={isLoading} error={error} />

        <p className="mt-6 text-white text-xs">
          Уже есть аккаунт?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-white underline hover:text-[#eaffff]"
          >
            Войти
          </button>
        </p>
      </div>

      <div className="w-1/2 bg-[#eaffff]" />
    </div>
  );
};
