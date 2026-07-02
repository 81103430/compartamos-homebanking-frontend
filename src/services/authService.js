// src/services/authService.js
import hbApi, { TOKEN_KEY, USER_KEY } from './hbApi.js'

export async function login(username, password) {
  const { data } = await hbApi.post('/auth/login', { username, password })
  const token = data.access_token
  const cliente = data.cliente || {}
  const user = {
    codcliente: cliente.codcliente ?? username,
    nombre:     cliente.nombre ?? username,
    pkcliente:  cliente.pkcliente,
  }
  return { token, user }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredToken()  { return localStorage.getItem(TOKEN_KEY) }

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
