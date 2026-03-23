export type Role = 'applicant' | 'employer';

export interface FormState {
  role: Role;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  inn: string;
  phone: string;
  fullName: string;
  position: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  companyName?: string;
  inn?: string;
  phone?: string;
  fullName?: string;
  position?: string;
}

export interface UseRegistrationFormReturn {
  formData: FormState;
  errors: FormErrors;
  isLoading: boolean;
  error: string | null;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  setRole: (role: Role) => void;
  validate: () => boolean;
  submit: () => Promise<boolean>;
}

export interface LoginData {
  email: string;
  password: string;
}
