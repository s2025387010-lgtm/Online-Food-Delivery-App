import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FoodCard from '../components/FoodCard'
import API_URL from '../config'

const CATEGORIES = [
  { name: 'Pizza',   emoji: '🍕', bg: 'bg-red-50',    text: 'text-red-600',    hover: 'hover:bg-red-100' },
  { name: 'Burger',  emoji: '🍔', bg: 'bg-yellow-50', text: 'text-yellow-600', hover: 'hover:bg-yellow-100' },
  { name: 'Pasta',   emoji: '🍝', bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
  { name: 'Salad',   emoji: '🥗', bg: 'bg-green-50',  text: 'text-green-600',  hover: 'hover:bg-green-100' },
  { name: 'Dessert', emoji: '🍰', bg: 'bg-pink-50',   text: 'text-pink-600',   hover: 'hover:bg-pink-100' },
  { name: 'Drinks',  emoji: '🥤', bg: 'bg-blue-50',   text: 'text-blue-600',   hover: 'hover:bg-blue-100' },
]

const STATS = [
  { value: '50+',  label: 'Menu Items',      emoji: '🍽️' },
  { value: '30',   label: 'Min Delivery',    emoji: '⚡' },
  { value: '1K+',  label: 'Happy Customers', emoji: '😊' },
  { value: '4.9★', label: 'Average Rating',  emoji: '⭐' },
]

const HOW_IT_WORKS = [
  { step: '01', emoji: '🛒', title: 'Browse the Menu',   desc: 'Explore our wide range of freshly prepared meals by category.' },
  { step: '02', emoji: '➕', title: 'Add to Cart',        desc: 'Select your favourites and adjust quantities right on the card.' },
  { step: '03', emoji: '📝', title: 'Place Your Order',   desc: 'Enter your delivery details and confirm with a single tap.' },
  { step: '04', emoji: '🚚', title: 'Fast Delivery',      desc: 'Sit back and relax — hot food arrives at your door in minutes.' },
]

const TESTIMONIALS = [
  {
    name: 'Sarah J.', initials: 'SJ', color: 'bg-orange-400',
    rating: 5,
    text: 'Absolutely love FoodDash! Food always arrives hot and on time. Best delivery app I\'ve used.',
  },
  {
    name: 'Mike R.', initials: 'MR', color: 'bg-blue-400',
    rating: 5,
    text: 'Ordering is super easy and the variety is amazing. My whole family is hooked on this!',
  },
  {
    name: 'Aisha K.', initials: 'AK', color: 'bg-green-400',
    rating: 5,
    text: 'Quick delivery and incredible food quality. The pizza is absolutely perfect. Highly recommended!',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [popular, setPopular] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/foods`)
      .then(r => r.json())
      .then(data => setPopular(data.slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="bg-linear-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 flex items-center gap-12">
          <div className="flex-1">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-5 inline-block">
              🚀 Free delivery on your first order
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Delicious Food,<br />Delivered Fast
            </h1>
            <p className="text-orange-100 text-lg mb-8 max-w-md">
              Order from our kitchen and get fresh, hot meals delivered straight to your door in 30 minutes.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/menu')}
                className="bg-white text-orange-500 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition shadow-lg"
              >
                Order Now →
              </button>
              <button
                onClick={() => navigate('/menu')}
                className="border-2 border-white/50 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition"
              >
                View Menu
              </button>
            </div>
          </div>
          <div className="text-[150px] hidden md:block select-none drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
            🍔
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-3xl font-bold text-orange-500">{s.value}</div>
              <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What are you craving?</h2>
          <p className="text-gray-400">Tap a category to browse the full selection</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/menu?category=${cat.name}`)}
              className={`${cat.bg} ${cat.hover} rounded-2xl p-5 flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-md`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className={`text-sm font-semibold ${cat.text}`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
            <p className="text-gray-400">Getting food delivered is as easy as 1-2-3-4</p>
          </div>
          <div className="grid sm:grid-cols-4 gap-8 relative">
            {/* connector line on desktop */}
            <div className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-orange-200 z-0" />
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                  {item.emoji}
                </div>
                <span className="text-xs font-bold text-orange-400 tracking-widest">{item.step}</span>
                <h3 className="font-bold text-gray-800 mt-1 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Picks ──────────────────────────────── */}
      {popular.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Popular Picks</h2>
              <p className="text-gray-400">Our most loved dishes right now</p>
            </div>
            <Link to="/menu" className="text-orange-500 text-sm font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {popular.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {/* ── Why Choose Us ──────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Why FoodDash?</h2>
            <p className="text-gray-400">We're committed to giving you the best experience</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { emoji: '⚡', title: 'Lightning Fast',    desc: 'Hot meals delivered to your door in 30 minutes or less, guaranteed.', color: 'bg-yellow-100 text-yellow-600' },
              { emoji: '🍽️', title: 'Always Fresh',      desc: 'Every dish is cooked fresh to order — no pre-made, no reheating.', color: 'bg-green-100 text-green-600' },
              { emoji: '💳', title: 'Zero Hassle',       desc: 'Simple checkout, no account needed. Order in under two minutes.', color: 'bg-blue-100 text-blue-600' },
              { emoji: '🔒', title: 'Safe & Hygienic',   desc: 'All food handled under strict hygiene standards and sealed packaging.', color: 'bg-purple-100 text-purple-600' },
              { emoji: '🎯', title: 'Always Accurate',   desc: 'We double-check every order before dispatch so nothing is missed.', color: 'bg-red-100 text-red-600' },
              { emoji: '🤝', title: '24/7 Support',      desc: 'Got an issue? Our team is always here to make it right for you.', color: 'bg-orange-100 text-orange-600' },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                  {f.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What Customers Say</h2>
          <p className="text-gray-400">Don't take our word for it — hear from our happy customers</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{t.name}</p>
                  <p className="text-orange-400 text-sm">{'★'.repeat(t.rating)}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-linear-to-r from-orange-500 to-orange-400 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Hungry? Let's go! 🍕</h2>
          <p className="text-orange-100 mb-8 text-lg">Browse our full menu and get your favourites delivered in minutes.</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-white text-orange-500 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition shadow-lg"
          >
            Order Now →
          </button>
        </div>
      </section>
    </div>
  )
}
