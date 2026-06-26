import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Bot,
  Clock,
  Zap,
  Library,
  LogOut,
  User,
  ChevronRight,
} from 'lucide-react';

/* ── Nav manifest ── */
const navItems = [
  { id: 'dashboard',       label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'workout',         label: 'Workout',           icon: Dumbbell },
  { id: 'food',            label: 'Food Analysis',     icon: UtensilsCrossed },
  { id: 'progress',        label: 'Progress',          icon: TrendingUp },
  { id: 'exerciselibrary', label: 'Exercise Library',  icon: Library },
  { id: 'coach',           label: 'AI Coach',          icon: Bot },
  { id: 'history',         label: 'History',           icon: Clock },
];

/* ── Inject sidebar stylesheet (once) ── */
const SHEET_ID = 'fithub-sidebar-v4';
if (typeof document !== 'undefined' && !document.getElementById(SHEET_ID)) {
  const s = document.createElement('style');
  s.id = SHEET_ID;
  s.textContent = `
    @keyframes sb-dropdown-enter {
      from { opacity: 0; transform: translateY(6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes sb-indicator-glow {
      0%, 100% { box-shadow: 0 0 8px rgba(139,92,246,0.45), 0 0 3px rgba(139,92,246,0.3); }
      50%      { box-shadow: 0 0 14px rgba(139,92,246,0.6), 0 0 5px rgba(139,92,246,0.4); }
    }

    .sb-scroll::-webkit-scrollbar { width: 0; }
    .sb-scroll { scrollbar-width: none; }

    /* ── Nav item ── */
    .sb-nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 13px;
      width: 100%;
      padding: 11px 18px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: transparent;
      transition: background 0.2s ease, transform 0.15s ease;
      outline: none;
    }
    .sb-nav-item:hover {
      background: rgba(124,58,237,0.07);
    }
    .sb-nav-item:active {
      transform: scale(0.98);
    }

    /* Icon */
    .sb-nav-item .sb-ico {
      transition: color 0.2s ease, filter 0.2s ease, transform 0.2s ease;
      flex-shrink: 0;
    }
    .sb-nav-item:hover .sb-ico {
      color: #c4b5fd !important;
      filter: drop-shadow(0 0 5px rgba(139,92,246,0.3));
      transform: translateX(1px);
    }

    /* Label */
    .sb-nav-item .sb-lbl {
      transition: color 0.2s ease;
    }
    .sb-nav-item:hover .sb-lbl {
      color: #e8eaff !important;
    }

    /* ── Active state ── */
    .sb-nav-item--on {
      background: rgba(124,58,237,0.1) !important;
    }
    .sb-nav-item--on::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      border-radius: 0 4px 4px 0;
      background: linear-gradient(180deg, #8b5cf6, #06b6d4);
      animation: sb-indicator-glow 2.6s ease-in-out infinite;
    }
    .sb-nav-item--on .sb-ico {
      color: #a78bfa !important;
      filter: drop-shadow(0 0 6px rgba(139,92,246,0.35));
    }
    .sb-nav-item--on .sb-lbl {
      color: #e8eaff !important;
      font-weight: 600 !important;
    }

    /* ── Dropdown ── */
    .sb-dd-btn {
      display: flex;
      align-items: center;
      gap: 11px;
      width: 100%;
      padding: 10px 13px;
      border: none;
      border-radius: 9px;
      cursor: pointer;
      background: transparent;
      transition: background 0.18s ease, transform 0.15s ease;
      outline: none;
      text-align: left;
    }
    .sb-dd-btn:hover { transform: translateX(2px); }
    .sb-dd-btn:active { transform: translateX(2px) scale(0.98); }

    /* ── Profile trigger ── */
    .sb-profile-row {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 12px;
      border-radius: 11px;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
      border: 1px solid transparent;
    }
    .sb-profile-row:hover {
      background: rgba(124,58,237,0.06);
      border-color: rgba(124,58,237,0.12);
    }
  `;
  document.head.appendChild(s);
}

export default function Sidebar({ activePage, onNavigate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDropdown]);

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50"
      style={{
        width: 'var(--sidebar-width)',
        background: 'rgba(8,9,15,0.98)',
        borderRight: '1px solid rgba(124,58,237,0.1)',
        boxShadow: '2px 0 28px rgba(0,0,0,0.45)',
      }}
    >
      {/* ━━ Logo — click to go home ━━ */}
      <div
        onClick={() => onNavigate('dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '20px 20px 18px',
          borderBottom: '1px solid rgba(124,58,237,0.08)',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            boxShadow: '0 0 18px rgba(124,58,237,0.4), 0 0 6px rgba(6,182,212,0.2)',
            flexShrink: 0,
          }}
        >
          <Zap size={17} color="white" fill="white" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#e8eaff',
            lineHeight: 1,
          }}
        >
          FITHUB
        </span>
      </div>

      {/* ━━ Navigation ━━ */}
      <nav
        className="sb-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sb-nav-item${isActive ? ' sb-nav-item--on' : ''}`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.1 : 1.7}
                className="sb-ico"
                style={{
                  color: isActive ? '#a78bfa' : '#8b90b8',
                }}
              />
              <span
                className="sb-lbl"
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? '#e8eaff' : '#8b90b8',
                  letterSpacing: '0.015em',
                  fontFamily: "'Space Grotesk', sans-serif",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ━━ Profile ━━ */}
      <div
        ref={wrapRef}
        className="relative"
        style={{
          padding: '10px 10px 14px',
          borderTop: '1px solid rgba(124,58,237,0.08)',
        }}
      >
        {/* Dropdown */}
        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              bottom: '100%',
              marginBottom: 8,
              borderRadius: 12,
              overflow: 'hidden',
              background: 'rgba(11,13,22,0.98)',
              border: '1px solid rgba(124,58,237,0.18)',
              boxShadow:
                '0 -10px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,58,237,0.06), 0 0 24px rgba(124,58,237,0.06)',
              backdropFilter: 'blur(20px)',
              animation: 'sb-dropdown-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 5,
            }}
          >
            <button
              className="sb-dd-btn"
              onClick={() => { onNavigate('profile'); setShowDropdown(false); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(124,58,237,0.12)',
                  flexShrink: 0,
                }}
              >
                <User size={14} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaff', fontFamily: "'Inter', sans-serif" }}>
                  View Profile
                </div>
                <div style={{ fontSize: 10.5, color: '#4a4f72', marginTop: 1, fontFamily: "'Inter', sans-serif" }}>
                  Account & settings
                </div>
              </div>
            </button>

            <div style={{ height: 1, background: 'rgba(124,58,237,0.08)', margin: '3px 12px' }} />

            <button
              className="sb-dd-btn"
              onClick={() => { alert('Logging out...'); setShowDropdown(false); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(248,113,113,0.08)',
                  flexShrink: 0,
                }}
              >
                <LogOut size={14} style={{ color: '#f87171' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#f87171', fontFamily: "'Inter', sans-serif" }}>
                  Logout
                </div>
                <div style={{ fontSize: 10.5, color: '#4a4f72', marginTop: 1, fontFamily: "'Inter', sans-serif" }}>
                  End session
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Profile trigger row */}
        <div
          className="sb-profile-row"
          onClick={() => setShowDropdown((v) => !v)}
          style={{
            background: showDropdown ? 'rgba(124,58,237,0.06)' : 'transparent',
            borderColor: showDropdown ? 'rgba(124,58,237,0.15)' : 'transparent',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              fontFamily: "'Orbitron', monospace",
              fontSize: '0.68rem',
              fontWeight: 700,
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(124,58,237,0.3)',
              letterSpacing: '0.04em',
            }}
          >
            AS
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#e8eaff',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Arjun Sharma
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: '#4a4f72',
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.04em',
              }}
            >
              <span style={{ color: '#f97316', fontSize: 10 }}>🔥</span>
              <span>12-DAY STREAK</span>
            </div>
          </div>

          <ChevronRight
            size={13}
            style={{
              color: '#4a4f72',
              flexShrink: 0,
              transition: 'transform 0.2s ease, color 0.2s ease',
              transform: showDropdown ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </div>
    </aside>
  );
}