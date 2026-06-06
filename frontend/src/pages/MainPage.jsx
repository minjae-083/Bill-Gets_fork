import { useState, useEffect } from 'react'

// ── 더미 데이터 ──────────────────────────────────────────
const DUMMY = [
  { id: '1', store: '스타벅스', amount: -5500, date: '2026-06-01', category: '식비' },
  { id: '2', store: '지하철', amount: -1400, date: '2026-06-02', category: '교통' },
  { id: '3', store: '월급', amount: 3200000, date: '2026-06-03', category: '수입' },
  { id: '4', store: '올리브영', amount: -32000, date: '2026-06-04', category: '쇼핑' },
  { id: '5', store: '맥도날드', amount: -8900, date: '2026-06-05', category: '식비' },
  { id: '6', store: '넷플릭스', amount: -17000, date: '2026-06-06', category: '구독' },
  { id: '7', store: 'CU편의점', amount: -4200, date: '2026-06-07', category: '식비' },
  { id: '8', store: '버스', amount: -1400, date: '2026-06-08', category: '교통' },
  { id: '9', store: '이마트', amount: -55000, date: '2026-06-09', category: '식비' },
  { id: '10', store: '헬스장', amount: -60000, date: '2026-06-10', category: '건강' },
  { id: '11', store: '카카오페이', amount: -12000, date: '2026-06-11', category: '기타' },
  { id: '12', store: '배달의민족', amount: -22000, date: '2026-06-12', category: '식비' },
  { id: '13', store: '지하철', amount: -1400, date: '2026-06-13', category: '교통' },
  { id: '14', store: '무신사', amount: -79000, date: '2026-06-14', category: '쇼핑' },
  { id: '15', store: '부수입', amount: 450000, date: '2026-06-15', category: '수입' },
]

const CATEGORY_COLORS = {
  식비: '#f97316',
  교통: '#3b82f6',
  쇼핑: '#ec4899',
  구독: '#8b5cf6',
  건강: '#10b981',
  기타: '#94a3b8',
  수입: '#22c55e',
}

const CATEGORY_ICONS = {
  식비: '🍽️', 교통: '🚌', 쇼핑: '🛍️', 구독: '📺', 건강: '💪', 기타: '📌', 수입: '💰',
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

function fmt(n) { return Math.abs(n).toLocaleString() + '원' }

export default function MainPage() {
  const [transactions, setTransactions] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1))
  const [selectedDate, setSelectedDate] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    setTransactions(DUMMY)
  }, [])

  // ── 캘린더 계산 ──
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const txByDate = {}
  transactions.forEach(t => {
    if (!txByDate[t.date]) txByDate[t.date] = []
    txByDate[t.date].push(t)
  })

  function dateKey(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  const selectedTx = selectedDate ? (txByDate[selectedDate] || []) : []

  // ── 지출 요약 ──
  const thisMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const thisMonthTx = transactions.filter(t => t.date.startsWith(thisMonthStr))
  const expense = Math.abs(thisMonthTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0))
  const income = thisMonthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)

  // ── 파이차트 ──
  const byCat = {}
  thisMonthTx.filter(t => t.amount < 0).forEach(t => {
    byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount)
  })
  const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const catTotal = catEntries.reduce((s, [, v]) => s + v, 0)

  // ── 빠른 업로드 핸들러 ──
  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setUploadSuccess(false)
  }

  async function handleQuickUpload() {
    if (!file) return
    setOcrLoading(true)
    // 실제 백엔드 없으면 딜레이 후 성공 처리
    await new Promise(r => setTimeout(r, 1500))
    setOcrLoading(false)
    setUploadSuccess(true)
    setFile(null)
    setPreview(null)
  }

  const recentTx = [...transactions]
    .filter(t => t.amount < 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div style={S.page}>
      {/* ── 상단 인삿말 ── */}
      <div style={S.header}>
        <div>
          <h1 style={S.greeting}>안녕하세요 👋</h1>
          <p style={S.subGreeting}>이번 달 지출 현황을 확인해보세요.</p>
        </div>
        <div style={S.monthBadge}>
          <span style={{ fontSize: 13, color: '#6d28d9', fontWeight: 700 }}>
            {year}년 {month + 1}월
          </span>
        </div>
      </div>

      {/* ── 메인 2단 레이아웃 ── */}
      <div style={S.mainGrid}>
        {/* 왼쪽: 지출 캘린더 */}
        <div style={S.leftCol}>
          <div style={S.card}>
            <div style={S.calHeader}>
              <button style={S.navBtn} onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
              <h2 style={S.calTitle}>{year}년 {month + 1}월</h2>
              <button style={S.navBtn} onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
            </div>

            {/* 요일 헤더 */}
            <div style={S.calGrid}>
              {WEEK_DAYS.map(d => (
                <div key={d} style={{ ...S.calDayLabel, color: d === '일' ? '#ef4444' : d === '토' ? '#3b82f6' : '#6b7280' }}>
                  {d}
                </div>
              ))}

              {/* 빈 셀 */}
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}

              {/* 날짜 셀 */}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const d = i + 1
                const dk = dateKey(year, month, d)
                const dayTx = txByDate[dk] || []
                const dayExpense = dayTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)
                const isToday = dk === '2026-06-07'
                const isSelected = dk === selectedDate
                const isWeekend = (firstDay + i) % 7 === 0 || (firstDay + i) % 7 === 6

                return (
                  <div
                    key={d}
                    style={{
                      ...S.calCell,
                      background: isSelected ? '#6d28d9' : isToday ? '#ede9fe' : 'transparent',
                      cursor: dayTx.length ? 'pointer' : 'default',
                    }}
                    onClick={() => setSelectedDate(isSelected ? null : dk)}
                  >
                    <span style={{
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 400,
                      color: isSelected ? '#fff' : isToday ? '#6d28d9' : isWeekend && (firstDay + i) % 7 === 0 ? '#ef4444' : '#374151',
                    }}>
                      {d}
                    </span>
                    {dayExpense < 0 && (
                      <span style={{
                        fontSize: 9,
                        color: isSelected ? '#e9d5ff' : '#ef4444',
                        lineHeight: 1.2,
                        fontWeight: 500,
                      }}>
                        -{Math.abs(Math.round(dayExpense / 1000))}k
                      </span>
                    )}
                    {dayTx.some(t => t.amount > 0) && (
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? '#a7f3d0' : '#22c55e', margin: '0 auto' }} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* 선택 날짜 내역 */}
            {selectedDate && (
              <div style={S.dayDetail}>
                <p style={S.dayDetailTitle}>{selectedDate} 내역</p>
                {selectedTx.length === 0
                  ? <p style={{ fontSize: 13, color: '#9ca3af' }}>내역 없음</p>
                  : selectedTx.map(t => (
                    <div key={t.id} style={S.dayDetailRow}>
                      <span style={{ fontSize: 13 }}>{t.store}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.amount < 0 ? '#ef4444' : '#16a34a' }}>
                        {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div style={S.rightCol}>
          {/* 빠른 영수증 업로드 */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>빠른 영수증 업로드</h3>
            <div
              style={{
                ...S.uploadBox,
                borderColor: preview ? '#6d28d9' : '#d1d5db',
                background: preview ? '#faf5ff' : '#fafafa',
              }}
              onClick={() => document.getElementById('main-receipt').click()}
            >
              {preview ? (
                <img src={preview} alt="미리보기" style={{ maxHeight: 100, maxWidth: '100%', borderRadius: 6, objectFit: 'contain' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                  <p style={{ fontSize: 13, margin: 0 }}>이미지를 클릭하여 업로드</p>
                  <p style={{ fontSize: 11, margin: '2px 0 0', color: '#d1d5db' }}>JPG · PNG · PDF</p>
                </div>
              )}
            </div>
            <input id="main-receipt" type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            {uploadSuccess && <p style={{ color: '#16a34a', fontSize: 12, marginTop: 6 }}>✅ 업로드 완료!</p>}
            <button
              style={{ ...S.uploadBtn, opacity: (!file || ocrLoading) ? 0.6 : 1 }}
              onClick={handleQuickUpload}
              disabled={!file || ocrLoading}
            >
              {ocrLoading ? '분석 중...' : 'OCR 분석 & 저장'}
            </button>
          </div>

          {/* 지출 현황 파이차트 */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>이번 달 지출 현황</h3>
            <div style={S.monthSummary}>
              <div style={S.summaryItem}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>수입</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#16a34a' }}>+{income.toLocaleString()}원</span>
              </div>
              <div style={{ width: 1, background: '#e5e7eb' }} />
              <div style={S.summaryItem}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>지출</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#ef4444' }}>-{expense.toLocaleString()}원</span>
              </div>
            </div>

            {/* 파이차트 */}
            <PieChart entries={catEntries} total={catTotal} />

            {/* 범례 */}
            <div style={S.legendGrid}>
              {catEntries.slice(0, 6).map(([cat, val]) => (
                <div key={cat} style={S.legendItem}>
                  <span style={{ ...S.legendDot, background: CATEGORY_COLORS[cat] || '#94a3b8' }} />
                  <span style={{ fontSize: 12, color: '#374151' }}>{cat}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>
                    {Math.round((val / catTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 최근 지출 내역 ── */}
      <div style={{ ...S.card, marginTop: 0 }}>
        <h3 style={S.cardTitle}>최근 지출 내역</h3>
        <div style={S.recentList}>
          {recentTx.map(tx => (
            <div key={tx.id} style={S.recentItem}>
              <div style={{ ...S.recentIcon, background: (CATEGORY_COLORS[tx.category] || '#94a3b8') + '18' }}>
                <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[tx.category] || '📌'}</span>
              </div>
              <div style={S.recentInfo}>
                <span style={S.recentStore}>{tx.store}</span>
                <span style={S.recentMeta}>{tx.date} · {tx.category}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ef4444' }}>
                -{Math.abs(tx.amount).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 파이차트 SVG ──────────────────────────────────────────
function PieChart({ entries, total }) {
  const R = 52
  const cx = 70
  const cy = 70
  let cumAngle = -Math.PI / 2

  if (!total) return null

  return (
    <svg viewBox="0 0 140 140" width="140" style={{ display: 'block', margin: '0 auto 12px' }}>
      {entries.map(([cat, val]) => {
        const angle = (val / total) * Math.PI * 2
        const x1 = cx + R * Math.cos(cumAngle)
        const y1 = cy + R * Math.sin(cumAngle)
        cumAngle += angle
        const x2 = cx + R * Math.cos(cumAngle)
        const y2 = cy + R * Math.sin(cumAngle)
        const large = angle > Math.PI ? 1 : 0
        return (
          <path
            key={cat}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
            fill={CATEGORY_COLORS[cat] || '#94a3b8'}
            stroke="#fff"
            strokeWidth="2"
            opacity="0.9"
          />
        )
      })}
      <circle cx={cx} cy={cy} r={R * 0.48} fill="white" />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="9" fill="#9ca3af">총 지출</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">
        {Math.round(total / 10000)}만원
      </text>
    </svg>
  )
}

// ── 스타일 ───────────────────────────────────────────────
const S = {
  page: { maxWidth: 960, margin: '0 auto', padding: '28px 16px', fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: 800, margin: '0 0 4px', color: '#111827' },
  subGreeting: { fontSize: 14, color: '#9ca3af', margin: 0 },
  monthBadge: { background: '#ede9fe', borderRadius: 10, padding: '8px 16px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16 },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#111827' },

  // 캘린더
  calHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  calTitle: { fontSize: 16, fontWeight: 700, margin: 0 },
  navBtn: { background: '#f3f4f6', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 },
  calDayLabel: { fontSize: 12, fontWeight: 600, textAlign: 'center', paddingBottom: 8 },
  calCell: {
    minHeight: 48, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'flex-start', padding: '6px 2px 4px', cursor: 'pointer', transition: 'background 0.15s',
    gap: 1,
  },
  dayDetail: { marginTop: 14, paddingTop: 14, borderTop: '1px solid #f3f4f6' },
  dayDetailTitle: { fontSize: 13, fontWeight: 700, color: '#6d28d9', marginBottom: 8 },
  dayDetailRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f9fafb' },

  // 업로드
  uploadBox: { border: '2px dashed #d1d5db', borderRadius: 10, padding: 16, textAlign: 'center', cursor: 'pointer', marginBottom: 10, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s, background 0.2s' },
  uploadBtn: { width: '100%', padding: '10px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  // 월 요약
  monthSummary: { display: 'flex', gap: 0, marginBottom: 12, border: '1px solid #f3f4f6', borderRadius: 10, overflow: 'hidden' },
  summaryItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 2 },

  // 범례
  legendGrid: { display: 'flex', flexDirection: 'column', gap: 6 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },

  // 최근 내역
  recentList: { display: 'flex', flexDirection: 'column', gap: 0 },
  recentItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f9fafb' },
  recentIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recentInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  recentStore: { fontSize: 14, fontWeight: 600, color: '#111827' },
  recentMeta: { fontSize: 12, color: '#9ca3af' },
}
