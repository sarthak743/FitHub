import { useState, useMemo, useRef } from 'react';
import {
  Edit2, Save, X,
  User, Target, Ruler, Weight, BarChart2, Calendar,
  Flame, Dumbbell, Footprints, ChevronDown, Trophy, Camera
} from 'lucide-react';
import { user } from '../data/mockData.js';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function heightToMetres(value, unit) {
  if (unit === 'cm') return parseFloat(value) / 100;
  const parts = String(value).split('.');
  const ft = parseFloat(parts[0]) || 0;
  const inches = parseFloat(parts[1] || '0');
  return (ft * 12 + inches) * 0.0254;
}
function weightToKg(value, unit) {
  const v = parseFloat(value);
  return unit === 'kg' ? v : v * 0.453592;
}
function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#06b6d4', pct: ((bmi - 10) / 30) * 100 };
  if (bmi < 25)   return { label: 'Normal',       color: '#10b981', pct: ((bmi - 10) / 30) * 100 };
  if (bmi < 30)   return { label: 'Overweight',   color: '#f59e0b', pct: ((bmi - 10) / 30) * 100 };
  return             { label: 'Obese',           color: '#ef4444', pct: Math.min(((bmi - 10) / 30) * 100, 100) };
}

/* ─────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────── */
const LABEL_STYLE = { color: '#3e4268', fontSize: '0.68rem', letterSpacing: '0.12em', fontFamily: 'inherit', fontWeight: 600 };

function SectionEyebrow({ children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div style={{ width: 4, height: 20, background: 'rgba(124,58,237,0.5)', borderRadius: 2, flexShrink: 0 }} />
      <span className="font-display font-bold" style={{ color: '#6b7196', fontSize: '0.8rem', letterSpacing: '0.14em' }}>
        {children}
      </span>
    </div>
  );
}

function CyberInput({ value, onChange, type = 'text', placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-cyber w-full rounded-lg px-4 py-3 text-base"
      style={{ background: 'rgba(6,7,14,0.7)', boxSizing: 'border-box' }}
    />
  );
}

function CyberSelect({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-cyber w-full rounded-lg px-4 py-3 text-base"
        style={{
          background: 'rgba(6,7,14,0.7)',
          boxSizing: 'border-box',
          cursor: 'pointer',
          appearance: 'none',
          paddingRight: '2.5rem',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#0d0f1a' }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none', color: '#4a4f72',
        }}
      />
    </div>
  );
}

function UnitToggle({ value, options, onChange }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(124,58,237,0.22)',
        marginBottom: 12,
      }}
    >
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            fontFamily: 'inherit',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            padding: '6px 16px',
            background: value === o ? 'rgba(124,58,237,0.3)' : 'transparent',
            color: value === o ? '#c4b5fd' : '#4a4f72',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {o.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FIELD CARD
───────────────────────────────────────────── */
function FieldCard({ label, icon: Icon, color = '#8b5cf6', editing, readOnly, children }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(10,11,20,0.9)',
        border: `1px solid ${readOnly ? 'rgba(124,58,237,0.06)' : editing ? 'rgba(124,58,237,0.4)' : hovered ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.14)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered && !editing ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered && !editing ? `0 8px 24px -8px ${color}44` : 'none',
        minHeight: 110,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* top accent bar - added for consistency with stat cards */}
      <div style={{ 
        height: 3, 
        background: color, 
        opacity: hovered ? 0.85 : 0.65,
        transition: 'opacity 0.3s ease',
        boxShadow: hovered ? `0 0 10px ${color}` : 'none'
      }} />

      <div style={{ padding: '17px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={14} style={{ color, opacity: 0.85, flexShrink: 0 }} />}
          <span className="font-mono-code" style={LABEL_STYLE}>{label.toUpperCase()}</span>
          {readOnly && (
            <span
              className="font-mono-code"
              style={{
                marginLeft: 'auto',
                fontSize: '0.55rem',
                letterSpacing: '0.08em',
                color: 'rgba(124,58,237,0.4)',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.15)',
                borderRadius: 4,
                padding: '2px 8px',
              }}
            >
              AUTO
            </span>
          )}
        </div>
        {/* content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function FieldValue({ children }) {
  return (
    <div
      className="font-display font-semibold"
      style={{ color: '#dde1ff', fontSize: '1.25rem', letterSpacing: '0.02em' }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BMI CARD CONTENT
───────────────────────────────────────────── */
function BmiDisplay({ bmi }) {
  const cat = bmiCategory(bmi);
  const pct = Math.max(0, Math.min(100, cat.pct));
  return (
    <div>
      {/* number + badge */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <span
          className="font-display font-bold"
          style={{ color: cat.color, fontSize: '2.2rem', lineHeight: 1, letterSpacing: '-0.01em' }}
        >
          {bmi.toFixed(1)}
        </span>
        <span
          className="font-mono-code"
          style={{
            color: cat.color,
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            background: `${cat.color}18`,
            border: `1px solid ${cat.color}35`,
            borderRadius: 5,
            padding: '3px 10px',
          }}
        >
          {cat.label.toUpperCase()}
        </span>
      </div>
      {/* progress track */}
      <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
        <div
          style={{
            position: 'absolute',
            left: 0, top: 0,
            width: `${pct}%`,
            height: '100%',
            background: cat.color,
            borderRadius: 2,
            opacity: 0.75,
            transition: 'width 0.4s ease',
          }}
        />
        {/* range labels */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 0, right: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {['10', '18.5', '25', '30', '40'].map(t => (
            <span key={t} className="font-mono-code" style={{ fontSize: '0.55rem', color: '#2e3155' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const GOAL_OPTIONS = [
  { value: 'Build Muscle',            label: 'Build Muscle' },
  { value: 'Lose Fat',                label: 'Lose Fat' },
  { value: 'Build Muscle + Lose Fat', label: 'Build Muscle + Lose Fat' },
  { value: 'Improve Endurance',       label: 'Improve Endurance' },
  { value: 'Increase Flexibility',    label: 'Increase Flexibility' },
  { value: 'Athletic Performance',    label: 'Athletic Performance' },
  { value: 'General Fitness',         label: 'General Fitness' },
  { value: 'Maintain Weight',         label: 'Maintain Weight' },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);

  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name:       user.name,
    age:        user.age      ?? '28',
    heightVal:  '178',
    heightUnit: 'cm',
    weightVal:  '78',
    weightUnit: 'kg',
    goal:       user.goal     ?? 'Build Muscle + Lose Fat',
    weeklyTarget:   user.weeklyTarget ?? 5,
    weeklyStepGoal: user.weeklyStepGoal ?? 10000,
  });

  const [snapshot, setSnapshot] = useState(form);

  const bmi = useMemo(() => {
    const h = heightToMetres(form.heightVal, form.heightUnit);
    const w = weightToKg(form.weightVal, form.weightUnit);
    if (!h || !w || isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;
    return w / (h * h);
  }, [form.heightVal, form.heightUnit, form.weightVal, form.weightUnit]);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const handleEdit   = () => { setSnapshot(form); setEditing(true); };
  const handleSave   = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500); };
  const handleCancel = () => { setForm(snapshot); setEditing(false); };

  const handleImageClick = () => {
    if (!editing) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const heightDisplay = form.heightUnit === 'cm'
    ? `${form.heightVal} cm`
    : (() => { const p = String(form.heightVal).split('.'); return `${p[0] || 0} ft ${p[1] || 0} in`; })();
  const weightDisplay = `${form.weightVal} ${form.weightUnit}`;

  const initials = form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  /* ── stat cards data ── */
  const stats = [
    { label: 'Total Workouts',  value: user.totalWorkouts ?? 87,  unit: '',         color: '#8b5cf6', icon: Dumbbell,   key: null },
    { label: 'Max Streak',      value: user.streak        ?? 12,  unit: 'days',     color: '#f59e0b', icon: Flame,      key: null },
    { label: 'Weekly Target',   value: form.weeklyTarget,          unit: 'sessions', color: '#06b6d4', icon: Trophy,     key: 'weeklyTarget' },
    { label: 'Weekly Step Goal',value: form.weeklyStepGoal.toLocaleString(), unit: 'steps', color: '#10b981', icon: Footprints, key: 'weeklyStepGoal' },
  ];

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* ── scroll container ── */}
      <div style={{ maxWidth: 940, margin: '0 auto', padding: '48px 36px 64px' }}>

        {/* ════════════════════════════════
            PAGE HEADER
        ════════════════════════════════ */}
        <div style={{ marginBottom: 40 }}>
          <h1
            className="font-display font-bold"
            style={{ color: '#e8eaff', fontSize: '2.2rem', letterSpacing: '0.08em', margin: 0 }}
          >
            YOUR PROFILE
          </h1>
          <p style={{ color: '#6b7196', fontSize: '1rem', marginTop: 8 }}>
            Personal details and fitness configuration
          </p>
        </div>

        {/* ════════════════════════════════
            HERO CARD
        ════════════════════════════════ */}
        <div
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
          style={{
            borderRadius: 18,
            border: `1px solid ${heroHovered ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.22)'}`,
            background: 'linear-gradient(140deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.04) 100%)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 48,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: heroHovered ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: heroHovered ? '0 12px 32px -12px rgba(124,58,237,0.3)' : 'none',
          }}
        >
          {/* ambient right glow */}
          <div style={{
            position: 'absolute', right: 0, top: 0, width: 320, height: '100%', pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 90% 40%, rgba(6,182,212,0.09) 0%, transparent 65%)',
          }} />

          {/* ── top zone: avatar + identity + edit button ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              padding: '40px 40px 32px',
              position: 'relative',
            }}
          >
            {/* avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                onClick={handleImageClick}
                style={{
                  width: 120, height: 120,
                  borderRadius: '50%',
                  background: profileImage
                    ? 'transparent'
                    : 'linear-gradient(145deg, #7c3aed 0%, #06b6d4 100%)',
                  boxShadow: '0 0 0 1px rgba(124,58,237,0.35), 0 0 32px rgba(124,58,237,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1.85rem',
                  color: 'white', letterSpacing: '0.04em', flexShrink: 0,
                  overflow: 'hidden',
                  cursor: editing ? 'pointer' : 'default',
                  position: 'relative',
                  transition: 'transform 0.3s ease',
                  transform: heroHovered ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
                {editing && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                    }}
                  >
                    <Camera size={24} style={{ color: 'white', opacity: 0.9 }} />
                  </div>
                )}
              </div>
              
              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* identity block */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="font-display font-bold"
                style={{ color: '#e8eaff', fontSize: '1.8rem', letterSpacing: '0.06em', marginBottom: 8 }}
              >
                {form.name.toUpperCase()}
              </div>
              <div
                className="font-mono-code"
                style={{ color: '#5a5f88', fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: 0 }}
              >
                {form.goal}
              </div>
              {/* REMOVED STREAK CHIP PER REQUEST */}
            </div>

            {/* edit controls — top-right */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="btn-ghost rounded-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleCancel}
                    className="btn-ghost rounded-lg"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: '0.9rem' }}
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-cyan rounded-lg"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>  
              )}
              {saved && (
                <div className="font-mono-code" style={{ color: '#10b981', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  ✓ CHANGES SAVED
                </div>
              )}
            </div>
          </div>

          {/* ── divider ── */}
          <div style={{ height: 1, background: 'rgba(124,58,237,0.1)', margin: '0 40px' }} />

          {/* ── bottom zone: 3 achievements in a horizontal bar ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '24px 32px 28px',
            }}
          >
            {[
              { icon: Flame,    color: '#f59e0b', value: '12-Day Streak', sub: 'Current Streak' },
              { icon: Dumbbell, color: '#8b5cf6', value: '87 Workouts',   sub: 'Logged Total'   },
              { icon: null,     color: '#10b981', value: '4.2 kg Lost',   sub: 'Since Jan 2025' },
            ].map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '10px 20px 10px 16px',
                  borderRight: i < 2 ? '1px solid rgba(124,58,237,0.1)' : 'none',
                }}
              >
                {a.icon && (
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: `${a.color}14`, border: `1px solid ${a.color}2a`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    transform: heroHovered ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: heroHovered ? `0 0 12px ${a.color}33` : 'none',
                  }}>
                    <a.icon size={18} style={{ color: a.color }} />
                  </div>
                )}
                {!a.icon && (
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: `${a.color}14`, border: `1px solid ${a.color}2a`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    transform: heroHovered ? 'scale(1.1)' : 'scale(1)',
                  }}>
                    📉
                  </div>
                )}
                <div>
                  <div
                    className="font-display font-bold"
                    style={{ color: a.color, fontSize: '1.1rem', letterSpacing: '0.04em', lineHeight: 1.2 }}
                  >
                    {a.value}
                  </div>
                  <div className="font-mono-code" style={{ color: '#3e4268', fontSize: '0.7rem', marginTop: 4 }}>
                    {a.sub.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════
            PERSONAL INFO
        ════════════════════════════════ */}
        <div style={{ marginBottom: 48 }}>
          <SectionEyebrow>Personal Info</SectionEyebrow>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Full Name */}
            <FieldCard label="Full Name" icon={User} color="#8b5cf6" editing={editing}>
              {editing
                ? <CyberInput value={form.name} onChange={set('name')} placeholder="Full name" />
                : <FieldValue>{form.name}</FieldValue>}
            </FieldCard>

            {/* Age */}
            <FieldCard label="Age" icon={Calendar} color="#06b6d4" editing={editing}>
              {editing
                ? <CyberInput value={form.age} onChange={set('age')} type="number" placeholder="Years" />
                : <FieldValue>{form.age} yrs</FieldValue>}
            </FieldCard>

            {/* Height */}
            <FieldCard label="Height" icon={Ruler} color="#f59e0b" editing={editing}>
              {editing ? (
                <div>
                  <UnitToggle value={form.heightUnit} options={['cm', 'ft']} onChange={set('heightUnit')} />
                  <CyberInput
                    value={form.heightVal}
                    onChange={set('heightVal')}
                    type="text"
                    placeholder={form.heightUnit === 'cm' ? 'e.g. 178' : 'e.g. 5.10'}
                  />
                  {form.heightUnit === 'ft' && (
                    <div className="font-mono-code" style={{ color: '#3e4268', fontSize: '0.65rem', marginTop: 8 }}>
                      Enter as feet.inches — 5.10 = 5 ft 10 in
                    </div>
                  )}
                </div>
              ) : <FieldValue>{heightDisplay}</FieldValue>}
            </FieldCard>

            {/* Weight */}
            <FieldCard label="Current Weight" icon={Weight} color="#10b981" editing={editing}>
              {editing ? (
                <div>
                  <UnitToggle value={form.weightUnit} options={['kg', 'lbs']} onChange={set('weightUnit')} />
                  <CyberInput
                    value={form.weightVal}
                    onChange={set('weightVal')}
                    type="number"
                    placeholder={form.weightUnit === 'kg' ? 'e.g. 78' : 'e.g. 172'}
                  />
                </div>
              ) : <FieldValue>{weightDisplay}</FieldValue>}
            </FieldCard>

            {/* Fitness Goal */}
            <FieldCard label="Fitness Goal" icon={Target} color="#ec4899" editing={editing}>
              {editing
                ? <CyberSelect value={form.goal} onChange={set('goal')} options={GOAL_OPTIONS} />
                : <FieldValue>{form.goal}</FieldValue>}
            </FieldCard>

            {/* BMI — special treatment */}
            <FieldCard label="Body Mass Index" icon={BarChart2} color="#c084fc" readOnly>
              {bmi !== null ? (
                <BmiDisplay bmi={bmi} />
              ) : (
                <div className="font-mono-code" style={{ color: '#3e4268', fontSize: '0.85rem' }}>
                  Enter height & weight above
                </div>
              )}
            </FieldCard>

          </div>
        </div>

        {/* ════════════════════════════════
            LIFETIME STATS
        ════════════════════════════════ */}
        <div>
          <SectionEyebrow>Lifetime Stats</SectionEyebrow>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {stats.map(s => {
              const [hovered, setHovered] = useState(false);
              return (
                <div
                  key={s.label}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(10,11,20,0.9)',
                    border: `1px solid ${hovered && !editing ? 'rgba(124,58,237,0.3)' : s.color + '1c'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hovered && !editing ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hovered && !editing ? `0 8px 24px -8px ${s.color}44` : 'none',
                  }}
                >
                  {/* top accent bar */}
                  <div style={{ 
                    height: 3, 
                    background: s.color, 
                    opacity: hovered ? 0.85 : 0.65,
                    transition: 'opacity 0.3s ease',
                    boxShadow: hovered ? `0 0 10px ${s.color}` : 'none'
                  }} />

                  <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* icon */}
                    <div style={{ marginBottom: 20 }}>
                      <s.icon size={20} style={{ 
                        color: s.color, 
                        opacity: hovered ? 0.9 : 0.6,
                        transition: 'opacity 0.3s ease',
                        transform: hovered ? 'scale(1.1)' : 'scale(1)'
                      }} />
                    </div>

                    {/* number */}
                    <div>
                      {editing && s.key ? (
                        <input
                          type="number"
                          value={form[s.key]}
                          onChange={e => set(s.key)(e.target.value)}
                          className="input-cyber rounded-lg"
                          style={{
                            background: 'rgba(6,7,14,0.7)',
                            color: s.color,
                            fontFamily: 'Orbitron, sans-serif',
                            fontWeight: 700,
                            fontSize: '1.6rem',
                            width: '100%',
                            padding: '6px 10px',
                            letterSpacing: '-0.01em',
                            marginBottom: 8,
                          }}
                        />
                      ) : (
                        <div
                          className="font-display font-bold"
                          style={{ color: s.color, fontSize: '2.1rem', lineHeight: 1, letterSpacing: '-0.01em', marginBottom: 8 }}
                        >
                          {s.value}
                        </div>
                      )}
                      {/* label + unit stacked */}
                      <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.75rem', letterSpacing: '0.07em', lineHeight: 1.5 }}>
                        {s.label.toUpperCase()}
                      </div>
                      {s.unit && (
                        <div className="font-mono-code" style={{ color: `${s.color}55`, fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                          {s.unit.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
