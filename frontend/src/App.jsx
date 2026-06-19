import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollReset />
      <PageLoader />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/menu"            element={<Menu />} />
          <Route path="/cart"            element={<Cart />} />
          <Route path="/orders"          element={<OrderHistory />} />
          <Route path="/admin"           element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
