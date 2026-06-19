import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STATUS_STYLE = {
  pending:      { badge: 'bg-yellow-100 text-yellow-700', label: 'Pending',      icon: '🕐' },
  preparing:    { badge: 'bg-blue-100 text-blue-700',     label: 'Preparing',    icon: '👨‍🍳' },
  'on the way': { badge: 'bg-purple-100 text-purple-700', label: 'On the Way',   icon: '🚚' },
  delivered:    { badge: 'bg-green-100 text-green-700',   label: 'Delivered',    icon: '✅' },
  cancelled:    { badge: 'bg-red-100 text-red-700',       label: 'Cancelled',    icon: '❌' },
}

function OrderCard({ id }) {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-dashed border-gray-200 text-center text-gray-400 text-sm">
        Order not found (may have been removed)
      </div>
    )
  }

  const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending
  const date = new Date(order.createdAt)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">
            {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' · '}
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs font-mono text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${s.badge}`}>
          {s.icon} {s.label}
        </span>
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        <ul className="space-y-1 mb-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="text-sm text-gray-400">
            <span>📍 {order.customerAddress}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Total</span>
            <span className="font-bold text-orange-500 text-lg">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Status progress bar */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-1">
          {['pending', 'preparing', 'on the way', 'delivered'].map((st, i, arr) => {
            const stepIdx = arr.indexOf(order.status)
            const active = i <= stepIdx && order.status !== 'cancelled'
            return (
              <div key={st} className="flex-1 flex items-center gap-1">
                <div className={`h-1.5 w-full rounded-full ${active ? 'bg-orange-400' : 'bg-gray-200'}`} />
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 px-0.5">
          <span>Placed</span>
          <span>Preparing</span>
          <span>On Way</span>
          <span>Delivered</span>
        </div>
      </div>
    </div>
  )
}

export default function OrderHistory() {
  const [orderIds, setOrderIds] = useState([])

  useEffect(() => {
    try {
      setOrderIds(JSON.parse(localStorage.getItem('orderIds') || '[]'))
    } catch {
      setOrderIds([])
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem('orderIds')
    setOrderIds([])
  }

  if (orderIds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-5">📋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-400 mb-8">Your order history will appear here once you place your first order.</p>
        <Link to="/menu" className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 font-semibold transition inline-block">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">{orderIds.length} order{orderIds.length !== 1 ? 's' : ''} · live status</p>
        </div>
        <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-600 transition hover:underline">
          Clear history
        </button>
      </div>

      <div className="space-y-4">
        {orderIds.map(id => <OrderCard key={id} id={id} />)}
      </div>
    </main>
  )
}
