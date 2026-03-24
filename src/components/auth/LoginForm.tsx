import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { LoginFormProps, LoginData } from './types';

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
        >
          Email
        </Label>
        <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-transparent border-none shadow-none text-[#8989c9] text-xl font-normal placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto w-full"
            placeholder="Ввод"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
        >
          Пароль
        </Label>
        <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-transparent border-none shadow-none text-[#8989c9] text-xl font-normal placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto w-full"
            placeholder="Ввод"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-[415px] h-[41px] bg-[#eafffb] rounded-[15px] text-[#2d2a63] text-[22px] font-normal hover:bg-[#d0f5ee] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
};
