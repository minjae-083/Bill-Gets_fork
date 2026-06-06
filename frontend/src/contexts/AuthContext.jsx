import { createContext, useContext, useState } from 'react'

// 로그인 상태 / 토큰을 앱 전역에서 공유하기 위한 컨텍스트 골격.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // TODO: login / logout / 토큰 갱신 로직 구현
  const value = { user, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
