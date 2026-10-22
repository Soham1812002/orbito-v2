export type RecoveryMethod = "email" | "whatsapp";

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  method: RecoveryMethod;
  email?: string;
  phone?: string;
}

export interface LinkConfirmationState {
  method: RecoveryMethod;
  destination: string;
}
