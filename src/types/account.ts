export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  dateOfBirth?: Date;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}