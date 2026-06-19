import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count } = useCart()
  const { pathname } = useLocation()

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition ${
        pathname === to ? 'text-white underline underline-offset-4' : 'text-orange-100 hover:text-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0">🍔 FoodDash</Link>

        <div className="flex items-center gap-5">
          {navLink('/', 'Home')}
          {navLink('/menu', 'Menu')}
          {navLink('/orders', 'My Orders')}

          {/* Cart icon */}
          <Link to="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/admin"
            className="text-sm bg-white text-orange-500 px-3 py-1 rounded-full font-semibold hover:bg-orange-50 transition shrink-0"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
