// src/hooks/useHBAuth.js
import { useContext } from 'react'
import { HBAuthContext } from '../context/HBAuthContext.jsx'
export function useHBAuth() { return useContext(HBAuthContext) }

// src/hooks/useCuentas.js — se exporta por separado abajo
