
import { useState, useEffect } from 'react'
import { api } from '../api/client'

// 더미 데이터 - 백엔드 연결 전까지 화면 확인용
const DUMMY = [
  { id: '1', store: '스타벅스', amount: -5500, date: '2026-06-01', category: '식비' },
  { id: '2', store: '지하철', amount: -1400, date: '2026-06-02', category: '교통' },
  { id: '3', store: '월급', amount: 2000000, date: '2026-06-03', category: '수입' },
  { id: '4', store: '올리브영', amount: -32000, date: '2026-06-04', category: '쇼핑' },
  { id: '5', store: '맥도날드', amount: -8900, date: '2026-06-05', category: '식비' },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 검색/필터 상태
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  // 수정 상태
  const [editId, setEditId] = useState(null)
  const [editStore, setEditStore] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (q) params.append('q', q)
      if (category) params.append('category', category)
      const data = await api.get(`/transactions?${params.toString()}`)
      setTransactions(data)
    } catch {
      // 백엔드 미구현 상태면 더미 데이터 사용
      setTransactions(DUMMY)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('삭제하시겠습니까?')) return
    try {
      await api.del(`/transactions/${id}`)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch {
      setTransactions(prev => prev.filter(t => t.id !== id)) // 더미용
    }
  }

  function startEdit(tx) {
    setEditId(tx.id)
    setEditStore(tx.store)
    setEditAmount(tx.amount)
    setEditDate(tx.date)
    setEditCategory(tx.category)
  }

  async function handleSaveEdit(id) {
    try {
      await api.put(`/transactions/${id}`, {
        store: editStore, amount: editAmount, date: editDate, category: editCategory
      })
    } catch {
      // 백엔드 미구현 무시
    }
    setTransactions(prev => prev.map(t =>
      t.id === id ? { ...t, store: editStore, amount: Number(editAmount), date: editDate, category: editCategory } : t
    ))
    setEditId(null)
  }

  // 검색 필터 (프론트 필터링 - 백엔드 연결 전)
  const filtered = transactions.filter(t => {
    const matchQ = q ? t.store.includes(q) : true
    const matchCat = category ? t.category === category : true
    return matchQ && matchCat
  })

  // 요약 계산
  const totalExpense = filtered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)
  const totalIncome = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)

  return (
    <section style={styles.container}>
      <h1 style={styles.title}>지출 내역</h1>

      {/* 검색/필터 */}
      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="가게명 검색"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">전체 카테고리</option>
          <option value="식비">식비</option>
          <option value="교통">교통</option>
          <option value="쇼핑">쇼핑</option>
          <option value="수입">수입</option>
          <option value="기타">기타</option>
        </select>
        <button style={styles.searchBtn} onClick={fetchTransactions}>검색</button>
      </div>

      {/* 요약 카드 */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>총 건수</p>
          <p style={styles.summaryValue}>{filtered.length}건</p>
        </div>
        <div style={{ ...styles.summaryCard, borderColor: '#fca5a5' }}>
          <p style={styles.summaryLabel}>총 지출</p>
          <p style={{ ...styles.summaryValue, color: '#ef4444' }}>
            {totalExpense.toLocaleString()}원
          </p>
        </div>
        <div style={{ ...styles.summaryCard, borderColor: '#86efac' }}>
          <p style={styles.summaryLabel}>총 수입</p>
          <p style={{ ...styles.summaryValue, color: '#16a34a' }}>
            +{totalIncome.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 내역 목록 */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center' }}>불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center' }}>내역이 없습니다.</p>
      ) : (
        <div style={styles.list}>
          {filtered.map(tx => (
            <div key={tx.id} style={styles.item}>
              {editId === tx.id ? (
                // 수정 모드
                <div style={styles.editRow}>
                  <input style={styles.editInput} value={editStore} onChange={e => setEditStore(e.target.value)} placeholder="가게명" />
                  <input style={styles.editInput} type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="금액" />
                  <input style={styles.editInput} type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                  <input style={styles.editInput} value={editCategory} onChange={e => setEditCategory(e.target.value)} placeholder="카테고리" />
                  <button style={styles.saveBtn} onClick={() => handleSaveEdit(tx.id)}>저장</button>
                  <button style={styles.cancelBtn} onClick={() => setEditId(null)}>취소</button>
                </div>
              ) : (
                // 일반 모드
                <>
                  <div style={styles.itemLeft}>
                    <span style={styles.itemStore}>{tx.store}</span>
                    <span style={styles.itemMeta}>{tx.date} · {tx.category}</span>
                  </div>
                  <div style={styles.itemRight}>
                    <span style={{ ...styles.itemAmount, color: tx.amount < 0 ? '#ef4444' : '#16a34a' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}원
                    </span>
                    <div style={styles.btnGroup}>
                      <button style={styles.editBtn} onClick={() => startEdit(tx)}>수정</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(tx.id)}>삭제</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '32px 16px' },
  title: { fontSize: '24px', fontWeight: '700', marginBottom: '24px' },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
  select: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
  searchBtn: { padding: '10px 16px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  summaryRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  summaryCard: { flex: 1, border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', textAlign: 'center' },
  summaryLabel: { fontSize: '12px', color: '#9ca3af', margin: '0 0 6px' },
  summaryValue: { fontSize: '18px', fontWeight: '700', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  item: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  itemLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  itemStore: { fontSize: '15px', fontWeight: '600' },
  itemMeta: { fontSize: '12px', color: '#9ca3af' },
  itemRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  itemAmount: { fontSize: '16px', fontWeight: '700' },
  btnGroup: { display: 'flex', gap: '6px' },
  editBtn: { padding: '4px 10px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '4px 10px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#ef4444' },
  editRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' },
  editInput: { padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', flex: 1, minWidth: '80px' },
  saveBtn: { padding: '6px 12px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  cancelBtn: { padding: '6px 12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
}
