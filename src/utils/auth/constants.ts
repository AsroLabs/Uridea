export const AUTH_ERRORS = {
  USER_ALREADY_REGISTERED: 'User already registered',
  PASSWORD_TOO_SHORT: 'Password should be at least 6 characters',
  EMAIL_NOT_CONFIRMED: 'Email not confirmed',
} as const;

export const AUTH_ERROR_MESSAGES = {
  USER_ALREADY_REGISTERED: 'Este correo electrónico ya está registrado',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
  EMAIL_NOT_CONFIRMED: 'Por favor, confirma tu correo electrónico',
  GENERIC_ERROR: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
} as const;

export const ROUTES = {
  AUTH: '/auth',
  MENU: '/menu',
  AUTH_CALLBACK: '/auth/callback',
} as const;
