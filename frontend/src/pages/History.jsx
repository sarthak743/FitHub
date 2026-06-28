import { useState } from 'react';
import { Clock, Zap, BarChart2, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { WorkoutTag, FormScore } from '../components/ui/index.jsx';
import { workoutHistory } from '../data/mockData.js';

function WorkoutCard({ workout, expanded, onToggle }) {
  return (
    <div
      className="rounded-lg overflow-hidden transition-cyber mb-3"
      style={{
        background: 'rgba(var(--bg-surface-rgb),0.8)',
        border: expanded ? '1px solid rgba(var(--accent-violet-rgb),0.3)' : '1px solid rgba(var(--accent-violet-rgb),0.12)',
        boxShadow: expanded ? '0 0 20px rgba(var(--accent-violet-rgb),0.08)' : 'none',
      }}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left"
        style={{ background: 'none', border: 'none' }}
      >
        {/* Form score visual */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded"
          style={{
            width: 48, height: 48,
            background: workout.formScore >= 90
              ? 'rgba(var(--accent-green-rgb),0.1)'
              : workout.formScore >= 75
              ? 'rgba(var(--accent-cyan-rgb),0.1)'
              : 'rgba(var(--accent-amber-rgb),0.1)',
            border: `1px solid ${
              workout.formScore >= 90 ? 'rgba(var(--accent-green-rgb),0.25)' : workout.formScore >= 75 ? 'rgba(var(--accent-cyan-rgb),0.25)' : 'rgba(var(--accent-amber-rgb),0.25)'
            }`,
          }}
        >
          <div className="font-display font-bold text-center" style={{
            color: workout.formScore >= 90 ?  'var(--accent-green)'  : workout.formScore >= 75 ?  'var(--accent-cyan)'  :  'var(--accent-amber)' ,
            fontSize: '1rem',
            lineHeight: 1,
          }}>
            {workout.formScore}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-display font-bold mb-1"
            style={{ color:  'var(--text-primary)' , fontSize: '0.82rem', letterSpacing: '0.05em' }}
          >
            {workout.name.toUpperCase()}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-code" style={{ color:  'var(--text-dim)' , fontSize: '0.6rem' }}>
              {workout.date}
            </span>
            <span style={{ color:  'var(--text-dim)'  }}>·</span>
            <span className="font-mono-code" style={{ color:  'var(--text-dim)' , fontSize: '0.6rem' }}>
              {workout.duration}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-5 mr-2">
          <div className="text-center">
            <div className="font-display font-semibold" style={{ color:  'var(--accent-violet-bright)' , fontSize: '0.9rem' }}>
              {workout.reps}
            </div>
            <div className="font-mono-code" style={{ color:  'var(--text-dim)' , fontSize: '0.55rem' }}>REPS</div>
          </div>
          <div className="text-center">
            <div className="font-display font-semibold" style={{ color:  'var(--accent-amber)' , fontSize: '0.9rem' }}>
              {workout.calories}
            </div>
            <div className="font-mono-code" style={{ color:  'var(--text-dim)' , fontSize: '0.55rem' }}>KCAL</div>
          </div>
        </div>

        {/* Tags */}
        <div className="hidden md:flex items-center gap-1.5 mr-2">
          {workout.tags.map(t => <WorkoutTag key={t} tag={t} />)}
        </div>

        {expanded
          ? <ChevronUp size={14} style={{ color:  'var(--text-secondary)' , flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color:  'var(--text-secondary)' , flexShrink: 0 }} />
        }
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4 animate-slide-up"
          style={{ borderTop: '1px solid rgba(var(--accent-violet-rgb),0.08)' }}
        >
          <div className="pt-4 grid grid-cols-2 gap-4 md:grid-cols-4">

            {/* Exercises */}
            <div className="col-span-2">
              <div className="font-mono-code mb-2" style={{ color:  'var(--text-dim)' , fontSize: '0.6rem' }}>
                EXERCISES PERFORMED
              </div>
              <div className="flex flex-col gap-1.5">
                {workout.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded px-3 py-2"
                    style={{ background: 'rgba(var(--accent-violet-rgb),0.06)', border: '1px solid rgba(var(--accent-violet-rgb),0.08)' }}
                  >
                    <div
                      className="rounded-full"
                      style={{ width: 4, height: 4, background:  'var(--accent-violet-bright)' , boxShadow: '0 0 4px #8b5cf6' }}
                    />
                    <span className="text-sm" style={{ color:  'var(--text-primary)'  }}>{ex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="col-span-2">
              <div className="font-mono-code mb-2" style={{ color:  'var(--text-dim)' , fontSize: '0.6rem' }}>
                SESSION STATS
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Duration', value: workout.duration, color:  'var(--accent-cyan)'  },
                  { label: 'Total Reps', value: workout.reps, color:  'var(--accent-violet-bright)'  },
                  { label: 'Calories', value: `${workout.calories} kcal`, color:  'var(--accent-amber)'  },
                  { label: 'Form Score', value: `${workout.formScore}/100`, color: workout.formScore >= 90 ?  'var(--accent-green)'  :  'var(--accent-cyan)'  },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded p-3"
                    style={{ background: 'rgba(var(--bg-surface-rgb),0.6)', border: '1px solid rgba(var(--accent-violet-rgb),0.08)' }}
                  >
                    <div className="font-mono-code" style={{ color:  'var(--text-dim)' , fontSize: '0.55rem' }}>
                      {stat.label.toUpperCase()}
                    </div>
                    <div className="font-display font-bold mt-0.5" style={{ color: stat.color, fontSize: '0.9rem' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI form feedback */}
          <div
            className="mt-4 rounded p-3"
            style={{
              background: 'linear-gradient(135deg, rgba(var(--accent-violet-rgb),0.06), rgba(var(--accent-cyan-rgb),0.04))',
              border: '1px solid rgba(var(--accent-violet-rgb),0.12)',
            }}
          >
            <div className="font-mono-code mb-1.5" style={{ color:  'var(--accent-violet-bright)' , fontSize: '0.58rem' }}>
              AI FORM ANALYSIS
            </div>
            <p className="text-xs" style={{ color: '#c4c8e8', lineHeight: 1.6 }}>
              {workout.formScore >= 90
                ? "Outstanding form throughout the session. Full range of motion and controlled tempo — keep this up."
                : workout.formScore >= 80
                ? "Good form overall. Minor deviation in the final set — likely fatigue-related. Consider dropping weight to maintain quality."
                : "Form needs attention in lower-body movements. Focus on knee alignment and hip hinge mechanics."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const tags = ['all', 'strength', 'cardio', 'hiit', 'legs', 'core'];
  const filtered = filter === 'all'
    ? workoutHistory
    : workoutHistory.filter(w => w.tags.includes(filter));

  const totalCalories = workoutHistory.reduce((s, w) => s + w.calories, 0);
  const totalReps = workoutHistory.reduce((s, w) => s + w.reps, 0);
  const avgForm = Math.round(workoutHistory.reduce((s, w) => s + w.formScore, 0) / workoutHistory.length);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <div className="px-7 py-7">

        <div className="mb-6">
          <div className="chip mb-2">· SESSION LOG</div>
          <h1 className="font-display font-bold mb-1" style={{ color:  'var(--text-primary)' , fontSize: '1.3rem', letterSpacing: '0.08em' }}>
            WORKOUT HISTORY
          </h1>
          <p className="text-sm" style={{ color:  'var(--text-secondary)'  }}>
            Completed sessions · form scores · progress over time
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Sessions', value: workoutHistory.length, color:  'var(--accent-violet-bright)' , unit: '' },
            { label: 'Total Reps', value: totalReps.toLocaleString(), color:  'var(--accent-cyan)' , unit: '' },
            { label: 'Calories Burned', value: totalCalories.toLocaleString(), color:  'var(--accent-amber)' , unit: 'kcal' },
            { label: 'Avg Form Score', value: avgForm, color:  'var(--accent-green)' , unit: '/100' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-lg p-4"
              style={{
                background: 'rgba(var(--bg-surface-rgb),0.8)',
                border: `1px solid ${window.themeColor(stat.color, 0.2)}`,
              }}
            >
              <div className="font-mono-code mb-1" style={{ color:  'var(--text-dim)' , fontSize: '0.58rem' }}>
                {stat.label.toUpperCase()}
              </div>
              <div className="flex items-baseline gap-1">
                <div className="font-display font-bold" style={{ color: stat.color, fontSize: '1.4rem' }}>
                  {stat.value}
                </div>
                {stat.unit && (
                  <div className="font-mono-code" style={{ color: stat.color, fontSize: '0.62rem' }}>
                    {stat.unit}
                  </div>
                )}
              </div>
              <div
                className="mt-2 rounded-full"
                style={{ height: 3, background: `${window.themeColor(stat.color, 0.15)}` }}
              >
                <div
                  className="rounded-full h-full"
                  style={{ width: '70%', background: stat.color, opacity: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className="rounded px-3 py-1.5 text-xs transition-cyber"
              style={filter === tag ? {
                background: 'rgba(var(--accent-violet-rgb),0.2)',
                border: '1px solid rgba(var(--accent-violet-rgb),0.4)',
                color:  'var(--text-primary)' ,
                fontFamily: 'Orbitron',
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
              } : {
                background: 'rgba(var(--accent-violet-rgb),0.05)',
                border: '1px solid rgba(var(--accent-violet-rgb),0.1)',
                color:  'var(--text-secondary)' ,
                fontFamily: 'Inter',
              }}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Workout list */}
        <div className="pb-4">
          {filtered.length === 0 ? (
            <div
              className="rounded-lg p-10 text-center"
              style={{ border: '1px dashed rgba(var(--accent-violet-rgb),0.15)' }}
            >
              <div className="font-display font-bold mb-1" style={{ color:  'var(--text-dim)' , fontSize: '0.8rem' }}>
                NO SESSIONS FOUND
              </div>
              <p className="text-sm" style={{ color:  'var(--text-dim)'  }}>
                No workouts match this filter yet.
              </p>
            </div>
          ) : (
            filtered.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                expanded={expandedId === workout.id}
                onToggle={() => setExpandedId(expandedId === workout.id ? null : workout.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
