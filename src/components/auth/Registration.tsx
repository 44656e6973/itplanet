import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { RegistrationFormProps, RegistrationSubmitData, Role } from './types';

const PASSWORD_ERROR_TEXT =
  'Пароль должен быть не короче 12 символов, содержать только латиницу, заглавную букву, цифру и спецсимвол.';
const PASSWORD_MISMATCH_ERROR_TEXT = 'Пароли не совпадают.';

const isPasswordValid = (password: string) => (
  password.length >= 12
  && /[A-Z]/.test(password)
  && /\d/.test(password)
  && /[^A-Za-z\d]/.test(password)
  && /^[\x20-\x7E]+$/.test(password)
);

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
  firstName: string;
  lastName: string;
  inn: string;
}

type FormData = ApplicantFormData | EmployerFormData;

export const Registration = ({ onSubmit, isLoading = false, error }: RegistrationFormProps) => {
  const [activeRole, setActiveRole] = useState<Role>('applicant');
  const [employerStep, setEmployerStep] = useState<1 | 2>(1);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordReply, setPasswordReply] = useState('');
  const [passwordReplyError, setPasswordReplyError] = useState<string | null>(null);
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
    setPasswordError(null);
    setPasswordReply('');
    setPasswordReplyError(null);
    if (role === 'employer') {
      setFormData({
        role: 'employer',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        inn: '',
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
    if (name === 'password') {
      setPasswordError(null);
      setPasswordReplyError(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const handlePasswordReplyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordReply(e.target.value);
    setPasswordReplyError(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeRole === 'employer' && employerStep === 1) {
      setEmployerStep(2);
      return;
    }

    if (!isPasswordValid(formData.password)) {
      setPasswordError(PASSWORD_ERROR_TEXT);
      return;
    }

    if (formData.password !== passwordReply) {
      setPasswordReplyError(PASSWORD_MISMATCH_ERROR_TEXT);
      return;
    }

    onSubmit({
      ...formData,
      confirmPassword: passwordReply,
    } satisfies RegistrationSubmitData);
  };

  const isEmployerFirstStep = activeRole === 'employer' && employerStep === 1;
  const isEmployerSecondStep = activeRole === 'employer' && employerStep === 2;
  const showEmailField = activeRole === 'applicant' || isEmployerSecondStep;
  const showPasswordField = activeRole === 'applicant' || isEmployerFirstStep;
  const showProfileFields = activeRole === 'applicant' || isEmployerFirstStep;

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

      {/* Profile fields */}
      {showProfileFields && (
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
                value={formData.lastName}
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
                value={formData.firstName}
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

      {/* Password field */}
      {showPasswordField && (
        <>
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
                minLength={12}
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-300">{passwordError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="passwordReply"
              className="text-[#eafffb] text-[22px] font-normal tracking-[0] leading-[normal]"
            >
              Повторите пароль
            </Label>
            <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
              <Input
                id="passwordReply"
                name="passwordReply"
                type="password"
                value={passwordReply}
                onChange={handlePasswordReplyChange}
                disabled={isLoading}
                className="bg-transparent border-none shadow-none text-[#8989c9] text-xl font-normal placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto w-full"
                placeholder="Ввод"
                required
                minLength={12}
              />
            </div>
            {passwordReplyError && (
              <p className="text-sm text-red-300">{passwordReplyError}</p>
            )}
          </div>
        </>
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
