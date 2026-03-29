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
  firstName: string;
  lastName: string;
}

export interface RegistrationSubmitMeta {
  confirmPassword: string;
}

export interface EmployerRegistrationData extends BaseRegistrationData {
  role: 'employer';
  inn: string;
}

export interface ApplicantRegistrationData extends BaseRegistrationData {
  role: 'applicant';
}

export type RegistrationData = EmployerRegistrationData | ApplicantRegistrationData;
export type RegistrationSubmitData = RegistrationData & RegistrationSubmitMeta;

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationSubmitData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}
