import { Link, Outlet } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-warm-white" dir="rtl">
      <header className="border-b border-soft-beige/60 bg-charcoal text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-luxury-gold" />
            <span className="editorial-heading">Congrats Admin</span>
          </div>
          <Link to="/" className="text-sm text-luxury-gold-light hover:underline">
            العودة للموقع
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}
