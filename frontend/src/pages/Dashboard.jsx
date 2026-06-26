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
   NEURAL BACKGROUND
───────────────────────────────────────────── */
function NeuralBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.35 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(124,58,237,0.35)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED PROGRESS RING
   — animates from 0% on mount with smooth spring easing
───────────────────────────────────────────── */
function AnimatedProgressRing({ percent, size = 108, stroke = 8, color, label, delay = 0 }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const finalOffset = circumference - (Math.min(percent, 100) / 100) * circumference;
  const [offset, setOffset] = useState(circumference); // starts at 0% fill

  useEffect(() => {
    const t = setTimeout(() => setOffset(finalOffset), 120 + delay);
    return () => clearTimeout(t);
  }, [finalOffset, delay]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(124,58,237,0.1)"
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
              transition: `stroke-dashoffset 1.5s cubic-bezier(0.34, 1.2, 0.64, 1) ${delay}ms`,
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* Center label */}
        <div
          className="absolute inset-0 flex items-center justify-center font-mono font-bold"
          style={{ color: '#e8eaff', fontSize: '0.92rem' }}
        >
          {`${Math.round(percent)}%`}
        </div>
      </div>
      <span
        className="font-mono font-bold tracking-widest"
        style={{ color: '#4a4f72', fontSize: '0.62rem' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STREAK CALENDAR
───────────────────────────────────────────── */
function StreakCalendar() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const done = [true, true, true, true, false, false, false];
  return (
    <div className="flex items-center gap-2.5">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: 34,
              height: 34,
              background: done[i]
                ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                : 'rgba(124,58,237,0.06)',
              border: done[i]
                ? '1px solid rgba(139,92,246,0.4)'
                : '1px solid rgba(124,58,237,0.1)',
              boxShadow: done[i] ? '0 0 10px rgba(124,58,237,0.28)' : 'none',
            }}
          >
            {done[i] && <CheckCircle2 size={13} color="white" strokeWidth={2.5} />}
          </div>
          <span
            className="font-mono"
            style={{ color: done[i] ? '#6d5fd6' : '#3d4168', fontSize: '0.62rem', fontWeight: 700 }}
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
      className="rounded-xl px-4 py-2.5"
      style={{
        background: 'rgba(11,13,22,0.97)',
        border: '1px solid rgba(124,58,237,0.22)',
        fontSize: '0.72rem',
        fontFamily: 'JetBrains Mono, monospace',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ color: '#6e748f', marginBottom: 4, letterSpacing: '0.06em' }}>
        {String(label || '').toUpperCase()}
      </div>
      <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Footprints size={13} />
        {Number(payload[0]?.value ?? 0).toLocaleString()}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DASHBOARD CARD
───────────────────────────────────────────── */
function DashboardCard({ children, color = '#8b5cf6', style = {}, className = '', delay = 0 }) {
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
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(13,15,26,0.85)',
        border: `1px solid ${hovered ? color + '45' : 'rgba(124,58,237,0.1)'}`,
        transform: `translateY(${hovered ? '-3px' : mounted ? '0' : '14px'})`,
        opacity: mounted ? 1 : 0,
        boxShadow: hovered
          ? `0 20px 40px -12px ${color}20, inset 0 0 20px ${color}05`
          : '0 4px 16px rgba(0,0,0,0.25)',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        ...style,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          height: 2,
          background: color,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.4s ease',
          boxShadow: hovered ? `0 0 10px ${color}` : 'none',
        }}
      />
      <div style={{ padding: '30px 32px' }}>{children}</div>
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

  /* Workout progress: 3 of 5 = 60% */
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
          className="relative overflow-hidden mb-10"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
            borderBottom: '1px solid rgba(124,58,237,0.1)',
            padding: '52px 44px 44px',
          }}
        >
          <div
            className="absolute right-0 top-0 w-96 h-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at right, rgba(6,182,212,0.1), transparent 70%)',
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
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg"
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(239,115,22,0.1)',
                    border: '1px solid rgba(239,115,22,0.2)',
                  }}
                >
                  <Flame size={14} style={{ color: '#f97316' }} />
                  <span
                    className="font-mono font-bold"
                    style={{ color: '#fb923c', letterSpacing: '0.1em' }}
                  >
                    {user.streak}-DAY STREAK
                  </span>
                </div>
              </div>

              <h1
                className="font-display font-bold mb-3"
                style={{
                  color: '#e8eaff',
                  fontSize: '2.4rem',
                  letterSpacing: '0.02em',
                  lineHeight: 1.12,
                }}
              >
                GOOD MORNING,{' '}
                <span className="gradient-text-violet">
                  {user.name?.split(' ')[0]?.toUpperCase() || ''}
                </span>
              </h1>
              <p style={{ color: '#6e748f', maxWidth: '480px', fontWeight: 400, fontSize: '0.95rem', lineHeight: 1.65 }}>
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
              <div className="flex gap-10 items-center">
                <AnimatedProgressRing
                  percent={(today.steps / today.stepsGoal) * 100}
                  size={108} stroke={8}
                  color="#06b6d4"
                  label="STEPS"
                  delay={0}
                />
                <AnimatedProgressRing
                  percent={workoutPercent}
                  size={108} stroke={8}
                  color="#8b5cf6"
                  label="WORKOUTS"
                  delay={120}
                />
                <AnimatedProgressRing
                  percent={(today.calories / today.caloriesGoal) * 100}
                  size={108} stroke={8}
                  color="#10b981"
                  label="CALORIES"
                  delay={240}
                />
              </div>
            </div>
          </div>

          {/* Streak calendar */}
          <div
            className="mt-10"
            style={{
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
        <div className="page-inner dashboard-content px-10 py-10">

          {/* Stat cards row */}
          <div
            className="grid gap-6 mb-12"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}
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
                delay: 150,
              },
              {
                label: 'Weekly Workouts',
                value: '3',
                unit: '/ 5',
                sublabel: '2 more to hit target',
                color: 'violet',
                icon: Trophy,
                trend: { positive: true, value: 'On track' },
                delay: 200,
              },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                  transition: `all 0.55s cubic-bezier(0.23,1,0.32,1) ${stat.delay}ms`,
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
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}
          >
            {/* ── Left column ── */}
            <div className="flex flex-col gap-8">

              {/* Step Activity — histogram bar chart */}
              <DashboardCard color="#06b6d4" delay={200}>
                <SectionHeader
                  title="STEP ACTIVITY"
                  subtitle="Last 7 days"
                  badge="· TRACKING"
                  action={{ label: 'View Progress →', onClick: () => onNavigate('progress') }}
                />
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={248}>
                    <BarChart
                      data={progressData.steps}
                      margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.03)"
                        vertical={false}
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#3d4168', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#3d4168', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(6,182,212,0.04)', radius: 4 }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[5, 5, 0, 0]}
                        maxBarSize={44}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {progressData.steps.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.value >= today.stepsGoal ? '#06b6d4' : '#1e4a5c'}
                            fillOpacity={0.9}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Last Workout + AI Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Last Workout */}
                <DashboardCard color="#8b5cf6" delay={250}>
                  <SectionHeader title="LAST WORKOUT" badge="· COMPLETED" />
                  {(() => {
                    const w = workoutHistory[0];
                    return (
                      <div className="mt-5">
                        <div
                          className="font-display font-bold mb-4"
                          style={{ color: '#e8eaff', fontSize: '1.15rem', letterSpacing: '0.06em' }}
                        >
                          {w.name.toUpperCase()}
                        </div>
                        <div className="flex gap-2 mb-5 flex-wrap">
                          {w.tags.map(t => <WorkoutTag key={t} tag={t} />)}
                        </div>
                        <div
                          className="grid grid-cols-2 gap-5 mb-6 p-5 rounded-xl"
                          style={{
                            background: 'rgba(124,58,237,0.06)',
                            border: '1px solid rgba(124,58,237,0.1)',
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
                                className="font-mono mb-1.5"
                                style={{ color: '#3d4168', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}
                              >
                                {stat.label.toUpperCase()}
                              </div>
                              <div
                                className="font-display font-semibold"
                                style={{ color: '#e8eaff', fontSize: '1.05rem' }}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          className="w-full btn-ghost rounded-xl px-4 py-2.5 text-xs font-bold tracking-widest transition-all hover:bg-[rgba(124,58,237,0.1)] active:scale-95"
                          onClick={() => onNavigate('history')}
                        >
                          VIEW HISTORY →
                        </button>
                      </div>
                    );
                  })()}
                </DashboardCard>

                {/* AI Insight */}
                <DashboardCard color="#7c3aed" delay={350} className="relative overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at top right, rgba(6,182,212,0.12), transparent 65%)',
                    }}
                  />
                  <div
                    className="absolute top-0 right-0 pointer-events-none"
                    style={{
                      width: 110,
                      height: 110,
                      background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
                      filter: 'blur(12px)',
                      animation: 'pulseGlow 3s infinite ease-in-out',
                      transform: 'translate(30%, -30%)',
                    }}
                  />
                  <style>{`
                    @keyframes pulseGlow {
                      0%,100% { opacity:0.55; transform:translate(30%,-30%) scale(1); }
                      50%      { opacity:0.85; transform:translate(30%,-30%) scale(1.12); }
                    }
                  `}</style>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="flex items-center justify-center rounded-xl"
                        style={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                          boxShadow: '0 0 18px rgba(124,58,237,0.45)',
                        }}
                      >
                        <Brain size={19} color="white" />
                      </div>
                      <div>
                        <div
                          className="font-mono"
                          style={{ color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em' }}
                        >
                          AI COACH INSIGHT
                        </div>
                        <div style={{ color: '#3d4168', fontFamily: 'JetBrains Mono', fontSize: '0.58rem', fontWeight: 700 }}>
                          PERSONALIZED ANALYTICS
                        </div>
                      </div>
                    </div>

                    <p style={{ color: '#b0b5d8', lineHeight: 1.65, fontSize: '0.88rem', marginBottom: '24px' }}>
                      Your push-up form score dropped 7 pts vs last week. Focus on keeping your core tight and hands shoulder-width apart.
                    </p>

                    <div
                      className="p-4 rounded-xl mb-6"
                      style={{
                        background: 'rgba(6,182,212,0.07)',
                        border: '1px solid rgba(6,182,212,0.15)',
                      }}
                    >
                      <div
                        className="font-mono mb-2 flex items-center gap-2"
                        style={{ color: '#06b6d4', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em' }}
                      >
                        <TrendingUp size={12} />
                        TODAY'S RECOMMENDATION
                      </div>
                      <div style={{ color: '#e8eaff', lineHeight: 1.55, fontSize: '0.85rem' }}>
                        Add 30g protein from dinner · 1,600 more steps to hit goal
                      </div>
                    </div>

                    <button
                      className="w-full btn-ghost rounded-xl px-4 py-2.5 text-xs font-bold tracking-widest transition-all hover:bg-[rgba(6,182,212,0.1)] active:scale-95"
                      onClick={() => onNavigate('coach')}
                    >
                      ASK AI COACH →
                    </button>
                  </div>
                </DashboardCard>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="flex flex-col gap-8">

              {/* Today's Goals — Protein removed */}
              <DashboardCard color="#10b981" delay={400}>
                <SectionHeader title="TODAY'S GOALS" badge="· LIVE" />
                <div className="flex flex-col gap-6 mt-5">
                  {goals
                    .filter(g => g.label !== 'Protein Intake')
                    .map(g => (
                      <div key={g.id}>
                        <div className="flex justify-between items-center mb-2.5">
                          <span
                            className="text-xs font-bold"
                            style={{ color: '#6e748f', letterSpacing: '0.08em' }}
                          >
                            {g.label.toUpperCase()}
                          </span>
                          <span
                            className="font-mono"
                            style={{ color: '#e8eaff', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            {g.current}
                            <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>
                              {' '}/ {g.target} {g.unit.toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <ProgressBar value={g.current} max={g.target} color={g.color} height={9} />
                      </div>
                    ))}
                </div>
              </DashboardCard>

              {/* Quick Start */}
              <DashboardCard color="#8b5cf6" delay={500}>
                <SectionHeader title="QUICK START" />
                <div className="flex flex-col gap-3 mt-5">
                  {[
                    { label: 'Start Workout', sub: 'AI form analysis', color: '#8b5cf6', page: 'workout',  icon: Dumbbell },
                    { label: 'Log Meal',      sub: 'Photo analysis',   color: '#10b981', page: 'food',     icon: Camera },
                    { label: 'AI Coach',      sub: 'Get guidance',     color: '#06b6d4', page: 'coach',    icon: Bot },
                    { label: 'Log Progress',  sub: 'Steps & weight',   color: '#f59e0b', page: 'progress', icon: BarChart2 },
                  ].map(item => (
                    <button
                      key={item.page}
                      onClick={() => onNavigate(item.page)}
                      className="flex items-center gap-4 rounded-xl text-left group/action"
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(124,58,237,0.1)',
                        width: '100%',
                        minHeight: 68,
                        cursor: 'pointer',
                        transition: 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${item.color}55`;
                        e.currentTarget.style.background = `${item.color}09`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 12px 28px -6px ${item.color}30`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.1)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center rounded-xl shrink-0"
                        style={{
                          width: 42,
                          height: 42,
                          background: `${item.color}13`,
                          border: `1px solid ${item.color}2c`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <item.icon size={18} style={{ color: item.color }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-display font-bold"
                          style={{
                            color: '#e8eaff',
                            fontSize: '0.82rem',
                            letterSpacing: '0.06em',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.label.toUpperCase()}
                        </div>
                        <div
                          style={{ color: '#6e748f', fontSize: '0.76rem', marginTop: 3 }}
                        >
                          {item.sub}
                        </div>
                      </div>

                      <ChevronRight
                        size={15}
                        style={{ color: item.color, opacity: 0.55, transition: 'transform 0.3s ease, opacity 0.3s ease', flexShrink: 0 }}
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