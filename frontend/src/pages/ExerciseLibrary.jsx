// ExerciseLibrary.jsx
import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Dumbbell,
  ChevronRight,
  Film,
  Info,
  AlertTriangle,
  CheckCircle,
  Flame,
  BarChart2,
  Target,
} from 'lucide-react';
import { exercises } from '../data/exerciseData.js';

/* ─────────────────────────────────────────────
   REUSABLE EXERCISE CARD
───────────────────────────────────────────── */
/* ── Placeholder shown when gifUrl is null or image fails to load ── */
function GifPlaceholder({ size = 28, label = 'NO PREVIEW' }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-1.5"
      style={{ background: 'rgba(8,9,15,0.8)' }}
    >
      <Dumbbell size={size} style={{ color: 'rgba(139,92,246,0.3)' }} />
      <span
        className="font-mono-code"
        style={{ color: 'rgba(139,92,246,0.3)', fontSize: '0.65rem', letterSpacing: '0.1em' }}
      >
        {label}
      </span>
    </div>
  );
}

function ExerciseCard({ exercise, onView }) {
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const difficultyColor = {
    Beginner: '#10b981',
    Intermediate: '#f59e0b',
    Advanced: '#ef4444',
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: 'rgba(13,15,26,0.85)',
        border: `1px solid ${hovered ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.12)'}`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 28px -8px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.08)'
          : '0 2px 8px rgba(0,0,0,0.25)',
        transition: 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Preview area — 16:9 container, object-contain, onError fallback */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          background: 'rgba(8,9,15,0.8)',
        }}
      >
        {exercise.gifUrl && !imgFailed ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            onError={() => setImgFailed(true)}
            className="transition-opacity duration-300"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              opacity: hovered ? 1 : 0.8,
            }}
          />
        ) : (
          <GifPlaceholder />
        )}
        {/* Subtle bottom gradient for text readability */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '40px',
            background: 'linear-gradient(to top, rgba(13,15,26,0.7), transparent)',
          }}
        />
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <h3
          className="font-display font-bold truncate"
          style={{
            color: '#e8eaff',
            fontSize: '0.875rem',
            letterSpacing: '0.04em',
            lineHeight: 1.3,
            marginBottom: '10px',
          }}
        >
          {exercise.name}
        </h3>

        <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
          <span
            className="font-mono-code font-bold"
            style={{
              fontSize: '0.65rem',
              padding: '2px 8px',
              borderRadius: '4px',
              background: `${difficultyColor[exercise.difficulty]}18`,
              color: difficultyColor[exercise.difficulty],
              border: `1px solid ${difficultyColor[exercise.difficulty]}35`,
              letterSpacing: '0.06em',
            }}
          >
            {exercise.difficulty.toUpperCase()}
          </span>
          <span
            className="font-mono-code font-bold"
            style={{
              fontSize: '0.65rem',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(124,58,237,0.1)',
              color: '#8b5cf6',
              border: '1px solid rgba(124,58,237,0.22)',
              letterSpacing: '0.06em',
            }}
          >
            {exercise.muscleGroup}
          </span>
        </div>

        <p
          className="line-clamp-2"
          style={{
            color: '#8b90b8',
            fontSize: '0.8rem',
            lineHeight: 1.55,
            marginBottom: '14px',
          }}
        >
          {exercise.description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onView(exercise); }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg font-bold tracking-wider transition-all hover:bg-[rgba(124,58,237,0.12)] active:scale-[0.97]"
            style={{
              padding: '7px 10px',
              fontSize: '0.65rem',
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.18)',
              color: '#c4c8e8',
              letterSpacing: '0.08em',
            }}
          >
            <Info size={12} />
            VIEW DETAILS
          </button>
          {exercise.youtubeLink && (
            <a
              href={exercise.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center rounded-lg transition-all hover:scale-105"
              style={{
                width: '34px',
                height: '34px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.22)',
                color: '#ef4444',
              }}
              title="Watch Video"
            >
              <Film size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DETAIL MODAL – VIEWPORT‑SAFE, FIXED OVERFLOW
───────────────────────────────────────────── */
const modalKeyframes = `
@keyframes modalOverlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes modalPanelIn {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;

function DetailModal({ exercise, onClose }) {
  const [modalImgFailed, setModalImgFailed] = useState(false);
  if (!exercise) return null;

  const difficultyMap = {
    Beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.28)', label: 'BEGINNER' },
    Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.28)', label: 'INTERMEDIATE' },
    Advanced:     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)',  label: 'ADVANCED' },
  };
  const diff = difficultyMap[exercise.difficulty] || difficultyMap.Beginner;

  const Badge = ({ icon, label, color, bg, border }) => (
    <div
      className="flex items-center gap-2 font-mono-code font-bold"
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.06em',
        padding: '5px 12px',
        borderRadius: '6px',
        background: bg,
        border: `1px solid ${border}`,
        color,
      }}
    >
      {icon}
      {label}
    </div>
  );

  const hasTips = exercise.formTips?.length > 0;
  const hasMistakes = exercise.commonMistakes?.length > 0;

  return (
    <>
      <style>{modalKeyframes}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'modalOverlayIn 0.25s ease-out both',
        }}
      />

      {/* Centered container (viewport‑safe) */}
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-hidden"
        style={{ padding: 'max(24px, 4vh) 16px' }}
      >
        {/* Modal panel – max height 90vh, content scrolls internally */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full flex flex-col"
          style={{
            maxWidth: '780px',
            maxHeight: '90vh',
            background: 'rgba(13,15,26,0.97)',
            border: '1px solid rgba(124,58,237,0.18)',
            borderRadius: '16px',
            boxShadow: '0 32px 64px -16px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.08)',
            animation: 'modalPanelIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {/* ── Header (media + close) – sticky, never scrolls ── */}
          <div className="relative flex-shrink-0 overflow-hidden"
            style={{
              borderRadius: '16px 16px 0 0',
              aspectRatio: '16 / 9',
              maxHeight: '320px',
              background: 'rgba(8,9,15,0.8)',
            }}
          >
            {/* Close button – stays in header */}
            <button
              onClick={onClose}
              className="absolute z-20 flex items-center justify-center"
              style={{
                top: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(13,15,26,0.8)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: '#8b90b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
                e.currentTarget.style.color = '#e8eaff';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(13,15,26,0.8)';
                e.currentTarget.style.color = '#8b90b8';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
              }}
            >
              <X size={15} />
            </button>

            {/* Media — 16:9 container, object-contain, runtime fallback */}
            {exercise.gifUrl && !modalImgFailed ? (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                onError={() => setModalImgFailed(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  opacity: 0.9,
                }}
              />
            ) : (
              <GifPlaceholder size={32} label="NO PREVIEW AVAILABLE" />
            )}
            {/* bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height: '60px', background: 'linear-gradient(to top, rgba(13,15,26,0.97), transparent)' }}
            />
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto" style={{ padding: '24px 28px 28px' }}>
            {/* Title + description */}
            <h2
              className="font-display font-bold"
              style={{ color: '#e8eaff', fontSize: '1.25rem', letterSpacing: '0.05em', marginBottom: '6px' }}
            >
              {exercise.name}
            </h2>
            <p style={{ color: '#8b90b8', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {exercise.description}
            </p>

            {/* Two-column details + muscles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              }}
              className="modal-meta-grid"
            >
              <div>
                <div className="font-mono-code font-bold" style={{ fontSize: '0.6rem', color: '#4a4f72', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  DETAILS
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge icon={<Dumbbell size={12} />} label={exercise.equipment || 'Bodyweight'} color="#8b5cf6" bg="rgba(124,58,237,0.1)" border="rgba(124,58,237,0.22)" />
                  <Badge icon={<Flame size={12} />} label={diff.label} color={diff.color} bg={diff.bg} border={diff.border} />
                  <Badge icon={<Target size={12} />} label={exercise.muscleGroup} color="#06b6d4" bg="rgba(6,182,212,0.1)" border="rgba(6,182,212,0.22)" />
                  {exercise.type && (
                    <Badge icon={<BarChart2 size={12} />} label={exercise.type.toUpperCase()} color="#ec4899" bg="rgba(236,72,153,0.1)" border="rgba(236,72,153,0.22)" />
                  )}
                </div>
              </div>

              <div>
                <div className="font-mono-code font-bold" style={{ fontSize: '0.6rem', color: '#4a4f72', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  MUSCLES WORKED
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.musclesWorked.map(m => (
                    <span
                      key={m}
                      className="font-mono-code"
                      style={{
                        fontSize: '0.65rem',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: 'rgba(124,58,237,0.07)',
                        color: '#c4c8e8',
                        border: '1px solid rgba(124,58,237,0.13)',
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(124,58,237,0.1)', marginBottom: '24px' }} />

            {/* Step-by-step */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
                <Info size={13} style={{ color: '#8b5cf6' }} />
                <span className="font-mono-code font-bold" style={{ fontSize: '0.65rem', color: '#4a4f72', letterSpacing: '0.1em' }}>
                  STEP-BY-STEP INSTRUCTIONS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exercise.instructions.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-3"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(124,58,237,0.04)',
                      border: '1px solid rgba(124,58,237,0.08)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.08)';
                    }}
                  >
                    <div
                      className="font-display font-bold flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '7px',
                        background: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(124,58,237,0.25)',
                        color: '#8b5cf6',
                        fontSize: '0.7rem',
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </div>
                    <p style={{ color: '#c4c8e8', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Mistakes side-by-side */}
            {(hasTips || hasMistakes) && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: hasTips && hasMistakes ? '1fr 1fr' : '1fr',
                  gap: '14px',
                  marginBottom: '24px',
                }}
                className="modal-tips-grid"
              >
                {hasTips && (
                  <div
                    style={{
                      borderRadius: '12px',
                      padding: '16px 18px',
                      background: 'rgba(16,185,129,0.05)',
                      border: '1px solid rgba(16,185,129,0.15)',
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'rgba(16,185,129,0.15)',
                        }}
                      >
                        <CheckCircle size={13} color="#10b981" />
                      </div>
                      <span className="font-mono-code font-bold" style={{ fontSize: '0.6rem', color: '#10b981', letterSpacing: '0.1em' }}>
                        FORM TIPS
                      </span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {exercise.formTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2" style={{ fontSize: '0.78rem', color: '#8b90b8', lineHeight: 1.55 }}>
                          <span style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}>›</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasMistakes && (
                  <div
                    style={{
                      borderRadius: '12px',
                      padding: '16px 18px',
                      background: 'rgba(245,158,11,0.04)',
                      border: '1px solid rgba(245,158,11,0.14)',
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'rgba(245,158,11,0.15)',
                        }}
                      >
                        <AlertTriangle size={13} color="#f59e0b" />
                      </div>
                      <span className="font-mono-code font-bold" style={{ fontSize: '0.6rem', color: '#f59e0b', letterSpacing: '0.1em' }}>
                        COMMON MISTAKES
                      </span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {exercise.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-2" style={{ fontSize: '0.78rem', color: '#8b90b8', lineHeight: 1.55 }}>
                          <span style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }}>›</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Footer: Watch Video */}
            {exercise.youtubeLink && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <a
                  href={exercise.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-display font-bold"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(139,92,246,0.15))',
                    border: '1px solid rgba(124,58,237,0.35)',
                    color: '#e8eaff',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 0 16px rgba(124,58,237,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(139,92,246,0.25))';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(139,92,246,0.15))';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Film size={14} />
                  WATCH VIDEO
                  <ChevronRight size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Responsive overrides */}
          <style>{`
            @media (max-width: 640px) {
              .modal-meta-grid { grid-template-columns: 1fr !important; }
              .modal-tips-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXERCISE LIBRARY PAGE
───────────────────────────────────────────── */
export default function ExerciseLibrary() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const muscleGroups = ['All', ...new Set(exercises.map(e => e.muscleGroup))];
  const difficulties = ['All', ...new Set(exercises.map(e => e.difficulty))];
  const types = ['All', ...new Set(exercises.map(e => e.type))];

  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
                          ex.muscleGroup.toLowerCase().includes(search.toLowerCase()) ||
                          ex.equipment?.toLowerCase().includes(search.toLowerCase());
      const matchMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
      const matchDifficulty = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
      const matchType = selectedType === 'All' || ex.type === selectedType;
      return matchSearch && matchMuscle && matchDifficulty && matchType;
    });
  }, [search, selectedMuscle, selectedDifficulty, selectedType]);

  const selectStyle = {
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a4f72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  };

  return (
    <div className="relative page-shell min-h-screen">
      {/* Neural background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.4 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(124,58,237,0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10" style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1
            className="font-display font-bold"
            style={{
              color: '#e8eaff',
              fontSize: '1.35rem',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            EXERCISE LIBRARY
          </h1>
          <p style={{ color: '#8b90b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Browse exercises with form guides, tips, and video demonstrations.
          </p>
        </div>

        {/* Search + filters */}
        <div
          className="flex flex-col md:flex-row md:items-center gap-3"
          style={{ marginBottom: '24px' }}
        >
          <div className="relative flex-1" style={{ maxWidth: '420px' }}>
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: '#8b5cf6' }}
            />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] placeholder-[#4a4f72] focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_8px_rgba(124,58,237,0.2)] transition-all font-mono-code"
              style={{ padding: '9px 14px 9px 38px', fontSize: '0.8rem' }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="rounded-lg bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] focus:outline-none focus:border-[#8b5cf6] font-mono-code cursor-pointer"
              style={{ ...selectStyle, padding: '9px 32px 9px 14px', fontSize: '0.75rem' }}
            >
              {muscleGroups.map(m => <option key={m} value={m}>{m === 'All' ? 'All Muscles' : m}</option>)}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-lg bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] focus:outline-none focus:border-[#8b5cf6] font-mono-code cursor-pointer"
              style={{ ...selectStyle, padding: '9px 32px 9px 14px', fontSize: '0.75rem' }}
            >
              {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>)}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] focus:outline-none focus:border-[#8b5cf6] font-mono-code cursor-pointer"
              style={{ ...selectStyle, padding: '9px 32px 9px 14px', fontSize: '0.75rem' }}
            >
              {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div
          className="font-mono-code"
          style={{ color: '#4a4f72', fontSize: '0.7rem', marginBottom: '20px', letterSpacing: '0.06em' }}
        >
          {filtered.length} EXERCISE{filtered.length !== 1 ? 'S' : ''} FOUND
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onView={(ex) => setSelectedExercise(ex)}
            />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart2 size={40} className="mb-4" style={{ color: '#4a4f72' }} />
            <h3 className="font-display mb-2" style={{ color: '#8b90b8', fontSize: '1rem' }}>No exercises found</h3>
            <p style={{ color: '#4a4f72', fontSize: '0.8rem' }}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {selectedExercise && (
        <DetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}