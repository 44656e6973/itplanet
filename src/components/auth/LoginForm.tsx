import { useState } from 'react';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit?: (data: LoginData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm = ({ onSubmit, isLoading = false, error = null }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="email" className="block text-white text-sm font-normal mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="example@mail.ru"
          className="w-full px-4 py-3 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm outline-none border-2 border-transparent focus:border-[#4a4e69] placeholder:text-[#8a8aa8]"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-white text-sm font-normal mb-2">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm outline-none border-2 border-transparent focus:border-[#4a4e69] placeholder:text-[#8a8aa8]"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 mt-8 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-60"
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};
