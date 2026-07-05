import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Brain,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import { DashboardFeatureFlags } from '@/features/dashboard/DashboardFeatureFlags'
import { useAuth } from '@/providers/AuthProvider'
import { MagneticButton } from '@/components/ui/MagneticButton'

const NAV = [
  { to: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'الملف الشخصي', icon: User },
  { to: '/dashboard/wishes', label: 'التهاني', icon: Heart },
  { to: '/dashboard/analytics', label: 'التحليلات', icon: BarChart3 },
  { to: '/dashboard/ai', label: 'المساعد الذكي', icon: Brain },
  { to: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
]

export function DashboardLayout() {
  const { graduateId, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-warm-white" dir="rtl">
      <header className="border-b border-soft-beige/60 bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-luxury-gold" />
            <span className="editorial-heading text-lg">لوحة الخريج</span>
          </div>
          <div className="flex items-center gap-3">
            {graduateId && (
              <Link
                to={`/graduate/${graduateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-luxury-gold hover:underline"
              >
                الرابط العام
              </Link>
            )}
            <MagneticButton onClick={() => signOut()} className="gap-1.5 px-3 py-1.5 text-sm text-muted">
              <LogOut className="h-4 w-4" />
              خروج
            </MagneticButton>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-3 text-sm whitespace-nowrap transition ${
                  isActive
                    ? 'bg-luxury-gold/15 text-charcoal'
                    : 'text-muted hover:bg-soft-beige/40'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="min-w-0">
          <DashboardFeatureFlags>
            <Outlet />
          </DashboardFeatureFlags>
        </main>
      </div>
    </div>
  )
}
