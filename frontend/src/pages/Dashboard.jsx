import { useState, useEffect } from 'react';
import {
  Flame, Zap, TrendingUp, Activity, Target, ChevronRight, Brain,
  Dumbbell, Camera, Bot, BarChart2, CheckCircle2, Trophy,
  Footprints,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { StatCard, ProgressBar, SectionHeader, WorkoutTag } from '../components/ui/index.jsx';
import { progressData, workoutHistory, goals, user } from '../data/mockData.js';

/* ─────────────────────────────────────────────
   INJECT DASHBOARD KEYFRAMES (once)
───────────────────────────────────────────── */
const DASH_STYLE_ID = 'fithub-dash-v2';
if (typeof document !== 'undefined' && !document.getElementById(DASH_STYLE_ID)) {
  const s = document.createElement('style');
  s.id = DASH_STYLE_ID;
  s.textContent = `
    @keyframes dash-pulseGlow {
      0%,100% { opacity:0.45; transform:translate(30%,-30%) scale(1); }
      50%      { opacity:0.75; transform:translate(30%,-30%) scale(1.1); }
    }
    @keyframes dash-ringPulse {
      0%,100% { filter: drop-shadow(0 0 6px var(--ring-color, rgba(var(--accent-violet-bright-rgb),0.4))); }
      50%     { filter: drop-shadow(0 0 14px var(--ring-color, rgba(var(--accent-violet-bright-rgb),0.5))); }
    }
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   NEURAL BACKGROUND
───────────────────────────────────────────── */
function NeuralBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.3 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.4" fill="rgba(var(--accent-violet-rgb),0.3)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED PROGRESS RING
   — no background box, clean transparent SVG,
     smooth spring animation with glow
───────────────────────────────────────────── */
function AnimatedProgressRing({ percent, size = 104, stroke = 7, color, label, delay = 0 }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const finalOffset = circumference - (Math.min(percent, 100) / 100) * circumference;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const t = setTimeout(() => setOffset(finalOffset), 150 + delay);
    return () => clearTimeout(t);
  }, [finalOffset, delay]);

  return (
    <div className="flex flex-col items-center" style={{ gap: 10 }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          {/* Track ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(var(--accent-violet-rgb),0.08)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: `stroke-dashoffset 1.6s cubic-bezier(0.34, 1.15, 0.64, 1) ${delay}ms`,
              filter: `drop-shadow(0 0 8px ${window.themeColor(color, 0.7)})`,
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* Center percentage */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: 700,
            color:  'var(--text-primary)' ,
            fontSize: '0.88rem',
            letterSpacing: '0.02em',
          }}
        >
          {`${Math.round(percent)}%`}
        </div>
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          color:  'var(--text-dim)' ,
          fontSize: '0.58rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STREAK CALENDAR
   — each day tile has hover micro-interactions
───────────────────────────────────────────── */
function StreakCalendar() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const done = [true, true, true, true, false, false, false];
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center" style={{ gap: 6 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: done[i]
                ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                : 'rgba(var(--accent-violet-rgb),0.05)',
              border: done[i]
                ? '1px solid rgba(var(--accent-violet-bright-rgb),0.35)'
                : '1px solid rgba(var(--accent-violet-rgb),0.08)',
              boxShadow: done[i] ? '0 0 10px rgba(var(--accent-violet-rgb),0.25)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              if (done[i]) {
                e.currentTarget.style.transform = 'scale(1.12)';
                e.currentTarget.style.boxShadow = '0 0 18px rgba(var(--accent-violet-rgb),0.45), 0 0 6px rgba(var(--accent-cyan-rgb),0.3)';
                e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-bright-rgb),0.55)';
              } else {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.background = 'rgba(var(--accent-violet-rgb),0.1)';
                e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-rgb),0.2)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(var(--accent-violet-rgb),0.15)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              if (done[i]) {
                e.currentTarget.style.boxShadow = '0 0 10px rgba(var(--accent-violet-rgb),0.25)';
                e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-bright-rgb),0.35)';
              } else {
                e.currentTarget.style.background = 'rgba(var(--accent-violet-rgb),0.05)';
                e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-rgb),0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {done[i] && <CheckCircle2 size={13} color="white" strokeWidth={2.5} />}
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: done[i] ?  'var(--accent-violet-bright)'  :  'var(--text-dim)' ,
              fontSize: '0.56rem',
              fontWeight: 700,
              transition: 'color 0.2s ease',
            }}
          >
            {d}
          </span>
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────
   CHART TOOLTIP
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        borderRadius: 10,
        padding: '10px 14px',
        background: 'rgba(var(--bg-card-rgb),0.97)',
        border: '1px solid rgba(var(--accent-violet-rgb),0.18)',
        fontSize: '0.72rem',
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ color:  'var(--text-dim)' , marginBottom: 4, letterSpacing: '0.08em', fontSize: '0.6rem', fontWeight: 700 }}>
        {String(label || '').toUpperCase()}
      </div>
      <div style={{ color:  'var(--accent-cyan)' , fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Footprints size={12} />
        {Number(payload[0]?.value ?? 0).toLocaleString()}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DASHBOARD CARD
   — unified card wrapper with staggered entrance,
     accent top bar, and hover lift
───────────────────────────────────────────── */
function DashboardCard({ children, color =  'var(--accent-violet-bright)' , style = {}, className = '', delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-hidden ${className}`}
      style={{
        borderRadius: 14,
        background: 'rgba(var(--bg-surface-rgb),0.85)',
        border: `1px solid ${hovered ? color + '35' : 'rgba(var(--accent-violet-rgb),0.08)'}`,
        transform: `translateY(${hovered ? '-2px' : mounted ? '0' : '12px'})`,
        opacity: mounted ? 1 : 0,
        boxShadow: hovered
          ? `0 16px 36px -10px ${window.themeColor(color, 0.18)}, 0 0 0 1px ${window.themeColor(color, 0.08)}`
          : '0 2px 12px rgba(0,0,0,0.2)',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        ...style,
      }}
    >
      {/* Accent top bar */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${color}, ${window.themeColor(color, 0.5)})`,
          opacity: hovered ? 0.9 : 0.4,
          transition: 'opacity 0.4s ease',
        }}
      />
      <div style={{ padding: '26px 28px' }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────── */
export default function Dashboard({ onNavigate }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const today = progressData.today;
  const workoutPercent = (3 / 5) * 100;

  return (
    <div className="relative page-shell">
      <NeuralBackground />

      <div
        className="relative"
        style={{ zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {/* ── Hero Strip ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--accent-violet-rgb),0.08), rgba(var(--accent-cyan-rgb),0.04))',
            borderBottom: '1px solid rgba(var(--accent-violet-rgb),0.08)',
            padding: '48px 40px 40px',
            marginBottom: 0,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute right-0 top-0 w-80 h-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at right, rgba(var(--accent-cyan-rgb),0.08), transparent 70%)',
            }}
          />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: greeting */}
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1) 100ms',
              }}
            >
              {/* Streak inline badge */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex items-center"
                  style={{ gap: 6 }}
                >
                  <Flame
                    size={15}
                    style={{
                      color: '#f97316',
                      filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.5))',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      color: '#fb923c',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      textShadow: '0 0 12px rgba(249,115,22,0.25)',
                    }}
                  >
                    {user.streak}-DAY STREAK
                  </span>
                </div>
              </div>

              <h1
                className="font-display font-bold mb-3"
                style={{
                  color:  'var(--text-primary)' ,
                  fontSize: '2.2rem',
                  letterSpacing: '0.02em',
                  lineHeight: 1.12,
                }}
              >
                GOOD MORNING,{' '}
                <span className="gradient-text-violet">
                  {user.name?.split(' ')[0]?.toUpperCase() || ''}
                </span>
              </h1>
              <p
                style={{
                  color:  'var(--text-secondary)' ,
                  maxWidth: '460px',
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                }}
              >
                4 days ahead of your weekly target. Keep the momentum going.
              </p>
            </div>

            {/* Right: animated rings */}
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(12px)',
                transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1) 300ms',
              }}
            >
              <div className="flex items-center" style={{ gap: 36 }}>
                <AnimatedProgressRing
                  percent={(today.steps / today.stepsGoal) * 100}
                  size={104} stroke={7}
                  color= "var(--accent-cyan)" 
                  label="STEPS"
                  delay={0}
                />
                <AnimatedProgressRing
                  percent={workoutPercent}
                  size={104} stroke={7}
                  color= "var(--accent-violet-bright)" 
                  label="WORKOUTS"
                  delay={140}
                />
                <AnimatedProgressRing
                  percent={(today.calories / today.caloriesGoal) * 100}
                  size={104} stroke={7}
                  color= "var(--accent-green)" 
                  label="CALORIES"
                  delay={280}
                />
              </div>
            </div>
          </div>

          {/* Streak calendar */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 4,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1) 500ms',
            }}
          >
            <StreakCalendar />
          </div>
        </div>

        {/* ── Page content ── */}
        <div className="page-inner dashboard-content" style={{ padding: '36px 40px 48px' }}>

          {/* Stat cards row */}
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginBottom: 40,
            }}
          >
            {[
              {
                label: "Today's Steps",
                value: today.steps.toLocaleString(),
                unit: 'steps',
                sublabel: `Goal: ${today.stepsGoal.toLocaleString()}`,
                color: 'cyan',
                icon: Activity,
                trend: { positive: true, value: '+1.2k vs yesterday' },
                delay: 100,
              },
              {
                label: 'Calories In',
                value: today.calories,
                unit: 'kcal',
                sublabel: `Target: ${today.caloriesGoal}`,
                color: 'green',
                icon: Zap,
                trend: { positive: false, value: '-180 from target' },
                delay: 160,
              },
              {
                label: 'Weekly Workouts',
                value: '3',
                unit: '/ 5',
                sublabel: '2 more to hit target',
                color: 'violet',
                icon: Trophy,
                trend: { positive: true, value: 'On track' },
                delay: 220,
              },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transition: `all 0.5s cubic-bezier(0.23,1,0.32,1) ${stat.delay}ms`,
                }}
              >
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  unit={stat.unit}
                  sublabel={stat.sublabel}
                  color={stat.color}
                  icon={stat.icon}
                  trend={stat.trend}
                />
              </div>
            ))}
          </div>

          {/* Main 2-column grid */}
          <div
            className="dashboard-main-grid"
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}
          >
            {/* ── Left column ── */}
            <div className="flex flex-col" style={{ gap: 28 }}>

              {/* Step Activity — histogram bar chart */}
              <DashboardCard color= "var(--accent-cyan)"  delay={200}>
                <SectionHeader
                  title="STEP ACTIVITY"
                  subtitle="Last 7 days"
                  badge="· TRACKING"
                  action={{ label: 'View Progress →', onClick: () => onNavigate('progress') }}
                />
                <div style={{ marginTop: 20 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={progressData.steps}
                      margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                      barCategoryGap="28%"
                    >
                      <CartesianGrid
                        stroke="rgba(var(--accent-violet-rgb),0.04)"
                        vertical={false}
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill:  'var(--text-dim)' , fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill:  'var(--text-dim)' , fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(var(--accent-cyan-rgb),0.03)', radius: 4 }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[5, 5, 0, 0]}
                        maxBarSize={40}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {progressData.steps.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.value >= today.stepsGoal ?  'var(--accent-cyan)'  : '#1a3f4d'}
                            fillOpacity={0.88}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Last Workout + AI Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 28 }}>

                {/* Last Workout */}
                <DashboardCard color= "var(--accent-violet-bright)"  delay={280}>
                  <SectionHeader title="LAST WORKOUT" badge="· COMPLETED" />
                  {(() => {
                    const w = workoutHistory[0];
                    return (
                      <div style={{ marginTop: 18 }}>
                        <div
                          className="font-display font-bold"
                          style={{
                            color:  'var(--text-primary)' ,
                            fontSize: '1.05rem',
                            letterSpacing: '0.06em',
                            marginBottom: 14,
                          }}
                        >
                          {w.name.toUpperCase()}
                        </div>
                        <div className="flex gap-2 flex-wrap" style={{ marginBottom: 16 }}>
                          {w.tags.map(t => <WorkoutTag key={t} tag={t} />)}
                        </div>
                        <div
                          className="grid grid-cols-2"
                          style={{
                            gap: 12,
                            marginBottom: 20,
                            padding: 16,
                            borderRadius: 10,
                            background: 'rgba(var(--accent-violet-rgb),0.05)',
                            border: '1px solid rgba(var(--accent-violet-rgb),0.08)',
                          }}
                        >
                          {[
                            { label: 'Duration', value: w.duration },
                            { label: 'Reps',     value: w.reps },
                            { label: 'Calories', value: `${w.calories} kcal` },
                            { label: 'Form',     value: `${w.formScore}/100` },
                          ].map(stat => (
                            <div key={stat.label}>
                              <div
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  color:  'var(--text-dim)' ,
                                  fontSize: '0.58rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.1em',
                                  marginBottom: 5,
                                }}
                              >
                                {stat.label.toUpperCase()}
                              </div>
                              <div
                                className="font-display font-semibold"
                                style={{ color:  'var(--text-primary)' , fontSize: '0.98rem' }}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          className="w-full btn-ghost text-xs font-bold tracking-widest transition-all active:scale-[0.97]"
                          style={{ borderRadius: 10, padding: '10px 16px' }}
                          onClick={() => onNavigate('history')}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(var(--accent-violet-rgb),0.08)';
                            e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-bright-rgb),0.3)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '';
                          }}
                        >
                          VIEW HISTORY →
                        </button>
                      </div>
                    );
                  })()}
                </DashboardCard>

                {/* AI Insight */}
                <DashboardCard color= "var(--accent-violet)"  delay={360} className="relative overflow-hidden">
                  {/* Ambient glow */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at top right, rgba(var(--accent-cyan-rgb),0.1), transparent 65%)',
                    }}
                  />
                  <div
                    className="absolute top-0 right-0 pointer-events-none"
                    style={{
                      width: 100,
                      height: 100,
                      background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb),0.2) 0%, transparent 70%)',
                      filter: 'blur(14px)',
                      animation: 'dash-pulseGlow 3.5s infinite ease-in-out',
                      transform: 'translate(30%, -30%)',
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                          boxShadow: '0 0 16px rgba(var(--accent-violet-rgb),0.4)',
                        }}
                      >
                        <Brain size={18} color="white" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color:  'var(--accent-violet-bright)' ,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                          }}
                        >
                          AI COACH INSIGHT
                        </div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color:  'var(--text-dim)' ,
                            fontSize: '0.55rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            marginTop: 1,
                          }}
                        >
                          PERSONALIZED ANALYTICS
                        </div>
                      </div>
                    </div>

                    <p style={{ color:  'var(--text-secondary)' , lineHeight: 1.7, fontSize: '0.85rem', marginBottom: 20 }}>
                      Your push-up form score dropped 7 pts vs last week. Focus on keeping your core tight and hands shoulder-width apart.
                    </p>

                    <div
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        marginBottom: 20,
                        background: 'rgba(var(--accent-cyan-rgb),0.06)',
                        border: '1px solid rgba(var(--accent-cyan-rgb),0.12)',
                      }}
                    >
                      <div
                        className="flex items-center gap-2"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color:  'var(--accent-cyan)' ,
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          marginBottom: 8,
                        }}
                      >
                        <TrendingUp size={11} />
                        TODAY'S RECOMMENDATION
                      </div>
                      <div style={{ color:  'var(--text-primary)' , lineHeight: 1.55, fontSize: '0.82rem' }}>
                        Add 30g protein from dinner · 1,600 more steps to hit goal
                      </div>
                    </div>

                    <button
                      className="w-full btn-ghost text-xs font-bold tracking-widest transition-all active:scale-[0.97]"
                      style={{ borderRadius: 10, padding: '10px 16px' }}
                      onClick={() => onNavigate('coach')}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(var(--accent-cyan-rgb),0.08)';
                        e.currentTarget.style.borderColor = 'rgba(var(--accent-cyan-rgb),0.25)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      ASK AI COACH →
                    </button>
                  </div>
                </DashboardCard>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="flex flex-col" style={{ gap: 28 }}>

              {/* Today's Goals — Protein removed */}
              <DashboardCard color= "var(--accent-green)"  delay={320}>
                <SectionHeader title="TODAY'S GOALS" badge="· LIVE" />
                <div className="flex flex-col" style={{ gap: 22, marginTop: 18 }}>
                  {goals
                    .filter(g => g.label !== 'Protein Intake')
                    .map(g => (
                      <div key={g.id}>
                        <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color:  'var(--text-secondary)' ,
                              letterSpacing: '0.08em',
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {g.label.toUpperCase()}
                          </span>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              color:  'var(--text-primary)' ,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {g.current}
                            <span style={{ opacity: 0.45, fontSize: '0.65rem' }}>
                              {' '}/ {g.target} {g.unit.toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <ProgressBar value={g.current} max={g.target} color={g.color} height={8} />
                      </div>
                    ))}
                </div>
              </DashboardCard>

              {/* Quick Start */}
              <DashboardCard color= "var(--accent-violet-bright)"  delay={420}>
                <SectionHeader title="QUICK START" />
                <div className="flex flex-col" style={{ gap: 10, marginTop: 18 }}>
                  {[
                    { label: 'Start Workout', sub: 'AI form analysis', color:  'var(--accent-violet-bright)' , page: 'workout',  icon: Dumbbell },
                    { label: 'Log Meal',      sub: 'Photo analysis',   color:  'var(--accent-green)' , page: 'food',     icon: Camera },
                    { label: 'AI Coach',      sub: 'Get guidance',     color:  'var(--accent-cyan)' , page: 'coach',    icon: Bot },
                    { label: 'Log Progress',  sub: 'Steps & weight',   color:  'var(--accent-amber)' , page: 'progress', icon: BarChart2 },
                  ].map(item => (
                    <button
                      key={item.page}
                      onClick={() => onNavigate(item.page)}
                      className="flex items-center text-left group/action"
                      style={{
                        gap: 14,
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.015)',
                        border: '1px solid rgba(var(--accent-violet-rgb),0.08)',
                        width: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${window.themeColor(item.color, 0.4)}`;
                        e.currentTarget.style.background = `${window.themeColor(item.color, 0.08)}`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 8px 24px -6px ${window.themeColor(item.color, 0.25)}`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(var(--accent-violet-rgb),0.08)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 9,
                          background: `${window.themeColor(item.color, 0.1)}`,
                          border: `1px solid ${window.themeColor(item.color, 0.2)}`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <item.icon size={17} style={{ color: item.color }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-display font-bold"
                          style={{
                            color:  'var(--text-primary)' ,
                            fontSize: '0.78rem',
                            letterSpacing: '0.05em',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.label.toUpperCase()}
                        </div>
                        <div
                          style={{ color:  'var(--text-secondary)' , fontSize: '0.72rem', marginTop: 2 }}
                        >
                          {item.sub}
                        </div>
                      </div>

                      <ChevronRight
                        size={14}
                        style={{
                          color: item.color,
                          opacity: 0.45,
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          flexShrink: 0,
                        }}
                        className="group-hover/action:translate-x-0.5 group-hover/action:opacity-100"
                      />
                    </button>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}