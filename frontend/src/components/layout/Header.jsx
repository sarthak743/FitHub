import { Bell, Search } from 'lucide-react';

export default function Header({ activePage }) {
  const pageLabels = {
    dashboard: 'Dashboard',
    workout: 'Workout',
    food: 'Food Analysis',
    progress: 'Progress',
    coach: 'AI Coach',
    history: 'History',
    profile: 'Profile',
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between px-6 py-3"
      style={{
        left: 'var(--sidebar-width)',
        height: 'var(--header-height)',
        background: 'rgba(8, 9, 15, 0.9)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div>
          <div
            className="font-display font-bold text-sm"
            style={{ color: '#e8eaff', letterSpacing: '0.12em' }}
          >
            {pageLabels[activePage]?.toUpperCase()}
          </div>
          <div
            className="text-xs font-mono-code header-date"
            style={{ color: '#4a4f72', fontSize: '0.6rem' }}
          >
            {dateStr}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 header-actions">
        {/* Status indicators */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                animation: 'pulse-ring 2s ease-in-out infinite',
              }}
            />
            <span className="font-mono-code text-xs" style={{ color: '#10b981', fontSize: '0.62rem' }}>
              AI ONLINE
            </span>
          </div>
          <div
            className="font-mono-code"
            style={{ color: '#4a4f72', fontSize: '0.7rem' }}
          >
            {timeStr}
          </div>
        </div>

        {/* Search */}
        <button
          className="flex items-center justify-center rounded p-1.5 transition-cyber"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            color: '#8b90b8',
          }}
        >
          <Search size={14} />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center rounded p-1.5 transition-cyber"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            color: '#8b90b8',
          }}
        >
          <Bell size={14} />
          <span
            className="absolute -top-1 -right-1 rounded-full flex items-center justify-center text-white"
            style={{
              width: 14,
              height: 14,
              background: '#7c3aed',
              fontSize: '0.5rem',
              fontFamily: 'Orbitron',
            }}
          >
            3
          </span>
        </button>
      </div>
    </header>
  );
}
