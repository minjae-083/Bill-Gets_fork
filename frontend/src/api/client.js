// 백엔드(FastAPI) 호출용 공통 클라이언트.
// fetch 래퍼 - JWT 토큰을 자동으로 헤더에 첨부한다.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    // TODO: 에러 처리 정교화
    throw new Error(`API 오류: ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}
