import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Dumbbell, UtensilsCrossed,
  TrendingUp, Bot, Clock, Zap, Library,
  LogOut, User, ChevronUp, Flame, Activity,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',       icon: LayoutDashboard                                          },
  { id: 'workout',         label: 'Workout',          icon: Dumbbell,           },
  { id: 'food',            label: 'Food Analysis',    icon: UtensilsCrossed                                         },
  { id: 'progress',        label: 'Progress',         icon: TrendingUp                                              },
  { id: 'exerciselibrary', label: 'Exercise Library', icon: Library                                                 },
  { id: 'coach',           label: 'AI Coach',         icon: Bot,                },
  { id: 'history',         label: 'History',          icon: Clock                                                   },
];

/* ─────────────────────────────────────────────
   NAV BUTTON — cyberpunk hover system
───────────────────────────────────────────── */
function NavButton({ item, isActive, onClick }) {
  const [hovered, setHovered]   = useState(false);
  const [scanning, setScanning] = useState(false);
  const scanTimer = useRef(null);
  const Icon = item.icon;

  /* Trigger the scan-sweep once per hover enter */
  const handleEnter = () => {
    setHovered(true);
    if (!isActive) {
      setScanning(true);
      clearTimeout(scanTimer.current);
      scanTimer.current = setTimeout(() => setScanning(false), 420);
    }
  };
  const handleLeave = () => { setHovered(false); setScanning(false); };

  useEffect(() => () => clearTimeout(scanTimer.current), []);

  const glowColor  = isActive ? 'rgba(139,92,246,0.55)' : 'rgba(6,182,212,0.35)';
  const iconColor  = isActive ? '#c4b5fd' : hovered ? '#67e8f9' : '#4a5070';
  const textColor  = isActive ? '#e8eaff' : hovered ? '#c8cef5' : '#6b7299';

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '9px 14px 9px 16px',
        marginBottom: 1,
        border: 'none', borderRadius: 8,
        cursor: 'pointer', outline: 'none',
        overflow: 'hidden',
        background: isActive
          ? 'linear-gradient(100deg, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0.07) 60%, transparent 100%)'
          : hovered
            ? 'linear-gradient(100deg, rgba(6,182,212,0.07) 0%, rgba(124,58,237,0.04) 70%, transparent 100%)'
            : 'transparent',
        boxShadow: isActive
          ? `inset 0 0 0 1px rgba(124,58,237,0.28), 0 0 14px rgba(124,58,237,0.12)`
          : hovered
            ? `inset 0 0 0 1px rgba(6,182,212,0.18), 0 0 10px rgba(6,182,212,0.07)`
            : 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
      }}
    >
      {/* ── Left accent bar ── */}
      <div style={{
        position: 'absolute', left: 0, top: '50%',
        transform: 'translateY(-50%)',
        width: 3, borderRadius: '0 2px 2px 0',
        height: isActive ? 24 : hovered ? 12 : 0,
        background: isActive
          ? 'linear-gradient(180deg, #a78bfa, #06b6d4)'
          : 'linear-gradient(180deg, #06b6d4, #0891b2)',
        boxShadow: isActive
          ? '0 0 8px rgba(139,92,246,0.8), 0 0 16px rgba(139,92,246,0.4)'
          : '0 0 6px rgba(6,182,212,0.7)',
        transition: 'height 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, box-shadow 0.2s',
      }} />

      {/* ── Scan sweep (fires once on hover enter) ── */}
      {scanning && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.12) 50%, transparent 100%)',
          animation: 'scanSweep 0.42s ease-out forwards',
        }} />
      )}

      {/* ── Bottom edge light on active ── */}
      {isActive && (
        <div style={{
          position: 'absolute', bottom: 0, left: 8, right: 8,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.4), transparent)',
        }} />
      )}

      {/* ── Icon ── */}
      <div style={{
        position: 'relative',
        width: 30, height: 30, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isActive
          ? 'rgba(139,92,246,0.2)'
          : hovered
            ? 'rgba(6,182,212,0.1)'
            : 'transparent',
        border: isActive
          ? '1px solid rgba(139,92,246,0.35)'
          : hovered
            ? '1px solid rgba(6,182,212,0.22)'
            : '1px solid transparent',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
        <Icon
          size={15}
          style={{
            color: iconColor,
            transition: 'color 0.2s',
            filter: isActive
              ? 'drop-shadow(0 0 4px rgba(139,92,246,0.7))'
              : hovered
                ? 'drop-shadow(0 0 4px rgba(6,182,212,0.6))'
                : 'none',
            flexShrink: 0,
          }}
        />
      </div>

      {/* ── Label ── */}
      <span style={{
        flex: 1, textAlign: 'left',
        fontFamily: isActive ? 'Orbitron, monospace' : 'Inter, sans-serif',
        fontSize: isActive ? '0.65rem' : '0.8rem',
        fontWeight: isActive ? 700 : 500,
        letterSpacing: isActive ? '0.08em' : '0.01em',
        color: textColor,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        transition: 'color 0.2s, font-size 0.2s, letter-spacing 0.2s',
        textShadow: isActive ? '0 0 12px rgba(139,92,246,0.5)' : 'none',
      }}>
        {item.label}
      </span>

      {/* ── Badge ── */}
      {item.badge && (
        <span style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '0.42rem', fontWeight: 700, letterSpacing: '0.1em',
          color: item.badgeColor,
          background: `${item.badgeColor}1a`,
          border: `1px solid ${item.badgeColor}40`,
          borderRadius: 3, padding: '1px 5px', flexShrink: 0,
          boxShadow: (isActive || hovered) ? `0 0 6px ${item.badgeColor}50` : 'none',
          transition: 'box-shadow 0.2s',
        }}>
          {item.badge}
        </span>
      )}

      {/* ── Active indicator ── */}
      {isActive && (
        <div style={{
          width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
          background: '#a78bfa',
          boxShadow: '0 0 5px rgba(167,139,250,0.9), 0 0 10px rgba(167,139,250,0.5)',
          animation: 'navPulse 2.5s ease-in-out infinite',
        }} />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   PROFILE MENU ITEM  (compact, cyber-styled)
───────────────────────────────────────────── */
function MenuRow({ icon: Icon, label, color, onClick, accentColor = '#8b5cf6' }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
        padding: '7px 10px', borderRadius: 6, border: 'none',
        cursor: 'pointer', outline: 'none',
        background: hov ? `${accentColor}12` : 'transparent',
        transition: 'background 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* left accent */}
      <div style={{
        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
        width: 2, height: hov ? 16 : 0, borderRadius: 1,
        background: accentColor,
        boxShadow: `0 0 6px ${accentColor}`,
        transition: 'height 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
      <Icon
        size={13}
        style={{
          color: hov ? color : '#4a5070',
          transition: 'color 0.15s',
          filter: hov ? `drop-shadow(0 0 3px ${accentColor}80)` : 'none',
          flexShrink: 0,
        }}
      />
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.75rem', fontWeight: 500,
        color: hov ? color : '#7a80a8',
        letterSpacing: '0.01em',
        transition: 'color 0.15s',
      }}>
        {label}
      </span>
      {/* mono sub-label */}
    </button>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
export default function Sidebar({ activePage, onNavigate }) {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const showMenu = menuOpen || menuHovered;

  return (
    <>
      <style>{`
        @keyframes navPulse {
          0%, 100% { opacity:1; box-shadow:0 0 5px rgba(167,139,250,0.9), 0 0 10px rgba(167,139,250,0.5); }
          50%       { opacity:0.4; box-shadow:0 0 3px rgba(167,139,250,0.4); }
        }
        @keyframes scanSweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        @keyframes logoGlow {
          0%,100% { box-shadow:0 0 14px rgba(124,58,237,0.5), 0 0 28px rgba(124,58,237,0.18); }
          50%     { box-shadow:0 0 20px rgba(124,58,237,0.7), 0 0 40px rgba(6,182,212,0.2);  }
        }
        @keyframes menuUp {
          from { opacity:0; transform:translateY(6px) scale(0.98); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        @keyframes streakPulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.55; }
        }
        .sidebar-scroll::-webkit-scrollbar { width:0; }
      `}</style>

      <aside style={{
        position: 'fixed', left: 0, top: 0,
        height: '100vh', width: 'var(--sidebar-width)',
        display: 'flex', flexDirection: 'column',
        zIndex: 50, overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(6,7,13,1) 0%, rgba(8,9,16,1) 100%)',
        borderRight: '1px solid rgba(124,58,237,0.16)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.6), inset -1px 0 0 rgba(124,58,237,0.06)',
      }}>

        {/* ── ambient top glow ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 180, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 40% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)',
        }} />
        {/* ── ambient bottom glow ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 140, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.07) 0%, transparent 65%)',
        }} />

        {/* ══════════ LOGO ══════════ */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: '20px 18px 18px',
          borderBottom: '1px solid rgba(124,58,237,0.1)',
          flexShrink: 0, position: 'relative',
        }}>
          {/* Icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(145deg, #7c3aed 0%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'logoGlow 4s ease-in-out infinite',
          }}>
            <Zap size={17} color="white" fill="white" />
          </div>

          {/* Wordmark */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontWeight: 800,
              fontSize: '1.0rem', letterSpacing: '0.12em',
              color: '#e8eaff', lineHeight: 1,
              textShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}>
              FITHUB
            </div>
            
          </div>

          
        </div>

        {/* ══════════ NAV ══════════ */}
        <nav
          className="sidebar-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: '14px 10px 6px', position: 'relative' }}
        >
          {/* Section rule */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 6px', marginBottom: 10,
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.12))' }} />
            
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(124,58,237,0.12), transparent)' }} />
          </div>

          {NAV_ITEMS.map(item => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activePage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}

          {/* Decorative bottom rule */}
          <div style={{
            margin: '12px 6px 0',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.08), transparent)',
          }} />
        </nav>

        {/* ══════════ PROFILE ══════════ */}
        <div
          style={{
            flexShrink: 0, position: 'relative',
            padding: '10px 10px 14px',
            borderTop: '1px solid rgba(124,58,237,0.1)',
          }}
          onMouseEnter={() => setMenuHovered(true)}
          onMouseLeave={() => setMenuHovered(false)}
        >
          {/* ── Compact floating menu ── */}
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                left: 10, right: 10,
                bottom: 'calc(100% + 6px)',
                background: 'rgba(7,8,14,0.97)',
                border: '1px solid rgba(124,58,237,0.22)',
                borderRadius: 9, padding: '5px 4px',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.06), inset 0 1px 0 rgba(139,92,246,0.1)',
                backdropFilter: 'blur(16px)',
                zIndex: 60,
                animation: 'menuUp 0.16s ease-out both',
              }}
              onMouseEnter={() => setMenuHovered(true)}
              onMouseLeave={() => setMenuHovered(false)}
            >
              {/* Top cyan accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 12, right: 12, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)',
                borderRadius: 1,
              }} />

              <MenuRow
                icon={User}
                label="View Profile"
                color="#c4b5fd"
                accentColor="#8b5cf6"
                onClick={() => { onNavigate('profile'); setMenuOpen(false); }}
              />

              <div style={{
                height: 1, margin: '3px 8px',
                background: 'rgba(124,58,237,0.1)',
              }} />

              <MenuRow
                icon={LogOut}
                label="Logout"
                color="#f87171"
                accentColor="#ef4444"
                onClick={() => alert('Logging out…')}
              />
            </div>
          )}

          {/* ── Profile trigger row ── */}
          <div
            onClick={() => setMenuOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              borderRadius: 9, cursor: 'pointer',
              border: `1px solid ${showMenu ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.1)'}`,
              background: showMenu
                ? 'linear-gradient(100deg, rgba(124,58,237,0.16) 0%, rgba(124,58,237,0.05) 100%)'
                : 'rgba(124,58,237,0.04)',
              boxShadow: showMenu ? '0 0 16px rgba(124,58,237,0.12)' : 'none',
              transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Sweep on open */}
            {showMenu && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(90deg, rgba(124,58,237,0.06), transparent 60%)',
              }} />
            )}

            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(145deg, #7c3aed 0%, #22d3ee 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
              fontSize: '0.78rem', color: 'white',
              boxShadow: showMenu
                ? '0 0 16px rgba(124,58,237,0.6), 0 0 6px rgba(34,211,238,0.3)'
                : '0 0 10px rgba(124,58,237,0.3)',
              transition: 'box-shadow 0.2s',
              letterSpacing: '0.04em',
            }}>
              AS
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: '0.8rem', color: showMenu ? '#dde1ff' : '#bfc4e8',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                transition: 'color 0.2s',
              }}>
                Arjun Sharma
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Flame
                  size={9}
                  style={{
                    color: '#f59e0b', flexShrink: 0,
                    filter: 'drop-shadow(0 0 3px rgba(245,158,11,0.6))',
                    animation: 'streakPulse 2s ease-in-out infinite',
                  }}
                />
                <span style={{
                  fontFamily: 'monospace', fontSize: '0.54rem',
                  color: '#3e4570', letterSpacing: '0.06em',
                }}>
                  12-day streak
                </span>
              </div>
            </div>

            {/* Chevron */}
            <ChevronUp size={11} style={{
              color: showMenu ? '#8b5cf6' : '#2e3255',
              flexShrink: 0,
              transform: showMenu ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), color 0.2s',
              filter: showMenu ? 'drop-shadow(0 0 3px rgba(139,92,246,0.6))' : 'none',
            }} />
          </div>
        </div>

      </aside>
    </>
  );
}