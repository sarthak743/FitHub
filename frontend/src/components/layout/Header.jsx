import { useState } from 'react';
import { Flame } from 'lucide-react';
import { user } from '../../data/mockData.js';

export default function Header({ activePage, onNavigate }) {
  const [profileHovered, setProfileHovered] = useState(false);

  const pageLabels = {
    dashboard: 'Dashboard',
    workout: 'Workout',
    food: 'Food Analysis',
    progress: 'Progress',
    coach: 'AI Coach',
    history: 'History',
    profile: 'Profile',
    exerciselibrary: 'Exercise Library',
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  /* Derived BMI */
  const bmi = user.weight && user.height
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
    : '—';

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between"
      style={{
        left: 'var(--sidebar-width)',
        height: 'var(--header-height)',
        padding: '0 28px',
        background: 'rgba(8,9,15,0.92)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* ── Left: page breadcrumb ── */}
      <div className="flex items-center gap-3">
        <div>
          <div
            className="font-display font-bold"
            style={{
              color: '#e8eaff',
              fontSize: '0.8rem',
              letterSpacing: '0.14em',
            }}
          >
            {pageLabels[activePage]?.toUpperCase()}
          </div>
          <div
            className="font-mono"
            style={{ color: '#3d4168', fontSize: '0.6rem', marginTop: '2px', letterSpacing: '0.08em' }}
          >
            {dateStr.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Right: streak + clock + avatar ── */}
      <div className="flex items-center gap-5">

        {/* Streak pill */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(239,115,22,0.1)',
            border: '1px solid rgba(239,115,22,0.2)',
          }}
        >
          <Flame size={13} style={{ color: '#f97316' }} />
          <span
            className="font-mono font-bold"
            style={{ color: '#fb923c', fontSize: '0.68rem', letterSpacing: '0.1em' }}
          >
            {user.streak}-DAY STREAK
          </span>
        </div>

        {/* Clock */}
        <div
          className="hidden md:block font-mono font-bold tabular-nums"
          style={{ color: '#3d4168', fontSize: '0.72rem', letterSpacing: '0.12em' }}
        >
          {timeStr}
        </div>

        {/* Divider */}
        <div
          className="hidden md:block"
          style={{ width: '1px', height: '20px', background: 'rgba(124,58,237,0.15)' }}
        />

        {/* Avatar + profile card */}
        <div
          className="relative"
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => setProfileHovered(false)}
        >
          {/* Avatar button */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center justify-center rounded-full font-bold transition-all"
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.62rem',
              border: profileHovered
                ? '2px solid rgba(139,92,246,0.7)'
                : '2px solid rgba(124,58,237,0.25)',
              boxShadow: profileHovered ? '0 0 14px rgba(124,58,237,0.5)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            {(user.name || 'AS').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </button>

          {/* Profile hover card */}
          {profileHovered && (
            <div
              className="absolute right-0 top-full mt-3 rounded-2xl overflow-hidden"
              style={{
                width: 240,
                background: 'rgba(11,13,22,0.98)',
                border: '1px solid rgba(124,58,237,0.2)',
                boxShadow: '0 20px 48px rgba(0,0,0,0.7), 0 0 30px rgba(124,58,237,0.08)',
                backdropFilter: 'blur(16px)',
                zIndex: 60,
                animation: 'slideDownFade 0.2s ease',
              }}
            >
              <style>{`
                @keyframes slideDownFade {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* Header band */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{
                  borderBottom: '1px solid rgba(124,58,237,0.1)',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full font-bold shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    color: 'white',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.65rem',
                    border: '1px solid rgba(124,58,237,0.35)',
                  }}
                >
                  {(user.name || 'AS').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: '#e8eaff', letterSpacing: '0.02em' }}>
                    {user.name}
                  </div>
                  <div className="font-mono flex items-center gap-1 mt-0.5" style={{ color: '#f97316', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                    <Flame size={10} />
                    {user.streak}-DAY STREAK
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-px p-4 gap-3">
                {[
                  { label: 'AGE',    value: user.age ? `${user.age} yrs` : '—' },
                  { label: 'HEIGHT', value: user.height ? `${user.height} cm` : '—' },
                  { label: 'WEIGHT', value: user.weight ? `${user.weight} kg` : '—' },
                  { label: 'BMI',    value: bmi },
                ].map(item => (
                  <div
                    key={item.label}
                    className="rounded-lg px-3 py-2.5"
                    style={{
                      background: 'rgba(124,58,237,0.06)',
                      border: '1px solid rgba(124,58,237,0.1)',
                    }}
                  >
                    <div
                      className="font-mono font-bold mb-1"
                      style={{ color: '#3d4168', fontSize: '0.55rem', letterSpacing: '0.14em' }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="font-mono font-bold"
                      style={{ color: '#c4b5fd', fontSize: '0.78rem' }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* View profile link */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => onNavigate('profile')}
                  className="w-full py-2 rounded-lg font-mono font-bold text-xs tracking-widest transition-colors"
                  style={{
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.22)',
                    color: '#a78bfa',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
                    e.currentTarget.style.color = '#c4b5fd';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                    e.currentTarget.style.color = '#a78bfa';
                  }}
                >
                  VIEW PROFILE →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}