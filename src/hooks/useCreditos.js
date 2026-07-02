// src/hooks/useCreditos.js
import { useState, useEffect } from 'react'
import hbApi from '../services/hbApi.js'

export function useCreditos() {
  const [creditos, setCreditos] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let cancelled = false
    hbApi.get('/cuentas/credito')
      .then(r => { if (!cancelled) setCreditos(r.data) })
      .catch(e => { if (!cancelled) setError(e?.response?.data?.detail || 'Error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { creditos, loading, error }
}
