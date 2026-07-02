// src/utils/format.js

export function formatMoney(value, simbolo = 'S/') {
  const num = parseFloat(value) || 0
  return `${simbolo} ${num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function toNumber(value) {
  return parseFloat(value) || 0
}

export function simboloMoneda(moneda) {
  const mapa = { 'Soles': 'S/', 'Dólares': 'US$', 'Euros': '€' }
  return mapa[moneda] || 'S/'
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Extrae el mensaje de error de un error de axios o genérico.
 */
export function extractError(err, fallback = 'Error inesperado') {
  return err?.response?.data?.detail
    || err?.response?.data?.message
    || err?.message
    || fallback
}

/**
 * Primer nombre del cliente (maneja "Apellido, Nombre" o "Nombre Apellido").
 */
export function primerNombre(nombre) {
  if (!nombre) return 'Cliente'
  const parts = nombre.split(',')
  const np = (parts[1] || parts[0]).trim().split(/\s+/)[0]
  return np || 'Cliente'
}
