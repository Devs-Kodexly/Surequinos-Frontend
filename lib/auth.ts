// Utilidades de autenticación
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAdminAuthenticated') === 'true'
}

export const getAdminEmail = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminEmail')
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('isAdminAuthenticated')
  localStorage.removeItem('adminEmail')
}
