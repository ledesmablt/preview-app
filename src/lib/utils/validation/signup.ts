import { validateEmail } from './_helpers'

export type ValidationErrors = {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export type Validation = {
  errors?: ValidationErrors
  isValid?: boolean
}

export function validate(body: any): Validation {
  const errors = {
    username: !body.username
      ? 'Username is required'
      : body.username.length < 4
      ? 'Username must be at least 4 characters long'
      : undefined,
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
