import { useState, useMemo } from 'react';
import { 
  Plus, TrendingDown, TrendingUp, Activity, Flame, Footprints, 
  Target, Calendar, Trophy, Zap 
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { ProgressBar } from '../components/ui/index.jsx';
import { progressData } from '../data/mockData.js';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-4 py-3 shadow-lg"
        style={{
          background: 'rgba(13,15,26,0.98)',
          border: '1px solid rgba(124,58,237,0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="font-mono-code mb-1" style={{ color: '#8b90b8', fontSize: '0.65rem' }}>{label}</div>
        <div className="font-display font-bold flex items-baseline gap-1">
          <span style={{ color: payload[0].color || '#8b5cf6', fontSize: '1.1rem' }}>
            {payload[0].value.toLocaleString()}
          </span>
          <span style={{ color: '#4a4f72', fontSize: '0.75rem' }}>{unit}</span>
        </div>
      </div>
    );
  }
  return null;
};

function InsightCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div 
      className="rounded-lg p-4 flex items-start gap-4 transition-all"
      style={{
        background: 'rgba(13,15,26,0.6)',
        border: '1px solid rgba(255,255,255,0.03)',
      }}
    >
      <div 
        className="flex items-center justify-center rounded-md shrink-0 mt-0.5"
        style={{
          width: 36, height: 36,
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="font-mono-code mb-1" style={{ color: '#8b90b8', fontSize: '0.65rem' }}>
          {title.toUpperCase()}
        </div>
        <div className="font-display font-bold mb-0.5" style={{ color: '#e8eaff', fontSize: '1.1rem' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ color: '#4a4f72', fontSize: '0.7rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function LogForm({ title, icon: Icon, fields, color = '#8b5cf6', onLog }) {
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    setSaved(true);
    if (onLog) onLog(values);
    setTimeout(() => setSaved(false), 2000);
    setValues({});
  };

  return (
    <div
      className="flex flex-col rounded-xl p-6"
      style={{
        background: 'rgba(13,15,26,0.5)',
        border: `1px solid ${color}15`,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center rounded-md"
          style={{
            width: 32, height: 32,
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <div className="font-display font-bold" style={{ color: '#e8eaff', fontSize: '0.85rem', letterSpacing: '0.06em' }}>
          {title.toUpperCase()}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="font-mono-code mb-1.5 block" style={{ color: '#8b90b8', fontSize: '0.65rem' }}>
              {f.label}
            </label>
            <input
              type="number"
              className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#e8eaff',
              }}
              placeholder={f.placeholder}
              value={values[f.key] || ''}
              onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              onFocus={e => e.target.style.borderColor = `${color}60`}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-md py-3 text-xs mt-6 transition-all duration-300 font-bold"
        style={saved ? {
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.4)',
          color: '#10b981',
          fontFamily: 'Orbitron',
          letterSpacing: '0.05em',
        } : {
          background: `linear-gradient(to right, ${color}20, ${color}10)`,
          border: `1px solid ${color}40`,
          color: color,
          fontFamily: 'Orbitron',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={e => !saved && (e.target.style.background = `${color}30`)}
        onMouseLeave={e => !saved && (e.target.style.background = `linear-gradient(to right, ${color}20, ${color}10)`)}
      >
        {saved ? '✓ LOGGED' : 'SAVE LOG'}
      </button>
    </div>
  );
}

export default function Progress() {
  const [activeChart, setActiveChart] = useState('steps');

  const chartData = {
    steps: { data: progressData.steps, key: 'value', color: '#06b6d4', unit: 'steps', label: 'Daily Steps', type: 'bar' },
    calories: { data: progressData.calories, key: 'value', color: '#10b981', unit: 'kcal', label: 'Calories Eaten', type: 'bar' },
    weight: { data: progressData.weight, key: 'value', color: '#8b5cf6', unit: 'kg', label: 'Weekly Weight', type: 'line' },
  };

  const active = chartData[activeChart];
  const today = progressData.today;

  // Calculate dynamic insights based on mock data
  const insights = useMemo(() => {
    const stepsData = progressData.steps || [];
    const calData = progressData.calories || [];
    const weightData = progressData.weight || [];
    
    const avgSteps = Math.round(stepsData.reduce((acc, d) => acc + d.value, 0) / (stepsData.length || 1));
    const maxSteps = Math.max(...stepsData.map(d => d.value), 0);
    const avgCals = Math.round(calData.reduce((acc, d) => acc + d.value, 0) / (calData.length || 1));
    
    const firstWeight = weightData[0]?.value || 0;
    const lastWeight = weightData[weightData.length - 1]?.value || 0;
    const weightChange = lastWeight - firstWeight;

    return { avgSteps, maxSteps, avgCals, weightChange };
  }, []);

  return (
    <div style={{ background: '#0a0b12', minHeight: '100vh', color: '#e8eaff' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block rounded-full px-3 py-1 mb-3" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', fontSize: '0.65rem', color: '#a78bfa', letterSpacing: '0.05em' }}>
            ● MANUAL TRACKING
          </div>
          <h1 className="font-display font-bold mb-2" style={{ fontSize: '1.75rem', letterSpacing: '0.04em' }}>
            Progress Dashboard
          </h1>
          <p style={{ color: '#8b90b8', fontSize: '0.9rem' }}>
            Log your daily metrics and monitor your fitness trends.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: 'Steps Today',
              value: today.steps.toLocaleString(),
              goal: today.stepsGoal.toLocaleString(),
              pct: Math.min((today.steps / today.stepsGoal) * 100, 100),
              color: '#06b6d4',
              colorKey: 'cyan',
            },
            {
              label: 'Calories Eaten',
              value: today.calories.toLocaleString(),
              goal: today.caloriesGoal.toLocaleString(),
              pct: Math.min((today.calories / today.caloriesGoal) * 100, 100),
              color: '#10b981',
              colorKey: 'green',
            },
            {
              label: 'Current Weight',
              value: '78.0 kg',
              goal: 'Goal: 74.0 kg',
              pct: 60,
              color: '#8b5cf6',
              colorKey: 'violet',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-5"
              style={{
                background: 'rgba(13,15,26,0.8)',
                border: `1px solid ${stat.color}25`,
              }}
            >
              <div className="font-mono-code mb-2 flex justify-between items-center" style={{ color: '#8b90b8', fontSize: '0.65rem' }}>
                <span>{stat.label.toUpperCase()}</span>
                <span style={{ color: stat.color }}>{Math.round(stat.pct)}%</span>
              </div>
              <div className="font-display font-bold mb-1 tracking-tight" style={{ fontSize: '1.75rem' }}>
                {stat.value}
              </div>
              <div className="text-xs mb-4" style={{ color: '#4a4f72' }}>Target: {stat.goal}</div>
              <ProgressBar value={stat.pct} max={100} color={stat.colorKey} height={6} />
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-8 items-start" style={{ gridTemplateColumns: '1fr 340px' }}>

          {/* Left Column: Charts & Insights */}
          <div className="flex flex-col gap-6">
            
            {/* Chart Section */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'rgba(13,15,26,0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Chart Controls */}
              <div className="flex items-center justify-between mb-8">
                <div
                  className="flex gap-1 rounded-lg p-1"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {Object.entries(chartData).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setActiveChart(key)}
                      className="rounded-md px-5 py-2 text-xs transition-all duration-200"
                      style={activeChart === key ? {
                        background: `${val.color}15`,
                        color: val.color,
                        fontWeight: 600,
                        boxShadow: `inset 0 0 0 1px ${val.color}40`,
                      } : {
                        color: '#8b90b8',
                      }}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>

                {activeChart === 'weight' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {insights.weightChange <= 0 ? <TrendingDown size={14} color="#10b981" /> : <TrendingUp size={14} color="#ec4899" />}
                    <span className="font-mono-code" style={{ color: insights.weightChange <= 0 ? '#10b981' : '#ec4899', fontSize: '0.75rem' }}>
                      {Math.abs(insights.weightChange).toFixed(1)} kg {insights.weightChange <= 0 ? 'Lost' : 'Gained'}
                    </span>
                  </div>
                )}
              </div>

              {/* Chart Rendering */}
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {active.type === 'bar' ? (
                    <BarChart data={active.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} strokeDasharray="4 4" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4a4f72', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4a4f72', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                      />
                      <Tooltip 
                        content={<CustomTooltip unit={active.unit} />} 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      />
                      <Bar 
                        dataKey={active.key} 
                        radius={[4, 4, 0, 0]} 
                        barSize={36}
                      >
                        {active.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={active.color} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <LineChart data={active.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} strokeDasharray="4 4" />
                      <XAxis 
                        dataKey="week" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4a4f72', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                        dy={10}
                      />
                      <YAxis 
                        domain={['dataMin - 1', 'dataMax + 1']}
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4a4f72', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                      />
                      <Tooltip content={<CustomTooltip unit={active.unit} />} />
                      <Line 
                        type="monotone" 
                        dataKey={active.key} 
                        stroke={active.color} 
                        strokeWidth={3} 
                        dot={{ fill: '#0a0b12', stroke: active.color, strokeWidth: 2, r: 4 }} 
                        activeDot={{ fill: active.color, stroke: '#fff', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Insights Section */}
            <div>
              <h3 className="font-display font-bold mb-4 flex items-center gap-2" style={{ fontSize: '1rem', color: '#e8eaff' }}>
                <Zap size={18} color="#f59e0b" />
                Progress Insights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InsightCard 
                  title="Avg Daily Steps" 
                  value={insights.avgSteps.toLocaleString()} 
                  subtitle="This week"
                  icon={Footprints} 
                  color="#06b6d4" 
                />
                <InsightCard 
                  title="Best Day" 
                  value={insights.maxSteps.toLocaleString()} 
                  subtitle="Highest step count"
                  icon={Trophy} 
                  color="#f59e0b" 
                />
                <InsightCard 
                  title="Avg Calories" 
                  value={`${insights.avgCals.toLocaleString()} kcal`} 
                  subtitle="Daily average"
                  icon={Flame} 
                  color="#10b981" 
                />
                <InsightCard 
                  title="Consistency Streak" 
                  value="5 Days" 
                  subtitle="Active logging"
                  icon={Calendar} 
                  color="#8b5cf6" 
                />
              </div>
            </div>

          </div>

          {/* Right Column: Logging Forms */}
          <div className="flex flex-col gap-5 sticky top-6">
            <h3 className="font-display font-bold mb-1" style={{ fontSize: '1rem', color: '#e8eaff' }}>
              Daily Logs
            </h3>
            
            <div className="grid grid-rows-3 gap-5" style={{ height: 'calc(100vh - 200px)', minHeight: '650px' }}>
              <LogForm
                title="Log Steps"
                icon={Activity}
                color="#06b6d4"
                fields={[{ key: 'steps', label: 'TOTAL STEPS', placeholder: 'e.g. 8500' }]}
              />
              <LogForm
                title="Log Calories"
                icon={Flame}
                color="#10b981"
                fields={[{ key: 'calories', label: 'CALORIES INTAKE', placeholder: 'e.g. 1800' }]}
              />
              <LogForm
                title="Log Weight"
                icon={Target}
                color="#8b5cf6"
                fields={[{ key: 'weight', label: 'CURRENT WEIGHT (KG)', placeholder: 'e.g. 77.5' }]}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}