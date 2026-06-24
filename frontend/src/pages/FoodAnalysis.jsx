import { useState, useRef } from 'react';
import { Upload, Camera, Zap, RotateCcw, ChevronRight } from 'lucide-react';
import { ProgressBar } from '../components/ui/index.jsx';

const mockFoodResults = {
  'uploaded-food': {
    name: 'Paneer Rice Bowl',
    confidence: 94,
    calories: 520,
    protein: 28,
    carbs: 62,
    fat: 18,
    items: [
      { name: 'Basmati Rice', calories: 240, protein: 5, carbs: 52, fat: 1, amount: '200g' },
      { name: 'Paneer', calories: 220, protein: 20, carbs: 3, fat: 15, amount: '100g' },
      { name: 'Gravy / Sauce', calories: 60, protein: 3, carbs: 7, fat: 2, amount: '50ml' },
    ],
    assessment: 'Good protein-carb balance. Paneer provides quality protein. Consider reducing sauce for fewer calories.',
    rating: 'balanced',
  }
};

const sampleFoods = [
  { emoji: '🥗', name: 'Salad Bowl', calories: 320, protein: 18 },
  { emoji: '🍗', name: 'Chicken Breast', calories: 280, protein: 53 },
  { emoji: '🥛', name: 'Protein Shake', calories: 180, protein: 30 },
  { emoji: '🍚', name: 'Paneer Rice', calories: 520, protein: 28 },
];

function NutrientBar({ label, value, max, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono-code" style={{ color: '#8b90b8', fontSize: '0.62rem' }}>{label}</span>
        <span className="font-mono-code font-bold" style={{ color: '#e8eaff', fontSize: '0.62rem' }}>
          {value}g
        </span>
      </div>
      <ProgressBar value={value} max={max} color={color} height={5} />
    </div>
  );
}

export default function FoodAnalysis() {
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(sampleFoods.slice(0, 3));
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(mockFoodResults['uploaded-food']);
    }, 2200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setImageUrl(null);
    setResult(null);
    setAnalyzing(false);
  };

  const ratingColors = {
    balanced: '#10b981',
    high_protein: '#8b5cf6',
    high_carb: '#f59e0b',
    high_fat: '#ec4899',
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <div className="px-7 py-7">

        {/* Header */}
        <div className="mb-6">
          <div className="chip mb-2">· COMPUTER VISION ACTIVE</div>
          <h1 className="font-display font-bold mb-1" style={{ color: '#e8eaff', fontSize: '1.3rem', letterSpacing: '0.08em' }}>
            FOOD ANALYSIS
          </h1>
          <p className="text-sm" style={{ color: '#8b90b8' }}>
            Upload a photo — AI detects food, estimates calories and protein
          </p>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: result ? '1fr 340px' : '1fr 340px' }}>

          {/* Upload + Result */}
          <div className="flex flex-col gap-5">

            {/* Upload zone */}
            {!imageUrl && (
              <div
                className={`upload-zone rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer ${dragOver ? 'drag-over' : ''}`}
                style={{ minHeight: 320 }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <div
                  className="flex items-center justify-center rounded-full mb-5"
                  style={{
                    width: 72, height: 72,
                    background: 'rgba(124,58,237,0.1)',
                    border: '2px solid rgba(124,58,237,0.2)',
                  }}
                >
                  <Camera size={28} style={{ color: '#8b5cf6' }} />
                </div>
                <div className="font-display font-bold mb-2" style={{ color: '#e8eaff', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
                  DROP YOUR MEAL PHOTO
                </div>
                <p className="text-sm mb-4" style={{ color: '#8b90b8' }}>
                  Snap a photo of your meal and let AI analyze it instantly
                </p>
                <button className="btn-primary rounded-lg px-5 py-2.5 text-xs">
                  Choose Photo
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            )}

            {/* How It Works */}
            {!imageUrl && (
              <div
                className="rounded-lg p-5"
                style={{
                  background: 'rgba(13,15,26,0.8)',
                  border: '1px solid rgba(124,58,237,0.12)',
                }}
              >
                <div className="font-display font-bold mb-4" style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                  HOW IT WORKS
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { step: '01', title: 'CAPTURE', desc: 'Snap a photo of your meal using your phone camera', icon: '📸' },
                    { step: '02', title: 'ANALYZE', desc: 'AI identifies food items and estimates portions', icon: '🔬' },
                    { step: '03', title: 'TRACK', desc: 'Nutrition data logged to your daily tracker', icon: '📊' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="flex items-center justify-center rounded-lg mx-auto mb-3"
                        style={{
                          width: 48, height: 48,
                          background: 'rgba(124,58,237,0.08)',
                          border: '1px solid rgba(124,58,237,0.15)',
                          fontSize: '1.3rem',
                        }}
                      >
                        {s.icon}
                      </div>
                      <div className="font-mono-code mb-1" style={{ color: '#8b5cf6', fontSize: '0.55rem' }}>
                        STEP {s.step}
                      </div>
                      <div className="font-display font-bold mb-1" style={{ color: '#e8eaff', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        {s.title}
                      </div>
                      <div className="text-xs" style={{ color: '#8b90b8', lineHeight: 1.5 }}>
                        {s.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded image */}
            {imageUrl && !analyzing && !result && (
              <div
                className="rounded-xl overflow-hidden relative"
                style={{ border: '1px solid rgba(124,58,237,0.2)' }}
              >
                <img src={imageUrl} alt="Food" className="w-full object-cover" style={{ maxHeight: 320 }} />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.65rem' }}>
                    PROCESSING...
                  </div>
                </div>
              </div>
            )}

            {/* Analyzing state */}
            {analyzing && (
              <div
                className="rounded-xl p-8 flex flex-col items-center"
                style={{
                  background: 'rgba(13,15,26,0.9)',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}
              >
                {imageUrl && (
                  <div
                    className="relative rounded-lg overflow-hidden mb-6"
                    style={{ width: '100%', maxWidth: 320 }}
                  >
                    <img src={imageUrl} alt="Food" className="w-full object-cover" style={{ height: 200 }} />
                    {/* Scanning line */}
                    <div
                      className="absolute inset-x-0"
                      style={{
                        height: 2,
                        background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
                        boxShadow: '0 0 8px #06b6d4',
                        animation: 'data-stream 1.5s linear infinite',
                        top: 0,
                      }}
                    />
                    {/* Scan overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(180deg, rgba(6,182,212,0.05), transparent, rgba(124,58,237,0.05))',
                      }}
                    />
                    {/* HUD corners */}
                    <div className="absolute top-2 left-2" style={{ width: 14, height: 14, borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' }} />
                    <div className="absolute top-2 right-2" style={{ width: 14, height: 14, borderTop: '2px solid #06b6d4', borderRight: '2px solid #06b6d4' }} />
                    <div className="absolute bottom-2 left-2" style={{ width: 14, height: 14, borderBottom: '2px solid #7c3aed', borderLeft: '2px solid #7c3aed' }} />
                    <div className="absolute bottom-2 right-2" style={{ width: 14, height: 14, borderBottom: '2px solid #7c3aed', borderRight: '2px solid #7c3aed' }} />
                  </div>
                )}
                <div className="font-display font-bold mb-1" style={{ color: '#e8eaff', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                  ANALYZING MEAL...
                </div>
                {[
                  'Identifying food items',
                  'Estimating portions',
                  'Computing nutrition',
                  'Finalizing analysis',
                ].map((step, i) => (
                  <div key={step} className="font-mono-code mt-1" style={{ color: i === 2 ? '#8b5cf6' : '#4a4f72', fontSize: '0.62rem' }}>
                    {i <= 2 ? '✓' : '◉'} {step}
                  </div>
                ))}
              </div>
            )}

            {/* Result */}
            {result && (
              <div>
                {/* Image + header */}
                {imageUrl && (
                  <div
                    className="relative rounded-xl overflow-hidden mb-5"
                    style={{ border: '1px solid rgba(10,185,129,0.2)' }}
                  >
                    <img src={imageUrl} alt="Food" className="w-full object-cover" style={{ maxHeight: 220 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="rounded px-2 py-0.5"
                          style={{
                            background: 'rgba(16,185,129,0.2)',
                            border: '1px solid rgba(16,185,129,0.4)',
                            color: '#10b981',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.6rem',
                          }}
                        >
                          {result.confidence}% CONFIDENCE
                        </div>
                      </div>
                      <div className="font-display font-bold mt-1" style={{ color: '#e8eaff', fontSize: '1.1rem' }}>
                        {result.name}
                      </div>
                    </div>
                  </div>
                )}

                {/* Macro summary */}
                <div
                  className="grid grid-cols-4 gap-3 mb-5"
                >
                  {[
                    { label: 'CALORIES', value: result.calories, unit: 'kcal', color: '#f59e0b' },
                    { label: 'PROTEIN', value: result.protein, unit: 'g', color: '#8b5cf6' },
                    { label: 'CARBS', value: result.carbs, unit: 'g', color: '#06b6d4' },
                    { label: 'FAT', value: result.fat, unit: 'g', color: '#ec4899' },
                  ].map(m => (
                    <div
                      key={m.label}
                      className="rounded-lg p-3 text-center"
                      style={{
                        background: 'rgba(13,15,26,0.8)',
                        border: `1px solid ${m.color}20`,
                      }}
                    >
                      <div className="font-display font-bold" style={{ color: m.color, fontSize: '1.2rem' }}>
                        {m.value}
                      </div>
                      <div className="font-mono-code" style={{ color: m.color, fontSize: '0.55rem' }}>{m.unit}</div>
                      <div className="font-mono-code mt-0.5" style={{ color: '#4a4f72', fontSize: '0.52rem' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Items breakdown */}
                <div
                  className="rounded-lg p-4 mb-4"
                  style={{
                    background: 'rgba(13,15,26,0.8)',
                    border: '1px solid rgba(124,58,237,0.12)',
                  }}
                >
                  <div className="font-mono-code mb-3" style={{ color: '#4a4f72', fontSize: '0.6rem' }}>
                    DETECTED ITEMS
                  </div>
                  {result.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                      style={{ borderBottom: i < result.items.length - 1 ? '1px solid rgba(124,58,237,0.08)' : 'none' }}
                    >
                      <div>
                        <div className="text-sm font-medium" style={{ color: '#e8eaff' }}>{item.name}</div>
                        <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.58rem' }}>{item.amount}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-semibold" style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                          {item.calories} kcal
                        </div>
                        <div className="font-mono-code" style={{ color: '#8b5cf6', fontSize: '0.58rem' }}>
                          {item.protein}g protein
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI assessment */}
                <div
                  className="rounded-lg p-4 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(6,182,212,0.04))',
                    border: `1px solid ${ratingColors[result.rating]}25`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={12} style={{ color: ratingColors[result.rating] }} />
                    <div className="font-mono-code" style={{ color: ratingColors[result.rating], fontSize: '0.6rem' }}>
                      AI ASSESSMENT · {result.rating.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: '#c4c8e8', lineHeight: 1.6, fontSize: '0.82rem' }}>
                    {result.assessment}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={reset} className="btn-ghost rounded px-4 py-2 text-xs flex items-center gap-1">
                    <RotateCcw size={10} /> New Photo
                  </button>
                  <button className="btn-cyan rounded px-5 py-2 text-xs">
                    Log This Meal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-5" style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>

            {/* Macro tracker today */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'rgba(13,15,26,0.8)',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <div className="font-display font-bold mb-4" style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                TODAY'S NUTRITION
              </div>
              <div className="flex flex-col gap-3">
                <NutrientBar label="PROTEIN" value={112} max={150} color="violet" />
                <NutrientBar label="CARBS" value={180} max={250} color="cyan" />
                <NutrientBar label="FAT" value={52} max={75} color="amber" />
                <NutrientBar label="CALORIES" value={1820} max={2200} color="green" />
              </div>
            </div>

            {/* Recent meals */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'rgba(13,15,26,0.8)',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <div className="font-display font-bold mb-4" style={{ color: '#e8eaff', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                RECENT MEALS
              </div>
              <div className="flex flex-col gap-2">
                {sampleFoods.map((food, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded p-3"
                    style={{
                      background: 'rgba(124,58,237,0.05)',
                      border: '1px solid rgba(124,58,237,0.08)',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{food.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium" style={{ color: '#e8eaff' }}>{food.name}</div>
                      <div className="font-mono-code" style={{ color: '#4a4f72', fontSize: '0.58rem' }}>
                        {food.protein}g protein
                      </div>
                    </div>
                    <div className="font-display font-semibold" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
                      {food.calories}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
