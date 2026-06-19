import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API_URL from '../config'

// step: 'cart' | 'checkout' | 'success'
export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const [step, setStep] = useState('cart')
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerAddress: '' })
  const [placing, setPlacing] = useState(false)
  const navigate = useNavigate()

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleOrder = async () => {
    if (!form.customerName || !form.customerPhone || !form.customerAddress) {
      return alert('Please fill in all fields')
    }
    setPlacing(true)
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({ foodId: i.id, quantity: i.quantity })),
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      // Persist order ID so order history page can track it
      const ids = JSON.parse(localStorage.getItem('orderIds') || '[]')
      ids.unshift(data.id)
      localStorage.setItem('orderIds', JSON.stringify(ids.slice(0, 20)))
      clearCart()
      setStep('success')
    } catch {
      alert('Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  // ── Success ──────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-5">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-400 mb-2">Thank you, <span className="text-gray-600 font-medium">{form.customerName}</span>!</p>
        <p className="text-gray-400 mb-10">We're preparing your food. Estimated delivery: <span className="text-orange-500 font-semibold">30–45 mins</span></p>
        <button
          onClick={() => navigate('/menu')}
          className="bg-orange-500 text-white px-10 py-3 rounded-xl hover:bg-orange-600 font-semibold transition"
        >
          Order More Food
        </button>
      </div>
    )
  }

  // ── Empty cart ────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some delicious food to get started</p>
        <Link to="/menu" className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 font-semibold transition inline-block">
          Browse Menu
        </Link>
      </div>
    )
  }

  // ── Cart ──────────────────────────────────────────────────
  if (step === 'cart') {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          <Link to="/menu" className="text-sm text-orange-500 hover:underline">← Continue Shopping</Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-sm text-gray-400">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-orange-500 font-bold w-16 text-right shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-400 text-xl transition ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-500">
              {items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span>{i.name} × {i.quantity}</span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span className="text-gray-700">Total</span>
              <span className="text-orange-500">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setStep('checkout')}
              className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 font-semibold transition text-lg"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ── Checkout ──────────────────────────────────────────────
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep('cart')} className="text-orange-500 hover:underline text-sm">← Back to Cart</button>
        <span className="text-gray-300">|</span>
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Delivery Details</h2>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Full Name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter your name"
              value={form.customerName}
              onChange={set('customerName')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Phone Number *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="e.g. 03001234567"
              value={form.customerPhone}
              onChange={set('customerPhone')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Delivery Address *</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
              rows={3}
              placeholder="Street, area, city..."
              value={form.customerAddress}
              onChange={set('customerAddress')}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
          <div className="space-y-2 text-sm text-gray-500">
            {items.map(i => (
              <div key={i.id} className="flex justify-between">
                <span className="truncate mr-2">{i.name} × {i.quantity}</span>
                <span className="shrink-0">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span className="text-gray-700">Total</span>
            <span className="text-orange-500">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleOrder}
            disabled={placing}
            className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 font-semibold transition text-lg"
          >
            {placing ? 'Placing Order...' : 'Place Order 🎉'}
          </button>
          <p className="text-xs text-gray-400 text-center">Cash on delivery • Est. 30–45 mins</p>
        </div>
      </div>
    </main>
  )
}
