import { Link } from 'react-router-dom'

const LINKS = {
  'Quick Links': [
    { label: 'Home',  to: '/' },
    { label: 'Menu',  to: '/menu' },
    { label: 'Cart',  to: '/cart' },
    { label: 'Admin', to: '/admin' },
  ],
  'Categories': [
    { label: 'Pizza',   to: '/menu?category=Pizza' },
    { label: 'Burger',  to: '/menu?category=Burger' },
    { label: 'Pasta',   to: '/menu?category=Pasta' },
    { label: 'Dessert', to: '/menu?category=Dessert' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 pt-14 pb-8">
        <div className="grid sm:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2">
            <Link to="/" className="text-2xl font-bold mb-3 inline-block">🍔 FoodDash</Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5">
              Delicious food delivered fast. We bring your favourite meals straight to your door, hot and fresh every time.
            </p>
            <div className="flex gap-3">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '📸', label: 'Instagram' },
                { icon: '🐦', label: 'Twitter' },
              ].map(s => (
                <button
                  key={s.label}
                  title={s.label}
                  className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center text-base transition"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-gray-400 hover:text-white text-sm transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-gray-800 pt-6 mb-6 grid sm:grid-cols-3 gap-4">
          {[
            { emoji: '📧', text: 'hello@fooddash.com' },
            { emoji: '📞', text: '+1 (555) 000-1234' },
            { emoji: '📍', text: '123 Food Street, City' },
          ].map(c => (
            <div key={c.text} className="flex items-center gap-2 text-sm text-gray-400">
              <span>{c.emoji}</span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} FoodDash. All rights reserved.</span>
          <span>Made with ❤️ for food lovers by Alizay Idrees</span>
        </div>
      </div>
    </footer>
  )
}
