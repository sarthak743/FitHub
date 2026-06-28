import { useState, useRef, useCallback } from 'react';
import { Flame } from 'lucide-react';
import { user } from '../../data/mockData.js';

/* ── Inject keyframe once globally ── */
const ANIM_ID = 'header-profile-anim';
if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
  const style = document.createElement('style');
  style.id = ANIM_ID;
  style.textContent = `
    @keyframes hdr-slideDown {
      from { opacity: 0; transform: translateY(-6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .hdr-stat-tile {
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .hdr-stat-tile:hover {
      border-color: rgba(var(--accent-violet-bright-rgb),0.2) !important;
      background: rgba(var(--accent-violet-rgb),0.09) !important;
    }
  `;
  document.head.appendChild(style);
}

export default function Header({ activePage, onNavigate }) {
  const [profileVisible, setProfileVisible] = useState(false);
  const hideTimer = useRef(null);

  /* ── Hover helpers with 180ms close delay for smooth UX ── */
  const showProfile = useCallback(() => {
    clearTimeout(hideTimer.current);
    setProfileVisible(true);
  }, []);

  const hideProfile = useCallback(() => {
    hideTimer.current = setTimeout(() => setProfileVisible(false), 180);
  }, []);

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

  const bmi =
    user.weight && user.height
      ? (user.weight / (user.height / 100) ** 2).toFixed(1)
      : '—';

  const initials = (user.name || 'AS')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between"
      style={{
        left: 'var(--sidebar-width)',
        height: 'var(--header-height)',
        padding: '0 28px',
        background: 'rgba(var(--bg-base-rgb),0.92)',
        borderBottom: '1px solid rgba(var(--accent-violet-rgb),0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* ── Left: page breadcrumb ── */}
      <div className="flex items-center gap-3">
        <div>
          <div
            style={{
              color:  'var(--text-primary)' ,
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              fontFamily: "'Orbitron', monospace",
              fontWeight: 700,
            }}
          >
            {pageLabels[activePage]?.toUpperCase()}
          </div>
          <div
            style={{
              color:  'var(--text-dim)' ,
              fontSize: '0.58rem',
              marginTop: 2,
              letterSpacing: '0.08em',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            {dateStr.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Right: streak + clock + avatar ── */}
      <div className="flex items-center" style={{ gap: 18 }}>

        {/* Streak — flame icon + number, energetic */}
        <div className="hidden md:flex items-center" style={{ gap: 6 }}>
          <Flame
            size={15}
            style={{
              color: '#f97316',
              fontSize: '3.0rem',
              filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.5))',
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#fb923c',
              textShadow: '0 0 10px rgba(249,115,22,0.3)',
              letterSpacing: '0.04em',
            }}
          >
            {user.streak}
          </span>
        </div>

        {/* Clock */}
        <div
          className="hidden md:block tabular-nums"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            color:  'var(--text-dim)' ,
            fontSize: '0.66rem',
            letterSpacing: '0.1em',
          }}
        >
          {timeStr}
        </div>

        {/* Divider */}
        <div
          className="hidden md:block"
          style={{
            width: 1,
            height: 18,
            background: 'rgba(var(--accent-violet-rgb),0.12)',
          }}
        />

        {/* ── Avatar + profile hover card ── */}
        <div
          className="relative"
          onMouseEnter={showProfile}
          onMouseLeave={hideProfile}
        >
          {/* Avatar button */}
          <button
            className="flex items-center justify-center rounded-full"
            style={{
              width: 33,
              height: 33,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              fontFamily: "'Orbitron', monospace",
              fontSize: '0.58rem',
              fontWeight: 700,
              border: profileVisible
                ? '2px solid rgba(var(--accent-violet-bright-rgb),0.65)'
                : '2px solid rgba(var(--accent-violet-rgb),0.2)',
              boxShadow: profileVisible
                ? '0 0 14px rgba(var(--accent-violet-rgb),0.45)'
                : '0 0 0 rgba(0,0,0,0)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
              outline: 'none',
              letterSpacing: '0.03em',
            }}
          >
            {initials}
          </button>

          {/* Profile hover card */}
          {profileVisible && (
            <div
              className="absolute right-0 top-full overflow-hidden"
              style={{
                marginTop: 10,
                width: 236,
                borderRadius: 12,
                background: 'rgba(var(--bg-card-rgb),0.98)',
                border: '1px solid rgba(var(--accent-violet-rgb),0.15)',
                boxShadow:
                  '0 16px 48px rgba(0,0,0,0.65), 0 0 24px rgba(var(--accent-violet-rgb),0.06)',
                backdropFilter: 'blur(20px)',
                zIndex: 60,
                animation: 'hdr-slideDown 0.2s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Ambient glow */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background:
                    'radial-gradient(circle at top right, rgba(var(--accent-violet-rgb),0.1), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Header band */}
              <div
                className="flex items-center"
                style={{
                  gap: 11,
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(var(--accent-violet-rgb),0.08)',
                  background:
                    'linear-gradient(135deg, rgba(var(--accent-violet-rgb),0.08), rgba(var(--accent-cyan-rgb),0.04))',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 34,
                    height: 34,
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    color: 'white',
                    fontFamily: "'Orbitron', monospace",
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    border: '1px solid rgba(var(--accent-violet-bright-rgb),0.3)',
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div
                    style={{
                      color:  'var(--text-primary)' ,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    className="flex items-center"
                    style={{
                      gap: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#f97316',
                      fontSize: '0.56rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      marginTop: 2,
                    }}
                  >
                    <Flame size={9} />
                    {user.streak}-DAY STREAK
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div
                className="grid grid-cols-2"
                style={{ padding: 12, gap: 8 }}
              >
                {[
                  { label: 'AGE', value: user.age ? `${user.age} yrs` : '—' },
                  { label: 'HEIGHT', value: user.height ? `${user.height} cm` : '—' },
                  { label: 'WEIGHT', value: user.weight ? `${user.weight} kg` : '—' },
                  { label: 'BMI', value: bmi },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="hdr-stat-tile"
                    style={{
                      borderRadius: 8,
                      padding: '8px 10px',
                      background: 'rgba(var(--accent-violet-rgb),0.05)',
                      border: '1px solid rgba(var(--accent-violet-rgb),0.08)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color:  'var(--text-dim)' ,
                        fontSize: '0.5rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        color: '#c4b5fd',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* View profile button */}
              <div style={{ padding: '0 12px 12px' }}>
                <button
                  onClick={() => {
                    setProfileVisible(false);
                    onNavigate('profile');
                  }}
                  className="w-full"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    padding: '8px 0',
                    borderRadius: 8,
                    background: 'rgba(var(--accent-violet-rgb),0.08)',
                    border: '1px solid rgba(var(--accent-violet-rgb),0.18)',
                    color: '#a78bfa',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--accent-violet-rgb),0.16)';
                    e.currentTarget.style.color = '#c4b5fd';
                    e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-bright-rgb),0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--accent-violet-rgb),0.08)';
                    e.currentTarget.style.color = '#a78bfa';
                    e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-rgb),0.18)';
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