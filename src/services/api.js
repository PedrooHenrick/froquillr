import axios from 'axios'

// Usa o cliente Supabase já existente no projeto (evita múltiplas instâncias)
async function getToken() {
  try {
    // Lê direto do localStorage onde o Supabase salva a sessão
    const storageKey = Object.keys(localStorage).find(k => k.includes('auth-token'))
    if (storageKey) {
      const data = JSON.parse(localStorage.getItem(storageKey) || '{}')
      const token = data?.access_token || data?.session?.access_token
      if (token) return token
    }
  } catch {}
  return ''
}

// Cache do token
let _cachedToken = ''
let _tokenFetched = false

async function getCachedToken() {
  if (!_tokenFetched || !_cachedToken) {
    _cachedToken = await getToken()
    _tokenFetched = true
    // Atualiza cache a cada 50 minutos
    setTimeout(() => { _tokenFetched = false }, 50 * 60 * 1000)
  }
  return _cachedToken
}

// Inicializa token imediatamente
getCachedToken()

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(async (config) => {
  const token = await getCachedToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      _tokenFetched = false
      window.location.href = '/auth'
    }
    if (error.response?.status === 429) {
      alert('Muitas requisições. Aguarde e tente novamente.')
    }
    return Promise.reject(error)
  }
)

export function renderPage(sessionId, page, zoom = 1.5) {
  return `/api/render/${sessionId}/${page}?zoom=${zoom}&t=${Date.now()}&tk=${_cachedToken}`
}

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

export function downloadUrl(sessionId) {
  return `/api/download/${sessionId}?tk=${_cachedToken}`
}

export const deleteSession = (sessionId) =>
  api.delete(`/session/${sessionId}`)

export default api
