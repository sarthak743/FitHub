// Reusable UI components for FitHub

// Stat Card
export function StatCard({ label, value, unit, sublabel, color = 'violet', icon: Icon, trend }) {
  const colors = {
    violet: { accent: '#8b5cf6', glow: 'rgba(124, 58, 237, 0.2)', border: 'rgba(124, 58, 237, 0.2)' },
    cyan: { accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.2)' },
    green: { accent: '#10b981', glow: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.2)' },
    amber: { accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.2)' },
    pink: { accent: '#ec4899', glow: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.2)' },
  };
  const c = colors[color] || colors.violet;

  return (
    <div
      className="rounded-lg p-4 relative overflow-hidden"
      style={{
        background: 'rgba(13, 15, 26, 0.8)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${c.glow}, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-2">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: '#8b90b8', fontFamily: 'JetBrains Mono', fontSize: '0.58rem' }}
          >
            {label}
          </div>
          {Icon && (
            <Icon size={14} style={{ color: c.accent }} />
          )}
        </div>
        <div className="flex items-end gap-1">
          <span
            className="stat-number"
            style={{ fontSize: '1.75rem', color: '#e8eaff' }}
          >
            {value}
          </span>
          {unit && (
            <span
              className="mb-1 font-mono-code"
              style={{ color: c.accent, fontSize: '0.7rem' }}
            >
              {unit}
            </span>
          )}
        </div>
        {sublabel && (
          <div className="text-xs mt-1" style={{ color: '#8b90b8' }}>
            {sublabel}
          </div>
        )}
        {trend && (
          <div
            className="mt-1 text-xs font-mono-code"
            style={{ color: trend.positive ? '#10b981' : '#ec4899', fontSize: '0.65rem' }}
          >
            {trend.positive ? '▲' : '▼'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}

// Progress Ring (SVG)
export function ProgressRing({ percent, size = 80, stroke = 5, color = '#8b5cf6', label, value }) {
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
            stroke="rgba(124, 58, 237, 0.1)"
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
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 4px ${color}60)` }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: '0.95rem' }}
        >
          <span className="stat-number" style={{ color: '#e8eaff', fontSize: '1rem' }}>
            {value}
          </span>
        </div>
      </div>
      {label && (
        <div className="text-xs mt-1.5 text-center" style={{ color: '#8b90b8', fontFamily: 'JetBrains Mono', fontSize: '0.6rem' }}>
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
          <span className="text-xs" style={{ color: '#8b90b8' }}>{label}</span>
          <span className="text-xs font-mono-code" style={{ color: '#e8eaff', fontSize: '0.65rem' }}>
            {value} / {max}
          </span>
        </div>
      )}
      <div
        className="rounded-full overflow-hidden"
        style={{ height, background: 'rgba(124, 58, 237, 0.1)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: fills[color] || fills.violet,
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: pct > 0 ? `0 0 8px ${color === 'cyan' ? 'rgba(6,182,212,0.4)' : 'rgba(124,58,237,0.4)'}` : 'none',
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
          style={{ color: '#e8eaff', letterSpacing: '0.08em', fontSize: '0.9rem' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: '#8b90b8' }}>{subtitle}</p>
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
    strength: { bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)', color: '#8b5cf6' },
    cardio: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)', color: '#06b6d4' },
    hiit: { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.25)', color: '#ec4899' },
    legs: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b' },
    core: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', color: '#10b981' },
    upper: { bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)', color: '#8b5cf6' },
    push: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)', color: '#06b6d4' },
    mobility: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', color: '#10b981' },
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
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#06b6d4' : '#f59e0b';
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
        <div style={{ color: '#4a4f72', fontSize: '0.6rem', fontFamily: 'JetBrains Mono' }}>FORM SCORE</div>
      </div>
    </div>
  );
}
