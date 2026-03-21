import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

// ── Se der 404 de sessão, limpa o sessionStorage para forçar novo upload ──
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 404) {
      // Sessão expirou no Railway — limpa todas as sessões salvas
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('session_')) sessionStorage.removeItem(key)
      })
    }
    return Promise.reject(err)
  }
)

export const renderPage = (sessionId, page, zoom = 1.5) =>
  `${API_BASE}/render/${sessionId}/${page}?zoom=${zoom}`

export const extractText = (sessionId, page) =>
  api.post(`/extract/${sessionId}/${page}`).then(r => r.data.blocks)

export const eraseArea = (sessionId, page, rect) =>
  api.post('/erase', { session_id: sessionId, page, ...rect })

export const addSignature = (sessionId, page, rect, file) => {
  const form = new FormData()
  form.append('session_id', sessionId)
  form.append('page', page)
  form.append('x_pct', rect.x_pct)
  form.append('y_pct', rect.y_pct)
  form.append('w_pct', rect.w_pct)
  form.append('h_pct', rect.h_pct)
  form.append('file', file)
  return api.post('/signature', form)
}

export const saveTextEdits = (sessionId, edits) => {
  const form = new FormData()
  form.append('session_id', sessionId)
  form.append('edits', JSON.stringify(edits))
  return api.post('/save-text', form)
}

export const downloadUrl = (sessionId) =>
  `${API_BASE}/download/${sessionId}`

export const deleteSession = (sessionId) =>
  api.delete(`/session/${sessionId}`)

export default api
