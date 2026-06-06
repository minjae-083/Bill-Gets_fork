import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainPage from './pages/MainPage.jsx'
import ReceiptUploadPage from './pages/ReceiptUploadPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import MyFilesPage from './pages/MyFilesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <nav className="navbar">
          <Link to="/">메인</Link>
          <Link to="/upload">영수증 등록</Link>
          <Link to="/transactions">지출 내역</Link>
          <Link to="/analytics">분석 &amp; 통계</Link>
          <Link to="/files">나만의 파일</Link>
          <Link to="/login">로그인</Link>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/upload" element={<ReceiptUploadPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/files" element={<MyFilesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
