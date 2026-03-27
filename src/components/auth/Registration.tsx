import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { RegistrationFormProps, Role } from './types';

interface BaseFormData {
  email: string;
  password: string;
}

interface ApplicantFormData extends BaseFormData {
  role: 'applicant';
  firstName: string;
  lastName: string;
}

interface EmployerFormData extends BaseFormData {
  role: 'employer';
  companyName: string;
  inn: string;
  phone: string;
}

type FormData = ApplicantFormData | EmployerFormData;

export const Registration = ({ onSubmit, isLoading = false, error }: RegistrationFormProps) => {
  const [activeRole, setActiveRole] = useState<Role>('applicant');
  const [employerStep, setEmployerStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    role: 'applicant',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setEmployerStep(1);
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
        firstName: '',
        lastName: '',
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeRole === 'employer' && employerStep === 1) {
      setEmployerStep(2);
      return;
    }
    onSubmit(formData);
  };

  const isEmployerFirstStep = activeRole === 'employer' && employerStep === 1;
  const isEmployerSecondStep = activeRole === 'employer' && employerStep === 2;
  const showEmailField = activeRole === 'applicant' || isEmployerSecondStep;
  const showPasswordField = activeRole === 'applicant';

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
              ? 'bg-[#eafffb] text-[#2d2a63]'
              : 'bg-[#2d2a63] text-[#7881aa]'
          }`}
        >
          Соискатель
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('employer')}
          className={`w-[200px] h-[51px] rounded-[15px] text-[22px] font-normal transition-colors ${
            activeRole === 'employer'
              ? 'bg-[#eafffb] text-[#2d2a63]'
              : 'bg-[#2d2a63] text-[#7881aa]'
          }`}
        >
          Работодатель
        </button>
      </div>

      {/* Email field */}
      {showEmailField && (
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
      )}

      {/* Password field */}
      {showPasswordField && (
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
      )}

      {/* Applicant fields */}
      {activeRole === 'applicant' && (
        <>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="lastName"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Фамилия
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="lastName"
                name="lastName"
                value={(formData as ApplicantFormData).lastName}
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
              htmlFor="firstName"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Имя
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="firstName"
                name="firstName"
                value={(formData as ApplicantFormData).firstName}
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

      {/* Employer fields */}
      {isEmployerFirstStep && (
        <>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="phone"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Логин
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="phone"
                name="phone"
                type="text"
                value={(formData as EmployerFormData).phone}
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
              htmlFor="companyName"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Имя пользователя
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
        </>
      )}

      {isEmployerSecondStep && (
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
      )}

      {isEmployerFirstStep ? (
        <Button
          type="submit"
          disabled={isLoading}
          className="w-[415px] h-[41px] bg-[#eafffb] rounded-[15px] text-[#2d2a63] text-[22px] font-normal hover:bg-[#d0f5ee] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Далее
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isLoading}
          className="w-[415px] h-[41px] bg-[#eafffb] rounded-[15px] text-[#2d2a63] text-[22px] font-normal hover:bg-[#d0f5ee] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      )}
    </form>
  );
};
