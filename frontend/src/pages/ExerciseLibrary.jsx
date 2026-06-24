// ExerciseLibrary.jsx
import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Dumbbell,
  ChevronRight,
  Film,
  Play,
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
function ExerciseCard({ exercise, onView }) {
  const [hovered, setHovered] = useState(false);

  const difficultyColor = {
    Beginner: '#10b981',
    Intermediate: '#f59e0b',
    Advanced: '#ef4444',
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer group"
      style={{
        background: 'rgba(13,15,26,0.85)',
        border: `1px solid ${hovered ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.15)'}`,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 40px -12px rgba(124,58,237,0.25), inset 0 0 20px rgba(124,58,237,0.05)'
          : '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Demo area */}
      <div className="relative w-full h-40 bg-black/30 flex items-center justify-center">
        {exercise.gifUrl ? (
          <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/40">
            <Play size={32} />
            <span className="text-xs font-mono">DEMO</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play size={36} className="text-white" fill="white" />
        </div>
      </div>

      <div className="p-5">
        <h3
          className="font-display font-bold text-lg mb-2 truncate"
          style={{ color: '#e8eaff', letterSpacing: '0.04em' }}
        >
          {exercise.name}
        </h3>

        <div className="flex items-center gap-3 mb-3">
          <span
            className="px-2 py-0.5 rounded text-xs font-mono-code font-bold"
            style={{
              background: `${difficultyColor[exercise.difficulty]}20`,
              color: difficultyColor[exercise.difficulty],
              border: `1px solid ${difficultyColor[exercise.difficulty]}40`,
            }}
          >
            {exercise.difficulty.toUpperCase()}
          </span>
          <span
            className="px-2 py-0.5 rounded text-xs font-mono-code font-bold"
            style={{
              background: 'rgba(124,58,237,0.15)',
              color: '#8b5cf6',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            {exercise.muscleGroup}
          </span>
        </div>

        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#8b90b8' }}>
          {exercise.description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onView(exercise); }}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold tracking-wider transition-all hover:bg-[rgba(124,58,237,0.15)] active:scale-95"
            style={{
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.25)',
              color: '#e8eaff',
            }}
          >
            <Info size={14} />
            VIEW DETAILS
          </button>
          {exercise.youtubeLink && (
            <a
              href={exercise.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all hover:scale-110"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
              }}
              title="Watch Video"
            >
              <Film size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────── */
function DetailModal({ exercise, onClose }) {
  if (!exercise) return null;

  const difficultyColor = {
    Beginner: '#10b981',
    Intermediate: '#f59e0b',
    Advanced: '#ef4444',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl animate-in zoom-in-95 duration-300"
        style={{
          background: 'rgba(13,15,26,0.95)',
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(124,58,237,0.1)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#e8eaff',
          }}
        >
          <X size={16} />
        </button>

        <div className="relative w-full h-56 bg-black/40 flex items-center justify-center rounded-t-2xl">
          {exercise.gifUrl ? (
            <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/40">
              <Play size={48} />
              <span className="font-mono text-sm">EXERCISE DEMO</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <h2
            className="font-display font-bold text-2xl mb-4"
            style={{ color: '#e8eaff', letterSpacing: '0.04em' }}
          >
            {exercise.name}
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Dumbbell size={14} color="#8b5cf6" />
              <span className="text-xs font-mono-code text-[#8b5cf6]">{exercise.equipment || 'Bodyweight'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ background: `${difficultyColor[exercise.difficulty]}15`, border: `1px solid ${difficultyColor[exercise.difficulty]}40` }}>
              <Flame size={14} color={difficultyColor[exercise.difficulty]} />
              <span className="text-xs font-mono-code" style={{ color: difficultyColor[exercise.difficulty] }}>{exercise.difficulty.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <Target size={14} color="#06b6d4" />
              <span className="text-xs font-mono-code text-[#06b6d4]">{exercise.muscleGroup}</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-mono-code font-bold text-[#4a4f72] mb-3">MUSCLES WORKED</h4>
            <div className="flex flex-wrap gap-2">
              {exercise.musclesWorked.map(m => (
                <span key={m} className="px-3 py-1 rounded-full text-xs font-mono-code" style={{ background: 'rgba(124,58,237,0.08)', color: '#c4c8e8', border: '1px solid rgba(124,58,237,0.15)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-mono-code font-bold text-[#4a4f72] mb-3 flex items-center gap-2">
              <Info size={14} color="#8b5cf6" /> STEP-BY-STEP
            </h4>
            <ol className="space-y-2 pl-4">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="text-sm" style={{ color: '#c4c8e8', lineHeight: 1.6 }}>
                  <span className="font-bold text-[#8b5cf6] mr-1">{i+1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {exercise.formTips?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-mono-code font-bold text-[#4a4f72] mb-3 flex items-center gap-2">
                <CheckCircle size={14} color="#10b981" /> FORM TIPS
              </h4>
              <ul className="space-y-1 pl-4">
                {exercise.formTips.map((tip, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#8b90b8' }}>
                    <span className="text-[#10b981] mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.commonMistakes?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-mono-code font-bold text-[#4a4f72] mb-3 flex items-center gap-2">
                <AlertTriangle size={14} color="#f59e0b" /> COMMON MISTAKES
              </h4>
              <ul className="space-y-1 pl-4">
                {exercise.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#8b90b8' }}>
                    <span className="text-[#f59e0b] mt-1">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.youtubeLink && (
            <div className="mt-8 flex justify-end">
              <a
                href={exercise.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  boxShadow: '0 0 20px rgba(239,68,68,0.4)',
                }}
              >
                <Film size={16} />
                WATCH VIDEO
                <ChevronRight size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
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

      <div className="relative z-10 px-6 md:px-10 py-8">
        <div className="mb-8">
          <h1
            className="font-display font-bold text-3xl mb-2"
            style={{ color: '#e8eaff', letterSpacing: '0.04em' }}
          >
            EXERCISE LIBRARY
          </h1>
          <p style={{ color: '#8b90b8' }}>
            Browse exercises with form guides, tips, and video demonstrations.
          </p>
        </div>

        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: '#8b5cf6' }}
            />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] placeholder-[#4a4f72] focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all font-mono-code"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] focus:outline-none focus:border-[#8b5cf6] font-mono-code text-sm"
              style={{ appearance: 'none', backgroundImage: 'none' }}
            >
              {muscleGroups.map(m => <option key={m} value={m}>{m === 'All' ? 'All Muscles' : m}</option>)}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] focus:outline-none focus:border-[#8b5cf6] font-mono-code text-sm"
              style={{ appearance: 'none', backgroundImage: 'none' }}
            >
              {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>)}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[rgba(13,15,26,0.8)] border border-[rgba(124,58,237,0.15)] text-[#e8eaff] focus:outline-none focus:border-[#8b5cf6] font-mono-code text-sm"
              style={{ appearance: 'none', backgroundImage: 'none' }}
            >
              {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-6 text-xs font-mono-code" style={{ color: '#4a4f72' }}>
          {filtered.length} EXERCISE{filtered.length !== 1 ? 'S' : ''} FOUND
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onView={(ex) => setSelectedExercise(ex)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart2 size={48} className="mb-4" style={{ color: '#4a4f72' }} />
            <h3 className="text-xl font-display mb-2" style={{ color: '#8b90b8' }}>No exercises found</h3>
            <p className="text-sm" style={{ color: '#4a4f72' }}>Try adjusting your search or filters.</p>
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