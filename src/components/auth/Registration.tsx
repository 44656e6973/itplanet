import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { RegistrationFormProps, Role } from './types';

interface BaseFormData {
  email: string;
  password: string;
  phone: string;
}

interface ApplicantFormData extends BaseFormData {
  role: 'applicant';
  fullName: string;
  position: string;
}

interface EmployerFormData extends BaseFormData {
  role: 'employer';
  companyName: string;
  inn: string;
}

type FormData = ApplicantFormData | EmployerFormData;

export const Registration = ({ onSubmit, isLoading = false, error }: RegistrationFormProps) => {
  const [activeRole, setActiveRole] = useState<Role>('applicant');
  const [formData, setFormData] = useState<FormData>({
    role: 'applicant',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    position: '',
  });

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    if (role === 'employer') {
      setFormData({
        role: 'employer',
        email: '',
        password: '',
        companyName: '',
        inn: '',
        phone: '',
      });
    } else {
      setFormData({
        role: 'applicant',
        email: '',
        password: '',
        fullName: '',
        phone: '',
        position: '',
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
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

      {/* Role toggle buttons */}
      <div className="flex flex-row gap-0">
        <button
          type="button"
          onClick={() => handleRoleChange('applicant')}
          className={`w-[200px] h-[51px] rounded-[15px] text-[22px] font-normal transition-colors ${
            activeRole === 'applicant'
              ? 'bg-[#2d2a63] text-[#7881aa]'
              : 'bg-[#eafffb] text-[#2d2a63]'
          }`}
        >
          Соискатель
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('employer')}
          className={`w-[200px] h-[51px] rounded-[15px] text-[22px] font-normal transition-colors ${
            activeRole === 'employer'
              ? 'bg-[#2d2a63] text-[#7881aa]'
              : 'bg-[#eafffb] text-[#2d2a63]'
          }`}
        >
          Работодатель
        </button>
      </div>

      {/* Email field */}
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

      {/* Password field */}
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
            minLength={6}
          />
        </div>
      </div>

      {/* Applicant fields */}
      {activeRole === 'applicant' && (
        <>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="fullName"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              ФИО
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="fullName"
                name="fullName"
                value={(formData as ApplicantFormData).fullName}
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
              htmlFor="phone"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Телефон
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
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
              htmlFor="position"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Должность
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="position"
                name="position"
                value={(formData as ApplicantFormData).position}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-transparent border-none shadow-none text-[#8989c9] text-xl font-normal placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto w-full"
                placeholder="Ввод"
              />
            </div>
          </div>
        </>
      )}

      {/* Employer fields */}
      {activeRole === 'employer' && (
        <>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="companyName"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Название компании
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="companyName"
                name="companyName"
                value={(formData as EmployerFormData).companyName}
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
              htmlFor="inn"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              ИНН
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="inn"
                name="inn"
                value={(formData as EmployerFormData).inn}
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
              htmlFor="phone"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Телефон
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-transparent border-none shadow-none text-[#8989c9] text-xl font-normal placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto w-full"
                placeholder="Ввод"
                required
              />
            </div>
          </div>
        </>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-[415px] h-[41px] bg-[#eafffb] rounded-[15px] text-[#2d2a63] text-[22px] font-normal hover:bg-[#d0f5ee] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
};
