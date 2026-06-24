import { useState, useEffect, useRef } from 'react';
import {
  Flame, Zap, TrendingUp, Activity, Target, ChevronRight, Brain, 
  Dumbbell, Camera, Bot, BarChart2, CheckCircle2, Trophy, ArrowUpRight, ArrowDownRight,
  Footprints
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { StatCard, ProgressBar, SectionHeader, WorkoutTag } from '../components/ui/index.jsx';
import {
  progressData, workoutHistory, goals, user, weeklyStreak
} from '../data/mockData.js';

/* ─────────────────────────────────────────────
   ANIMATED PROGRESS RING (polished + glow)
───────────────────────────────────────────── */
function AnimatedProgressRing({ percent, size = 96, stroke = 7, color, label }) {
  const [offset, setOffset] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const finalOffset = circumference - (Math.min(percent, 100) / 100) * circumference;

  useEffect(() => {
    // start from 0, then animate to final offset
    const timer = setTimeout(() => setOffset(finalOffset), 100);
    return () => clearTimeout(timer);
  }, [finalOffset]);

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className="relative transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(124,58,237,0.12)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.25, 0.8, 0.25, 1.2)',
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-mono-code font-bold"
          style={{
            color: '#e8eaff',
            fontSize: '0.9rem',
            textShadow: `0 0 8px ${color}40`,
          }}
        >
          {`${Math.round(percent)}%`}
        </div>
      </div>
      <span
        className="text-xs font-mono-code tracking-widest transition-colors duration-300 group-hover:text-[#8b5cf6]"
        style={{ color: '#4a4f72', fontWeight: 700 }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEURAL BACKGROUND
───────────────────────────────────────────── */
function NeuralBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.4 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(124,58,237,0.3)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STREAK CALENDAR (with subtle hover polish)
───────────────────────────────────────────── */
function StreakCalendar() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const done = [true, true, true, true, false, false, false];
  return (
    <div className="flex items-center gap-2">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 group">
          <div
            className="rounded-md flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{
              width: 32,
              height: 32,
              background: done[i]
                ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                : 'rgba(124, 58, 237, 0.06)',
              border: done[i]
                ? '1px solid rgba(139, 92, 246, 0.4)'
                : '1px solid rgba(124, 58, 237, 0.12)',
              boxShadow: done[i] ? '0 0 12px rgba(124, 58, 237, 0.3)' : 'none',
            }}
          >
            {done[i] && (
              <CheckCircle2 size={14} color="white" strokeWidth={2.5} />
            )}
          </div>
          <span
            className="font-mono-code transition-colors duration-300 group-hover:text-[#8b5cf6]"
            style={{ color: '#4a4f72', fontSize: '0.6rem', fontWeight: 600 }}
          >
            {d}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHART CUSTOM TOOLTIP (bug‑safe)
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const safeLabel = String(label || '').toUpperCase();
    const safeValue = Number(payload[0]?.value ?? 0).toLocaleString();

    return (
      <div
        className="rounded-lg px-4 py-2.5 animate-in fade-in zoom-in duration-300"
        style={{
          background: 'rgba(13,15,26,0.95)',
          border: '1px solid rgba(124,58,237,0.25)',
          fontSize: '0.75rem',
          fontFamily: 'JetBrains Mono',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(124,58,237,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ color: '#8b90b8', marginBottom: 4, letterSpacing: '0.05em' }}>{safeLabel}</div>
        <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Footprints size={14} />
          {safeValue}
        </div>
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────
   REUSABLE DASHBOARD CARD (polished depth)
───────────────────────────────────────────── */
function DashboardCard({ children, color = '#8b5cf6', style = {}, className = "", delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-xl overflow-hidden transition-all duration-500 ease-out ${className} ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        background: 'rgba(13,15,26,0.8)',
        border: `1px solid ${hovered ? color + '55' : 'rgba(124,58,237,0.12)'}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 24px 48px -12px ${color}25, inset 0 0 24px ${color}06`
          : '0 8px 16px rgba(0,0,0,0.3)',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        ...style,
      }}
    >
      {/* top accent bar */}
      <div
        style={{
          height: 3,
          background: color,
          opacity: hovered ? 1 : 0.7,
          transition: 'all 0.5s ease',
          boxShadow: hovered ? `0 0 15px ${color}, 0 0 5px ${color}` : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {hovered && (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}
      </div>
      <div style={{ padding: '32px' }}>{children}</div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD EXPORT (polished layout & animations)
───────────────────────────────────────────── */
export default function Dashboard({ onNavigate }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = progressData.today;

  return (
    <div className="relative page-shell">
      <NeuralBackground />
      <div
        className={`relative transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 1 }}
      >
        {/* ── Hero Strip ── */}
        <div
          className="relative overflow-hidden mb-10"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))',
            borderBottom: '1px solid rgba(124,58,237,0.12)',
            padding: '48px 40px 40px',
          }}
        >
          <div
            className="absolute right-0 top-0 w-96 h-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at right, rgba(6,182,212,0.12), transparent 70%)',
            }}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div
              className={`transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="chip flex items-center gap-2 py-2 px-4 group cursor-default"
                  style={{
                    fontSize: '0.8rem',
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}
                >
                  <Flame
                    size={16}
                    className="text-orange-500 transition-transform duration-500 group-hover:scale-125"
                  />
                  <span className="font-bold tracking-wider">{user.streak}-DAY STREAK</span>
                </div>
              </div>
              <h1
                className="font-display font-bold mb-3"
                style={{
                  color: '#e8eaff',
                  fontSize: '2.4rem',
                  letterSpacing: '0.02em',
                  lineHeight: 1.15,
                }}
              >
                GOOD MORNING,{' '}
                <span className="gradient-text-violet">
                  {user.name?.split(' ')[0]?.toUpperCase() || ''}
                </span>
              </h1>
              <p
                className="text-lg"
                style={{ color: '#8b90b8', maxWidth: '500px', fontWeight: 400 }}
              >
                4 days ahead of your weekly target. Keep the momentum going.
              </p>
            </div>

            {/* animated progress rings */}
            <div
              className={`flex items-center gap-10 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              <div className="flex gap-8">
                <AnimatedProgressRing
                  percent={(today.steps / today.stepsGoal) * 100}
                  size={96}
                  stroke={8}
                  color="#06b6d4"
                  label="STEPS"
                />
                <AnimatedProgressRing
                  percent={(today.protein / today.proteinGoal) * 100}
                  size={96}
                  stroke={8}
                  color="#8b5cf6"
                  label="PROTEIN"
                />
                <AnimatedProgressRing
                  percent={(today.calories / today.caloriesGoal) * 100}
                  size={96}
                  stroke={8}
                  color="#10b981"
                  label="CALORIES"
                />
              </div>
            </div>
          </div>
          <div
            className={`mt-12 transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <StreakCalendar />
          </div>
        </div>

        {/* ── Page content ── */}
        <div className="page-inner dashboard-content px-10">
          {/* stat cards row with staggered entrance */}
          <div
            className="grid gap-6 mb-12"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.7s ease 0.2s',
            }}
          >
            <StatCard
              label="Today's Steps"
              value={today.steps.toLocaleString()}
              unit="steps"
              sublabel={`Goal: ${today.stepsGoal.toLocaleString()}`}
              color="cyan"
              icon={Activity}
              trend={{ positive: true, value: '+1.2k vs yesterday' }}
            />
            <StatCard
              label="Calories In"
              value={today.calories}
              unit="kcal"
              sublabel={`Target: ${today.caloriesGoal}`}
              color="green"
              icon={Zap}
              trend={{ positive: false, value: '-180 from target' }}
            />
            <StatCard
              label="Protein"
              value={today.protein}
              unit="g"
              sublabel={`Goal: ${today.proteinGoal}g`}
              color="violet"
              icon={Target}
            />
            <StatCard
              label="Weekly Workouts"
              value="3"
              unit="/ 5"
              sublabel="2 more to hit target"
              color="amber"
              icon={Trophy}
              trend={{ positive: true, value: 'On track' }}
            />
          </div>

          {/* main grid */}
          <div
            className="dashboard-main-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '40px',
            }}
          >
            {/* left column */}
            <div className="flex flex-col gap-10">
              {/* Step Activity Chart */}
              <DashboardCard color="#06b6d4" delay={200}>
                <SectionHeader
                  title="STEP ACTIVITY"
                  subtitle="Last 7 days"
                  badge="· TRACKING"
                  action={{
                    label: 'View Progress →',
                    onClick: () => onNavigate('progress'),
                  }}
                />
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={progressData.steps}>
                      <defs>
                        <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#06b6d4"
                        fill="url(#stepGrad)"
                        strokeWidth={4}
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'rgba(6,182,212,0.3)', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Recent Workout + AI Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Last Workout */}
                <DashboardCard color="#8b5cf6" delay={250}>
                  <SectionHeader title="LAST WORKOUT" badge="· COMPLETED" />
                  {(() => {
                    const w = workoutHistory[0];
                    return (
                      <div className="mt-6">
                        <div
                          className="font-display font-bold mb-4"
                          style={{
                            color: '#e8eaff',
                            fontSize: '1.25rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {w.name.toUpperCase()}
                        </div>
                        <div className="flex gap-2.5 mb-5 flex-wrap">
                          {w.tags.map(t => (
                            <WorkoutTag key={t} tag={t} />
                          ))}
                        </div>
                        <div
                          className="grid grid-cols-2 gap-5 mb-8 p-5 rounded-2xl transition-all duration-300 hover:bg-[rgba(124,58,237,0.1)]"
                          style={{
                            background: 'rgba(124,58,237,0.06)',
                            border: '1px solid rgba(124,58,237,0.1)',
                          }}
                        >
                          {[
                            { label: 'Duration', value: w.duration },
                            { label: 'Reps', value: w.reps },
                            { label: 'Calories', value: `${w.calories} kcal` },
                            { label: 'Form Score', value: `${w.formScore}/100` },
                          ].map(stat => (
                            <div key={stat.label} className="group/stat">
                              <div
                                className="font-mono-code mb-1.5 transition-colors group-hover/stat:text-[#8b5cf6]"
                                style={{
                                  color: '#4a4f72',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                }}
                              >
                                {stat.label.toUpperCase()}
                              </div>
                              <div
                                className="font-display font-semibold transition-transform group-hover/stat:translate-x-1"
                                style={{ color: '#e8eaff', fontSize: '1.1rem' }}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          className="w-full btn-ghost rounded-xl px-4 py-3 text-sm font-bold tracking-widest transition-all duration-300 hover:bg-[rgba(124,58,237,0.1)] active:scale-95"
                          onClick={() => onNavigate('history')}
                        >
                          VIEW HISTORY →
                        </button>
                      </div>
                    );
                  })()}
                </DashboardCard>

                {/* AI Insight Card (with pulsing glow) */}
                <DashboardCard color="#7c3aed" delay={350} className="relative overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at top right, rgba(6,182,212,0.15), transparent 70%)',
                    }}
                  />
                  {/* subtle pulsing glow orb */}
                  <div
                    className="absolute top-0 right-0 pointer-events-none"
                    style={{
                      width: 120,
                      height: 120,
                      background:
                        'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
                      filter: 'blur(10px)',
                      animation: 'pulseGlow 3s infinite ease-in-out',
                      transform: 'translate(30%, -30%)',
                    }}
                  />
                  <style>{`
                    @keyframes pulseGlow {
                      0% { opacity: 0.6; transform: translate(30%, -30%) scale(1); }
                      50% { opacity: 0.9; transform: translate(30%, -30%) scale(1.1); }
                      100% { opacity: 0.6; transform: translate(30%, -30%) scale(1); }
                    }
                  `}</style>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="flex items-center justify-center rounded-xl transition-transform duration-500 hover:rotate-12"
                        style={{
                          width: 44,
                          height: 44,
                          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                          boxShadow: '0 0 20px rgba(124,58,237,0.5)',
                        }}
                      >
                        <Brain size={22} color="white" />
                      </div>
                      <div>
                        <div
                          className="font-mono-code"
                          style={{
                            color: '#8b5cf6',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                          }}
                        >
                          AI COACH INSIGHT
                        </div>
                        <div
                          style={{
                            color: '#4a4f72',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                          }}
                        >
                          PERSONALIZED ANALYTICS
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-lg mb-8"
                      style={{
                        color: '#c4c8e8',
                        lineHeight: 1.7,
                        fontSize: '0.95rem',
                      }}
                    >
                      Your push-up form score dropped 7pts vs last week. Focus on
                      keeping your core tight and hands shoulder-width apart.
                    </p>
                    <div
                      className="p-5 rounded-2xl mb-8 group/rec transition-all duration-300 hover:border-[rgba(6,182,212,0.4)]"
                      style={{
                        background: 'rgba(6,182,212,0.08)',
                        border: '1px solid rgba(6,182,212,0.15)',
                      }}
                    >
                      <div
                        className="font-mono-code mb-3 flex items-center gap-2 transition-colors group-hover/rec:text-[#06b6d4]"
                        style={{
                          color: '#06b6d4',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        <TrendingUp size={14} />
                        TODAY'S RECOMMENDATION
                      </div>
                      <div
                        className="text-base"
                        style={{ color: '#e8eaff', lineHeight: 1.5 }}
                      >
                        Add 30g protein from dinner · 1,600 more steps to hit goal
                      </div>
                    </div>
                    <button
                      className="w-full btn-ghost rounded-xl px-4 py-3 text-sm font-bold tracking-widest transition-all duration-300 hover:bg-[rgba(6,182,212,0.1)] active:scale-95"
                      onClick={() => onNavigate('coach')}
                    >
                      ASK AI COACH →
                    </button>
                  </div>
                </DashboardCard>
              </div>
            </div>

            {/* right column */}
            <div className="flex flex-col gap-10">
              {/* Today's Goals */}
              <DashboardCard color="#10b981" delay={400}>
                <SectionHeader title="TODAY'S GOALS" badge="· LIVE" />
                <div className="flex flex-col gap-6 mt-6">
                  {goals.map(g => (
                    <div key={g.id} className="group/goal">
                      <div className="flex justify-between items-center mb-2.5">
                        <span
                          className="text-sm font-bold transition-colors group-hover/goal:text-[#e8eaff]"
                          style={{ color: '#8b90b8' }}
                        >
                          {g.label.toUpperCase()}
                        </span>
                        <span
                          className="font-mono-code"
                          style={{
                            color: '#e8eaff',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}
                        >
                          {g.current} / {g.target}{' '}
                          <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>
                            {g.unit.toUpperCase()}
                          </span>
                        </span>
                      </div>
                      <ProgressBar
                        value={g.current}
                        max={g.target}
                        color={g.color}
                        height={8}
                      />
                    </div>
                  ))}
                </div>
              </DashboardCard>

              {/* Quick Actions */}
              <DashboardCard color="#8b5cf6" delay={500}>
                <SectionHeader title="QUICK START" />
                <div className="flex flex-col gap-4 mt-6">
                  {[
                    {
                      label: 'Start Workout',
                      sub: 'AI form analysis',
                      color: '#8b5cf6',
                      page: 'workout',
                      icon: Dumbbell,
                    },
                    {
                      label: 'Log Meal',
                      sub: 'Photo analysis',
                      color: '#10b981',
                      page: 'food',
                      icon: Camera,
                    },
                    {
                      label: 'Chat with Coach',
                      sub: 'Get guidance',
                      color: '#06b6d4',
                      page: 'coach',
                      icon: Bot,
                    },
                    {
                      label: 'Log Progress',
                      sub: 'Steps & weight',
                      color: '#f59e0b',
                      page: 'progress',
                      icon: BarChart2,
                    },
                  ].map(item => (
                    <button
                      key={item.page}
                      onClick={() => onNavigate(item.page)}
                      className="group/action flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden relative"
                      style={{
                        background: 'rgba(124,58,237,0.05)',
                        border: '1px solid rgba(124,58,237,0.12)',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${item.color}66`;
                        e.currentTarget.style.background = `${item.color}15`;
                        e.currentTarget.style.transform = 'translateX(8px)';
                        e.currentTarget.style.boxShadow = `0 12px 24px -8px ${item.color}30`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor =
                          'rgba(124,58,237,0.12)';
                        e.currentTarget.style.background =
                          'rgba(124,58,237,0.05)';
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-xl transition-all duration-500 group-hover/action:scale-110 group-hover/action:rotate-6"
                        style={{
                          width: 44,
                          height: 44,
                          background: `${item.color}20`,
                          border: `1px solid ${item.color}40`,
                          boxShadow: `0 0 15px ${item.color}10`,
                        }}
                      >
                        <item.icon size={20} style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div
                          className="font-display font-bold transition-colors group-hover/action:text-[#e8eaff]"
                          style={{
                            color: '#e8eaff',
                            fontSize: '0.95rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {item.label.toUpperCase()}
                        </div>
                        <div
                          className="text-xs font-medium transition-colors group-hover/action:text-[#8b90b8]"
                          style={{
                            color: '#8b90b8',
                            fontSize: '0.8rem',
                            marginTop: 3,
                          }}
                        >
                          {item.sub}
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="transition-all duration-500 group-hover/action:translate-x-1"
                        style={{ color: item.color, opacity: 0.8 }}
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