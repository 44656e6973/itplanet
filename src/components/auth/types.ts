// Типы для форм авторизации и регистрации

export type Role = 'applicant' | 'employer';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}

export interface BaseRegistrationData {
  email: string;
  password: string;
}

export interface EmployerRegistrationData extends BaseRegistrationData {
  role: 'employer';
  companyName: string;
  inn: string;
  phone: string;
}

export interface ApplicantRegistrationData extends BaseRegistrationData {
  role: 'applicant';
  firstName: string;
  lastName: string;
}

export type RegistrationData = EmployerRegistrationData | ApplicantRegistrationData;

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}
