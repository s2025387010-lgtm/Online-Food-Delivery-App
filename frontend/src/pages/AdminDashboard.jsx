import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

const STATUS_OPTIONS = ['pending', 'preparing', 'on the way', 'delivered', 'cancelled']
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  'on the way': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('foods')
  const [foods, setFoods] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' })
  const [image, setImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const key = localStorage.getItem('adminKey')
  const authHeaders = { 'x-admin-key': key }

  useEffect(() => {
    if (!key) { navigate('/admin'); return }
    fetchFoods()
    fetchOrders()
  }, [])

  const fetchFoods = async () => {
    const res = await fetch(`${API_URL}/api/admin/foods`, { headers: authHeaders })
    if (res.status === 401) { navigate('/admin'); return }
    setFoods(await res.json())
  }

  const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/api/admin/orders`, { headers: authHeaders })
    if (res.ok) setOrders(await res.json())
  }

  const handleAddFood = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) return alert('Name, price and category are required')
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (image) fd.append('image', image)
    const res = await fetch(`${API_URL}/api/admin/foods`, { method: 'POST', headers: authHeaders, body: fd })
    if (res.ok) {
      setForm({ name: '', description: '', price: '', category: '' })
      setImage(null)
      await fetchFoods()
    }
    setSaving(false)
  }

  const toggleAvailable = async (food) => {
    const fd = new FormData()
    fd.append('available', String(!food.available))
    await fetch(`${API_URL}/api/admin/foods/${food.id}`, { method: 'PUT', headers: authHeaders, body: fd })
    fetchFoods()
  }

  const deleteFood = async (id) => {
    if (!confirm('Delete this food item?')) return
    await fetch(`${API_URL}/api/admin/foods/${id}`, { method: 'DELETE', headers: authHeaders })
    fetchFoods()
  }

  const updateStatus = async (orderId, status) => {
    await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => { localStorage.removeItem('adminKey'); navigate('/admin') }}
          className="text-sm text-red-400 hover:text-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['foods', 'orders'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-medium capitalize transition ${
              tab === t ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
            }`}
          >
            {t}
            {t === 'orders' && orders.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-600 text-xs rounded-full px-1.5 py-0.5">{orders.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'foods' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Food Item</h2>
            <form onSubmit={handleAddFood} className="grid sm:grid-cols-2 gap-3">
              <input className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Name *" value={form.name} onChange={set('name')} />
              <input className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Category * (e.g. Pizza)" value={form.category} onChange={set('category')} />
              <input className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Price * (e.g. 9.99)" type="number" step="0.01" min="0" value={form.price} onChange={set('price')} />
              <input className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm" type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
              <input className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Description (optional)" value={form.description} onChange={set('description')} />
              <button type="submit" disabled={saving} className="sm:col-span-2 bg-orange-500 text-white py-2.5 rounded-xl hover:bg-orange-600 disabled:opacity-50 font-semibold transition">
                {saving ? 'Adding...' : 'Add Food Item'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {foods.map(food => (
                  <tr key={food.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{food.name}</td>
                    <td className="px-4 py-3 text-gray-400">{food.category}</td>
                    <td className="px-4 py-3 text-orange-500 font-medium">${food.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${food.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {food.available ? 'Available' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => toggleAvailable(food)} className="text-blue-500 hover:underline text-xs">
                          {food.available ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => deleteFood(food.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {foods.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No food items yet. Add one above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    <p className="text-xs text-gray-400 max-w-32 truncate">{order.customerAddress}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-40">
                    {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-orange-500">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`text-xs rounded-full px-2 py-1 font-medium cursor-pointer border-0 ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
