import { validateEmail } from './_helpers'

interface ValidationErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export interface Validation {
  errors?: ValidationErrors
  isValid?: boolean
}

export function validate(body: any): Validation {
  const errors = {
    email: !body.email
      ? 'Email is required'
      : validateEmail(body.email)
      ? undefined
      : 'Email must be a valid email',
    password: !body.password
      ? 'Password is required'
      : body.password.length < 8
      ? 'Password must be at least 8 characters long'
      : undefined,
    confirmPassword: !body.confirmPassword
      ? 'Confirm password is required'
      : body.password !== body.confirmPassword
      ? 'Passwords do not match'
      : undefined
  }

  if (Object.values(errors).filter(Boolean).length === 0) {
    return { isValid: true }
  }
  return { errors }
}