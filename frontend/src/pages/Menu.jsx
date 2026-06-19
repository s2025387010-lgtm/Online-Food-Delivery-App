import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import API_URL from '../config'

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Drinks']

export default function Menu() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') || 'All'

  useEffect(() => {
    fetch(`${API_URL}/api/foods`)
      .then(r => r.json())
      .then(data => { setFoods(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const setCategory = (cat) => {
    setSearch('')
    if (cat === 'All') setSearchParams({})
    else setSearchParams({ category: cat })
  }

  const filtered = foods
    .filter(f => category === 'All' || f.category === category)
    .filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Our Menu</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            placeholder="Search food..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">✕</button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === c
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Active filter chip */}
      {(category !== 'All' || search) && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {category !== 'All' && (
            <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
              {category}
              <button onClick={() => setCategory('All')} className="hover:text-orange-900 font-bold">×</button>
            </span>
          )}
          {search && (
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
              "{search}"
              <button onClick={() => setSearch('')} className="hover:text-gray-800 font-bold">×</button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
              <div className="w-full h-44 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">😕</div>
          <p className="text-gray-500 font-medium">No items found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different category or search term</p>
          <button onClick={() => { setCategory('All'); setSearch('') }} className="mt-4 text-orange-500 hover:underline text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(food => <FoodCard key={food.id} food={food} />)}
        </div>
      )}
    </main>
  )
}
