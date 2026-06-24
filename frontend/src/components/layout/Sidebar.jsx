import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Bot,
  Clock,
  User,
  Zap,
  Library
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'food', label: 'Food Analysis', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'exerciselibrary', label: 'Exercise Library', icon: Library},
  { id: 'coach', label: 'AI Coach', icon: Bot },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50"
      style={{
        width: 'var(--sidebar-width)',
        background: 'rgba(8, 9, 15, 0.98)',
        borderRight: '1px solid rgba(124, 58, 237, 0.12)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(124, 58, 237, 0.1)' }}
      >
        <div
          className="flex items-center justify-center rounded"
          style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          }}
        >
          <Zap size={16} color="white" fill="white" />
        </div>
        <div className="sidebar-logo-copy">
          <div
            className="font-display text-sm font-bold"
            style={{ color: '#e8eaff', letterSpacing: '0.1em' }}
          >
            FITHUB
          </div>
          <div className="text-xs" style={{ color: '#4a4f72', fontFamily: 'JetBrains Mono', fontSize: '0.6rem' }}>
            v2.4.1 · AI ACTIVE
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2">
          <span
            className="sidebar-section-label text-xs uppercase tracking-widest"
            style={{ color: '#4a4f72', fontFamily: 'JetBrains Mono', fontSize: '0.58rem' }}
          >
            Navigation
          </span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-nav-button w-full flex items-center gap-3 px-4 py-3 mb-0.5 cursor-pointer ${isActive ? 'sidebar-item-active' : 'sidebar-item'}`}
              style={{ background: 'none', border: 'none' }}
            >
              <Icon size={16} />
              <span
                className="sidebar-nav-copy text-sm font-medium"
                style={{
                  fontFamily: item.id === activePage ? 'Orbitron' : 'Inter',
                  fontSize: isActive ? '0.72rem' : '0.83rem',
                  letterSpacing: isActive ? '0.05em' : '0',
                }}
              >
                {item.label}
              </span>
              {item.id === 'coach' && (
                <span
                  className="sidebar-badge ml-auto badge-ai"
                  style={{ fontSize: '0.58rem', padding: '1px 5px' }}
                >
                  AI
                </span>
              )}
              {item.id === 'workout' && (
                <span
                  className="sidebar-badge ml-auto badge-live"
                  style={{ fontSize: '0.58rem', padding: '1px 5px' }}
                >
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Mini */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(124, 58, 237, 0.1)' }}
      >
        <div className="sidebar-user-mini flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              fontFamily: 'Orbitron',
              fontSize: '0.65rem',
            }}
          >
            AS
          </div>
          <div className="sidebar-user-copy">
            <div className="text-sm font-medium" style={{ color: '#e8eaff' }}>
              Arjun Sharma
            </div>
            <div className="text-xs" style={{ color: '#4a4f72' }}>
              🔥 12-day streak
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
