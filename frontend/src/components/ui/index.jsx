// Reusable UI components for FitHub

// Stat Card
export function StatCard({ label, value, unit, sublabel, color = 'violet', icon: Icon, trend }) {
  const colors = {
    violet: { accent:  'var(--accent-violet-bright)' , glow: 'rgba(var(--accent-violet-rgb), 0.15)', border: 'rgba(var(--accent-violet-rgb), 0.15)', hoverBorder: 'rgba(var(--accent-violet-bright-rgb), 0.35)' },
    cyan: { accent:  'var(--accent-cyan)' , glow: 'rgba(var(--accent-cyan-rgb), 0.12)', border: 'rgba(var(--accent-cyan-rgb), 0.15)', hoverBorder: 'rgba(var(--accent-cyan-rgb), 0.35)' },
    green: { accent:  'var(--accent-green)' , glow: 'rgba(var(--accent-green-rgb), 0.12)', border: 'rgba(var(--accent-green-rgb), 0.15)', hoverBorder: 'rgba(var(--accent-green-rgb), 0.35)' },
    amber: { accent:  'var(--accent-amber)' , glow: 'rgba(var(--accent-amber-rgb), 0.12)', border: 'rgba(var(--accent-amber-rgb), 0.15)', hoverBorder: 'rgba(var(--accent-amber-rgb), 0.35)' },
    pink: { accent:  'var(--accent-pink)' , glow: 'rgba(var(--accent-pink-rgb), 0.12)', border: 'rgba(var(--accent-pink-rgb), 0.15)', hoverBorder: 'rgba(var(--accent-pink-rgb), 0.35)' },
  };
  const c = colors[color] || colors.violet;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 12,
        background: 'rgba(var(--bg-surface-rgb), 0.85)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = c.hoverBorder;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 12px 28px -8px ${c.glow}, 0 0 0 1px ${c.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Accent top bar */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${c.accent}, ${window.themeColor(c.accent, 0.6)})`,
        opacity: 0.6,
      }} />
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${c.glow}, transparent 70%)` }}
      />
      <div className="relative" style={{ padding: '18px 20px 16px' }}>
        {/* Top row: label + icon */}
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color:  'var(--text-secondary)' ,
              fontSize: '0.56rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
          {Icon && (
            <div
              className="flex items-center justify-center"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: `${window.themeColor(c.accent, 0.12)}`,
                border: `1px solid ${window.themeColor(c.accent, 0.2)}`,
              }}
            >
              <Icon size={15} style={{ color: c.accent }} />
            </div>
          )}
        </div>
        {/* Value row */}
        <div className="flex items-baseline" style={{ gap: 5 }}>
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '1.65rem',
              fontWeight: 700,
              color:  'var(--text-primary)' ,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          {unit && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: c.accent,
                fontSize: '0.68rem',
                fontWeight: 600,
              }}
            >
              {unit}
            </span>
          )}
        </div>
        {/* Sublabel */}
        {sublabel && (
          <div
            style={{
              color:  'var(--text-secondary)' ,
              fontSize: '0.72rem',
              marginTop: 6,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {sublabel}
          </div>
        )}
        {/* Trend */}
        {trend && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: trend.positive ?  'var(--accent-green)'  :  'var(--accent-pink)' ,
              fontSize: '0.6rem',
              fontWeight: 700,
              marginTop: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
              borderRadius: 4,
              background: trend.positive ? 'rgba(var(--accent-green-rgb),0.1)' : 'rgba(var(--accent-pink-rgb),0.1)',
              fontSize: '0.55rem',
            }}>
              {trend.positive ? '▲' : '▼'}
            </span>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}


// Progress Ring (SVG)
export function ProgressRing({ percent, size = 80, stroke = 5, color =  'var(--accent-violet-bright)' , label, value }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(var(--accent-violet-rgb), 0.1)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 4px ${window.themeColor(color, 0.6)})` }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: '0.95rem' }}
        >
          <span className="stat-number" style={{ color:  'var(--text-primary)' , fontSize: '1rem' }}>
            {value}
          </span>
        </div>
      </div>
      {label && (
        <div className="text-xs mt-1.5 text-center" style={{ color:  'var(--text-secondary)' , fontFamily: 'JetBrains Mono', fontSize: '0.6rem' }}>
          {label}
        </div>
      )}
    </div>
  );
}

// Progress Bar
export function ProgressBar({ value, max, color = 'violet', height = 4, showLabel = false, label }) {
  const pct = Math.min(100, (value / max) * 100);
  const fills = {
    violet: 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
    cyan: 'linear-gradient(90deg, #0891b2, #06b6d4)',
    green: 'linear-gradient(90deg, #059669, #10b981)',
    amber: 'linear-gradient(90deg, #d97706, #f59e0b)',
    pink: 'linear-gradient(90deg, #be185d, #ec4899)',
  };

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs" style={{ color:  'var(--text-secondary)'  }}>{label}</span>
          <span className="text-xs font-mono-code" style={{ color:  'var(--text-primary)' , fontSize: '0.65rem' }}>
            {value} / {max}
          </span>
        </div>
      )}
      <div
        className="rounded-full overflow-hidden"
        style={{ height, background: 'rgba(var(--accent-violet-rgb), 0.1)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: fills[color] || fills.violet,
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: pct > 0 ? `0 0 8px ${color === 'cyan' ? 'rgba(var(--accent-cyan-rgb),0.4)' : 'rgba(var(--accent-violet-rgb),0.4)'}` : 'none',
          }}
        />
      </div>
    </div>
  );
}

// Section Header
export function SectionHeader({ title, subtitle, badge, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        {badge && (
          <div className="chip mb-2 inline-block">{badge}</div>
        )}
        <h2
          className="font-display font-bold"
          style={{ color:  'var(--text-primary)' , letterSpacing: '0.08em', fontSize: '0.9rem' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color:  'var(--text-secondary)'  }}>{subtitle}</p>
        )}
      </div>
      {action && (
        <button
          className="btn-ghost rounded px-3 py-1.5 text-xs"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Workout tag badge
export function WorkoutTag({ tag }) {
  const tagColors = {
    strength: { bg: 'rgba(var(--accent-violet-rgb), 0.1)', border: 'rgba(var(--accent-violet-rgb), 0.25)', color:  'var(--accent-violet-bright)'  },
    cardio: { bg: 'rgba(var(--accent-cyan-rgb), 0.1)', border: 'rgba(var(--accent-cyan-rgb), 0.25)', color:  'var(--accent-cyan)'  },
    hiit: { bg: 'rgba(var(--accent-pink-rgb), 0.1)', border: 'rgba(var(--accent-pink-rgb), 0.25)', color:  'var(--accent-pink)'  },
    legs: { bg: 'rgba(var(--accent-amber-rgb), 0.1)', border: 'rgba(var(--accent-amber-rgb), 0.25)', color:  'var(--accent-amber)'  },
    core: { bg: 'rgba(var(--accent-green-rgb), 0.1)', border: 'rgba(var(--accent-green-rgb), 0.25)', color:  'var(--accent-green)'  },
    upper: { bg: 'rgba(var(--accent-violet-rgb), 0.1)', border: 'rgba(var(--accent-violet-rgb), 0.25)', color:  'var(--accent-violet-bright)'  },
    push: { bg: 'rgba(var(--accent-cyan-rgb), 0.1)', border: 'rgba(var(--accent-cyan-rgb), 0.25)', color:  'var(--accent-cyan)'  },
    mobility: { bg: 'rgba(var(--accent-green-rgb), 0.1)', border: 'rgba(var(--accent-green-rgb), 0.25)', color:  'var(--accent-green)'  },
  };
  const c = tagColors[tag] || tagColors.strength;
  return (
    <span
      className="text-xs rounded px-2 py-0.5"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        fontFamily: 'JetBrains Mono',
        fontSize: '0.6rem',
      }}
    >
      {tag.toUpperCase()}
    </span>
  );
}

// Form Score Badge
export function FormScore({ score }) {
  const color = score >= 90 ?  'var(--accent-green)'  : score >= 75 ?  'var(--accent-cyan)'  :  'var(--accent-amber)' ;
  const label = score >= 90 ? 'EXCELLENT' : score >= 75 ? 'GOOD' : 'NEEDS WORK';
  return (
    <div className="flex items-center gap-2">
      <div
        className="font-display font-bold"
        style={{ color, fontSize: '1.1rem' }}
      >
        {score}
      </div>
      <div>
        <div className="font-mono-code" style={{ color, fontSize: '0.6rem' }}>{label}</div>
        <div style={{ color:  'var(--text-dim)' , fontSize: '0.6rem', fontFamily: 'JetBrains Mono' }}>FORM SCORE</div>
      </div>
    </div>
  );
}
