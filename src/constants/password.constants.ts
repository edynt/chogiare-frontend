export const PASSWORD_PATTERNS = {
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  MIN_LENGTH: 6,
} as const

export const PASSWORD_REQUIREMENTS = [
  {
    label: 'Ít nhất 6 ký tự',
    test: (password: string) => password.length >= PASSWORD_PATTERNS.MIN_LENGTH,
    pattern: PASSWORD_PATTERNS.MIN_LENGTH,
  },
  {
    label: 'Ít nhất 1 chữ thường',
    test: (password: string) => PASSWORD_PATTERNS.LOWERCASE.test(password),
    pattern: PASSWORD_PATTERNS.LOWERCASE,
  },
  {
    label: 'Ít nhất 1 chữ hoa',
    test: (password: string) => PASSWORD_PATTERNS.UPPERCASE.test(password),
    pattern: PASSWORD_PATTERNS.UPPERCASE,
  },
  {
    label: 'Ít nhất 1 ký tự đặc biệt',
    test: (password: string) => PASSWORD_PATTERNS.SPECIAL_CHAR.test(password),
    pattern: PASSWORD_PATTERNS.SPECIAL_CHAR,
  },
] as const
