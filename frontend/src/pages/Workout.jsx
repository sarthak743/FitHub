import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle2, Zap, X, Plus } from 'lucide-react';
import { SectionHeader, FormScore } from '../components/ui/index.jsx';
import { exercises } from '../data/mockData.js';

function ExerciseCard({ exercise, onSelect, selected }) {
  const diffColor = {
    Beginner: '#10b981',
    Intermediate: '#f59e0b',
    Advanced: '#ec4899',
  }[exercise.difficulty];

  return (
    <button
      onClick={() => onSelect(exercise)}
      className="rounded-lg p-4 text-left transition-cyber w-full"
      style={{
        background: selected ? 'rgba(124,58,237,0.12)' : 'rgba(13,15,26,0.8)',
        border: selected
          ? '1px solid rgba(139,92,246,0.4)'
          : '1px solid rgba(124,58,237,0.12)',
        boxShadow: selected ? '0 0 16px rgba(124,58,237,0.15)' : 'none',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="font-display font-bold"
          style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.05em' }}
        >
          {exercise.name.toUpperCase()}
        </div>
        <span
          className="text-xs rounded px-1.5 py-0.5"
          style={{
            background: `${diffColor}15`,
            border: `1px solid ${diffColor}30`,
            color: diffColor,
            fontFamily: 'JetBrains Mono',
            fontSize: '0.58rem',
          }}
        >
          {exercise.difficulty.toUpperCase()}
        </span>
      </div>
      <div className="text-xs mb-3" style={{ color: '#8b90b8' }}>{exercise.muscle}</div>
      <div className="flex items-center gap-3">
        <div>
          <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.55rem' }}>SETS</div>
          <div className="font-display font-bold" style={{ color: '#8b5cf6', fontSize: '0.9rem' }}>{exercise.sets}</div>
        </div>
        <div>
          <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.55rem' }}>
            {exercise.unit === 'sec' ? 'SECONDS' : 'REPS'}
          </div>
          <div className="font-display font-bold" style={{ color: '#8b5cf6', fontSize: '0.9rem' }}>
            {exercise.targetReps}
          </div>
        </div>
      </div>
    </button>
  );
}

function RepCounter({ exercise, onComplete }) {
  const [reps, setReps] = useState(0);
  const [set, setSet] = useState(1);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [restMode, setRestMode] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [done, setDone] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);
  const intervalRef = useRef(null);
  const restRef = useRef(null);

  const feedbacks = [
    '✓ Form looks solid — keep your core tight',
    '⚠ Elbow flare detected — tuck them in',
    '✓ Good rep depth. Full range of motion.',
    '⚠ Control the descent — slow it down',
    '✓ Perfect tempo. Well done.',
  ];

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (restMode) {
      restRef.current = setInterval(() => {
        setRestSeconds(s => {
          if (s <= 1) {
            clearInterval(restRef.current);
            setRestMode(false);
            setRestSeconds(60);
            return 60;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restRef.current);
  }, [restMode]);

  const addRep = () => {
    const newReps = reps + 1;
    setReps(newReps);
    if (newReps % 3 === 0) {
      setFormFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
      setTimeout(() => setFormFeedback(null), 3000);
    }
    if (newReps >= exercise.targetReps) {
      if (set < exercise.sets) {
        setTimeout(() => {
          setSet(s => s + 1);
          setReps(0);
          setRestMode(true);
        }, 400);
      } else {
        setDone(true);
        setRunning(false);
        clearInterval(intervalRef.current);
      }
    }
  };

  const reset = () => {
    setReps(0);
    setSet(1);
    setRunning(false);
    setSeconds(0);
    setDone(false);
    setRestMode(false);
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = Math.min(100, (reps / exercise.targetReps) * 100);

  if (done) {
    return (
      <div className="flex flex-col items-center py-8">
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{
            width: 72, height: 72,
            background: 'rgba(16,185,129,0.15)',
            border: '2px solid #10b981',
            boxShadow: '0 0 24px rgba(16,185,129,0.3)',
          }}
        >
          <CheckCircle2 size={32} color="#10b981" />
        </div>
        <div className="font-display font-bold mb-1" style={{ color: '#10b981', fontSize: '1.1rem', letterSpacing: '0.08em' }}>
          SET COMPLETE
        </div>
        <div className="text-sm mb-1" style={{ color: '#8b90b8' }}>
          {exercise.sets} sets · {exercise.targetReps * exercise.sets} {exercise.unit || 'reps'} · {formatTime(seconds)}
        </div>
        <FormScore score={Math.floor(Math.random() * 15) + 82} />
        <div className="flex gap-3 mt-5">
          <button onClick={reset} className="btn-ghost rounded px-4 py-2 text-xs">
            Reset
          </button>
          <button onClick={onComplete} className="btn-cyan rounded px-5 py-2 text-xs">
            Log & Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4">
      {/* Timer */}
      <div className="flex items-center gap-4 mb-5">
        <span className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.65rem' }}>
          SET {set}/{exercise.sets}
        </span>
        <div
          className="font-display font-bold"
          style={{ color: '#06b6d4', fontSize: '1.8rem', letterSpacing: '0.1em' }}
        >
          {formatTime(seconds)}
        </div>
        <button
          onClick={() => setRunning(r => !r)}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 32, height: 32,
            background: running ? 'rgba(236,72,153,0.15)' : 'rgba(16,185,129,0.15)',
            border: running ? '1px solid #ec4899' : '1px solid #10b981',
          }}
        >
          {running ? <Pause size={14} color="#ec4899" /> : <Play size={14} color="#10b981" />}
        </button>
      </div>

      {/* Rest mode overlay */}
      {restMode && (
        <div
          className="w-full rounded-lg p-4 mb-4 text-center"
          style={{
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.2)',
          }}
        >
          <div className="font-mono-code mb-1" style={{ color: '#06b6d4', fontSize: '0.65rem' }}>REST PERIOD</div>
          <div className="font-display font-bold" style={{ color: '#e8eaff', fontSize: '2rem' }}>
            {restSeconds}s
          </div>
          <button
            onClick={() => { setRestMode(false); setRestSeconds(60); clearInterval(restRef.current); }}
            className="text-xs mt-2"
            style={{ color: '#8b90b8' }}
          >
            Skip rest →
          </button>
        </div>
      )}

      {/* Rep ring */}
      {!restMode && (
        <>
          <div className="relative mb-5" style={{ width: 160, height: 160 }}>
            <svg width={160} height={160} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={80} cy={80} r={70} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth={8} />
              <circle
                cx={80} cy={80} r={70}
                fill="none"
                stroke="url(#repGrad)"
                strokeWidth={8}
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - pct / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s ease', filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.5))' }}
              />
              <defs>
                <linearGradient id="repGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display font-bold" style={{ color: '#e8eaff', fontSize: '2.8rem', lineHeight: 1 }}>
                {reps}
              </div>
              <div className="font-mono-code" style={{ color: '#8b90b8', fontSize: '0.65rem' }}>
                / {exercise.targetReps}
              </div>
              <div className="font-mono-code mt-0.5" style={{ color: '#4a4f72', fontSize: '0.58rem' }}>
                {exercise.unit === 'sec' ? 'SECONDS' : 'REPS'}
              </div>
            </div>
          </div>

          {/* Form feedback */}
          {formFeedback && (
            <div
              className="w-full rounded px-3 py-2 mb-4 text-xs text-center animate-slide-up"
              style={{
                background: formFeedback.startsWith('✓')
                  ? 'rgba(16,185,129,0.08)'
                  : 'rgba(245,158,11,0.08)',
                border: formFeedback.startsWith('✓')
                  ? '1px solid rgba(16,185,129,0.25)'
                  : '1px solid rgba(245,158,11,0.25)',
                color: formFeedback.startsWith('✓') ? '#10b981' : '#f59e0b',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.7rem',
              }}
            >
              {formFeedback}
            </div>
          )}

          <button
            onClick={addRep}
            className="btn-primary rounded-full flex items-center justify-center mb-4"
            style={{ width: 64, height: 64, fontSize: '1.4rem' }}
            disabled={!running}
          >
            +
          </button>

          <div className="flex gap-3">
            <button onClick={reset} className="btn-ghost rounded px-3 py-1.5 text-xs flex items-center gap-1">
              <RotateCcw size={10} /> Reset
            </button>
            {!running && (
              <button
                onClick={() => setRunning(true)}
                className="btn-cyan rounded px-4 py-1.5 text-xs"
              >
                START
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WorkoutPrepPanel({ completed, onNavigate }) {
  const sessionTargets = [
    { label: 'Exercise Pool', value: exercises.length, unit: 'moves', color: '#8b5cf6' },
    { label: 'Target Sets', value: exercises.reduce((sum, ex) => sum + ex.sets, 0), unit: 'sets', color: '#06b6d4' },
    { label: 'Completed', value: completed.length, unit: 'today', color: '#10b981' },
  ];

  return (
    <div className="panel-stack sticky-panel">
      <div
        className="rounded-lg p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.05))',
          border: '1px solid rgba(124,58,237,0.2)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none neural-grid-cyan"
          style={{ opacity: 0.25 }}
        />
        <div className="relative">
          <div className="badge-live mb-3 inline-block">READY</div>
          <div className="font-display font-bold mb-2" style={{ color: '#e8eaff', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
            SESSION PRIMER
          </div>
          <p className="text-sm mb-4" style={{ color: '#c4c8e8', lineHeight: 1.6, fontSize: '0.82rem' }}>
            Pick any move to open the live rep counter, rest timer, and AI form feedback panel.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {sessionTargets.map(target => (
              <div
                key={target.label}
                className="rounded p-3 text-center"
                style={{
                  background: 'rgba(8,9,15,0.5)',
                  border: `1px solid ${target.color}24`,
                }}
              >
                <div className="font-display font-bold" style={{ color: target.color, fontSize: '1rem' }}>
                  {target.value}
                </div>
                <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.52rem' }}>
                  {target.unit.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="rounded-lg p-5"
        style={{
          background: 'rgba(13,15,26,0.8)',
          border: '1px solid rgba(124,58,237,0.15)',
        }}
      >
        <div className="font-display font-bold mb-4" style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
          TODAY'S TARGETS
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Primary Focus', value: 'Upper + Core', color: '#8b5cf6' },
            { label: 'Tempo', value: 'Controlled reps', color: '#06b6d4' },
            { label: 'Rest Window', value: '60-90 sec', color: '#f59e0b' },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded p-3"
              style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.08)' }}
            >
              <span className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.58rem' }}>
                {item.label.toUpperCase()}
              </span>
              <span className="font-display font-semibold" style={{ color: item.color, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-lg p-5"
        style={{
          background: 'rgba(13,15,26,0.8)',
          border: '1px solid rgba(6,182,212,0.15)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Plus size={13} style={{ color: '#06b6d4' }} />
          <div className="font-display font-bold" style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
            FORM SIGNALS
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {['Neutral spine', 'Full range', 'Stable tempo'].map(signal => (
            <div key={signal} className="flex items-center gap-2">
              <CheckCircle2 size={12} style={{ color: '#10b981' }} />
              <span className="text-xs" style={{ color: '#8b90b8' }}>{signal}</span>
            </div>
          ))}
        </div>
        <button
          className="w-full btn-ghost rounded px-3 py-2 text-xs mt-4 flex items-center justify-center gap-2"
          onClick={() => onNavigate('history')}
        >
          Review Recent Form <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

export default function Workout({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [completed, setCompleted] = useState([]);

  const handleComplete = () => {
    setCompleted(prev => [...prev, selected]);
    setSelected(null);
    setSessionActive(false);
  };

  return (
    <div className="page-shell">
      <div className="page-inner">

        {/* Header */}
        <div className="page-heading">
          <div className="chip mb-2">· AI FORM ANALYSIS ACTIVE</div>
          <h1 className="font-display font-bold mb-1" style={{ color: '#e8eaff', fontSize: '1.3rem', letterSpacing: '0.08em' }}>
            WORKOUT SESSION
          </h1>
          <p className="text-sm" style={{ color: '#8b90b8' }}>
            Select an exercise · rep tracking + form correction via AI
          </p>
        </div>

        <div className="workout-layout">

          {/* Exercise Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="EXERCISES" subtitle="Choose an exercise to begin" />
              {completed.length > 0 && (
                <div className="chip-cyan chip text-xs flex items-center gap-1">
                  <CheckCircle2 size={10} /> {completed.length} completed
                </div>
              )}
            </div>
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
            >
              {exercises.map(ex => (
                <div key={ex.id} className="relative">
                  {completed.find(c => c.id === ex.id) && (
                    <div
                      className="absolute top-2 right-2 z-10 rounded-full flex items-center justify-center"
                      style={{
                        width: 20, height: 20,
                        background: '#10b981',
                      }}
                    >
                      <CheckCircle2 size={12} color="white" />
                    </div>
                  )}
                  <ExerciseCard
                    exercise={ex}
                    onSelect={(e) => {
                      setSelected(e);
                      setSessionActive(true);
                    }}
                    selected={selected?.id === ex.id}
                  />
                </div>
              ))}
            </div>

            {/* Session Summary */}
            {completed.length > 0 && (
              <div
                className="mt-5 rounded-lg p-4"
                style={{
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <div className="font-display font-bold mb-2" style={{ color: '#10b981', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                  SESSION PROGRESS
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {completed.map(ex => (
                    <span key={ex.id} className="text-xs rounded px-2 py-1"
                      style={{
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        color: '#10b981',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.65rem',
                      }}
                    >
                      ✓ {ex.name}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-cyan rounded px-5 py-2 text-xs"
                  onClick={() => onNavigate('history')}
                >
                  Finish & Save Session
                </button>
              </div>
            )}

              {/* Workout Tips */}
              {!sessionActive && (
                <div
                  className="mt-5 rounded-lg p-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))',
                    border: '1px solid rgba(124,58,237,0.15)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} style={{ color: '#8b5cf6' }} />
                    <div className="font-display font-bold" style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                      AI TRAINING TIPS
                    </div>
                  </div>
                  <div className="tips-grid">
                    {[
                      { tip: 'Warm up 5 min before lifting to prevent injury', icon: '🔥' },
                      { tip: 'Keep rest periods 60-90s for hypertrophy', icon: '⏱️' },
                      { tip: 'Focus on mind-muscle connection each rep', icon: '🧠' },
                      { tip: 'Log every session for consistent progress', icon: '📊' },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded p-3"
                        style={{
                          background: 'rgba(13,15,26,0.6)',
                          border: '1px solid rgba(124,58,237,0.08)',
                        }}
                      >
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{t.icon}</span>
                        <span className="text-xs" style={{ color: '#8b90b8', lineHeight: 1.5 }}>{t.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Active exercise panel */}
          {sessionActive && selected && (
            <div
              className="rounded-lg relative overflow-hidden sticky-panel"
              style={{
                background: 'rgba(13,15,26,0.9)',
                border: '1px solid rgba(124,58,237,0.25)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.08), transparent 60%)' }}
              />
              <div className="relative">
                {/* Panel header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: '1px solid rgba(124,58,237,0.12)' }}
                >
                  <div>
                    <div className="badge-ai mb-1">AI TRACKING</div>
                    <div className="font-display font-bold" style={{ color: '#e8eaff', fontSize: '0.9rem', letterSpacing: '0.06em' }}>
                      {selected.name.toUpperCase()}
                    </div>
                    <div className="text-xs" style={{ color: '#8b90b8' }}>{selected.muscle}</div>
                  </div>
                  <button
                    onClick={() => { setSelected(null); setSessionActive(false); }}
                    className="rounded p-1"
                    style={{ border: '1px solid rgba(124,58,237,0.15)', color: '#8b90b8' }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Webcam placeholder */}
                <div
                  className="mx-5 mt-4 rounded-lg flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    height: 180,
                    background: 'rgba(8,9,15,0.8)',
                    border: '1px dashed rgba(124,58,237,0.2)',
                  }}
                >
                  <div
                    className="absolute inset-0 neural-grid-cyan"
                    style={{ opacity: 0.4 }}
                  />
                  {/* HUD corners */}
                  <div className="absolute top-3 left-3" style={{ width: 16, height: 16, borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' }} />
                  <div className="absolute top-3 right-3" style={{ width: 16, height: 16, borderTop: '2px solid #06b6d4', borderRight: '2px solid #06b6d4' }} />
                  <div className="absolute bottom-3 left-3" style={{ width: 16, height: 16, borderBottom: '2px solid #7c3aed', borderLeft: '2px solid #7c3aed' }} />
                  <div className="absolute bottom-3 right-3" style={{ width: 16, height: 16, borderBottom: '2px solid #7c3aed', borderRight: '2px solid #7c3aed' }} />
                  <div className="relative text-center">
                    <div className="text-2xl mb-2">📹</div>
                    <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.65rem' }}>
                      CAMERA · POSTURE DETECTION
                    </div>
                    <div className="font-mono-code mt-1" style={{ color: '#7c3aed', fontSize: '0.58rem' }}>
                      AI MODEL LOADED
                    </div>
                  </div>
                </div>

                {/* Rep counter */}
                <div className="px-5 pb-5">
                  <RepCounter exercise={selected} onComplete={handleComplete} />
                </div>
              </div>
            </div>
          )}
          {!sessionActive && (
            <WorkoutPrepPanel completed={completed} onNavigate={onNavigate} />
          )}
        </div>
      </div>
    </div>
  );
}
