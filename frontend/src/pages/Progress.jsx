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
          background: 'rgba(var(--bg-surface-rgb),0.98)',
          border: '1px solid rgba(var(--accent-violet-rgb),0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="font-mono-code mb-1" style={{ color:  'var(--text-secondary)' , fontSize: '0.65rem' }}>{label}</div>
        <div className="font-display font-bold flex items-baseline gap-1">
          <span style={{ color: payload[0].color ||  'var(--accent-violet-bright)' , fontSize: '1.1rem' }}>
            {payload[0].value.toLocaleString()}
          </span>
          <span style={{ color:  'var(--text-dim)' , fontSize: '0.75rem' }}>{unit}</span>
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
        background: 'rgba(var(--bg-surface-rgb),0.6)',
        border: '1px solid rgba(255,255,255,0.03)',
      }}
    >
      <div 
        className="flex items-center justify-center rounded-md shrink-0 mt-0.5"
        style={{
          width: 36, height: 36,
          background: `linear-gradient(135deg, ${window.themeColor(color, 0.15)}, ${window.themeColor(color, 0.05)})`,
          border: `1px solid ${window.themeColor(color, 0.3)}`,
        }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="font-mono-code mb-1" style={{ color:  'var(--text-secondary)' , fontSize: '0.65rem' }}>
          {title.toUpperCase()}
        </div>
        <div className="font-display font-bold mb-0.5" style={{ color:  'var(--text-primary)' , fontSize: '1.1rem' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ color:  'var(--text-dim)' , fontSize: '0.7rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function LogForm({ title, icon: Icon, fields, color =  'var(--accent-violet-bright)' , onLog }) {
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
        background: 'rgba(var(--bg-surface-rgb),0.5)',
        border: `1px solid ${window.themeColor(color, 0.15)}`,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center rounded-md"
          style={{
            width: 32, height: 32,
            background: `${window.themeColor(color, 0.15)}`,
            border: `1px solid ${window.themeColor(color, 0.3)}`,
          }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <div className="font-display font-bold" style={{ color:  'var(--text-primary)' , fontSize: '0.85rem', letterSpacing: '0.06em' }}>
          {title.toUpperCase()}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="font-mono-code mb-1.5 block" style={{ color:  'var(--text-secondary)' , fontSize: '0.65rem' }}>
              {f.label}
            </label>
            <input
              type="number"
              className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                color:  'var(--text-primary)' ,
              }}
              placeholder={f.placeholder}
              value={values[f.key] || ''}
              onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              onFocus={e => e.target.style.borderColor = `${window.themeColor(color, 0.6)}`}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-md py-3 text-xs mt-6 transition-all duration-300 font-bold"
        style={saved ? {
          background: 'rgba(var(--accent-green-rgb),0.15)',
          border: '1px solid rgba(var(--accent-green-rgb),0.4)',
          color:  'var(--accent-green)' ,
          fontFamily: 'Orbitron',
          letterSpacing: '0.05em',
        } : {
          background: `linear-gradient(to right, ${window.themeColor(color, 0.2)}, ${window.themeColor(color, 0.1)})`,
          border: `1px solid ${window.themeColor(color, 0.4)}`,
          color: color,
          fontFamily: 'Orbitron',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={e => !saved && (e.target.style.background = `${window.themeColor(color, 0.3)}`)}
        onMouseLeave={e => !saved && (e.target.style.background = `linear-gradient(to right, ${window.themeColor(color, 0.2)}, ${window.themeColor(color, 0.1)})`)}
      >
        {saved ? '✓ LOGGED' : 'SAVE LOG'}
      </button>
    </div>
  );
}

export default function Progress() {
  const [activeChart, setActiveChart] = useState('steps');

  const chartData = {
    steps: { data: progressData.steps, key: 'value', color:  'var(--accent-cyan)' , unit: 'steps', label: 'Daily Steps', type: 'bar' },
    calories: { data: progressData.calories, key: 'value', color:  'var(--accent-green)' , unit: 'kcal', label: 'Calories Eaten', type: 'bar' },
    weight: { data: progressData.weight, key: 'value', color:  'var(--accent-violet-bright)' , unit: 'kg', label: 'Weekly Weight', type: 'line' },
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
    <div style={{ background: '#0a0b12', minHeight: '100vh', color:  'var(--text-primary)'  }}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block rounded-full px-3 py-1 mb-3" style={{ background: 'rgba(var(--accent-violet-rgb),0.1)', border: '1px solid rgba(var(--accent-violet-rgb),0.2)', fontSize: '0.65rem', color: '#a78bfa', letterSpacing: '0.05em' }}>
            ● MANUAL TRACKING
          </div>
          <h1 className="font-display font-bold mb-2" style={{ fontSize: '1.75rem', letterSpacing: '0.04em' }}>
            Progress Dashboard
          </h1>
          <p style={{ color:  'var(--text-secondary)' , fontSize: '0.9rem' }}>
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
              color:  'var(--accent-cyan)' ,
              colorKey: 'cyan',
            },
            {
              label: 'Calories Eaten',
              value: today.calories.toLocaleString(),
              goal: today.caloriesGoal.toLocaleString(),
              pct: Math.min((today.calories / today.caloriesGoal) * 100, 100),
              color:  'var(--accent-green)' ,
              colorKey: 'green',
            },
            {
              label: 'Current Weight',
              value: '78.0 kg',
              goal: 'Goal: 74.0 kg',
              pct: 60,
              color:  'var(--accent-violet-bright)' ,
              colorKey: 'violet',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-5"
              style={{
                background: 'rgba(var(--bg-surface-rgb),0.8)',
                border: `1px solid ${window.themeColor(stat.color, 0.25)}`,
              }}
            >
              <div className="font-mono-code mb-2 flex justify-between items-center" style={{ color:  'var(--text-secondary)' , fontSize: '0.65rem' }}>
                <span>{stat.label.toUpperCase()}</span>
                <span style={{ color: stat.color }}>{Math.round(stat.pct)}%</span>
              </div>
              <div className="font-display font-bold mb-1 tracking-tight" style={{ fontSize: '1.75rem' }}>
                {stat.value}
              </div>
              <div className="text-xs mb-4" style={{ color:  'var(--text-dim)'  }}>Target: {stat.goal}</div>
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
                background: 'rgba(var(--bg-surface-rgb),0.6)',
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
                        background: `${window.themeColor(val.color, 0.15)}`,
                        color: val.color,
                        fontWeight: 600,
                        boxShadow: `inset 0 0 0 1px ${window.themeColor(val.color, 0.4)}`,
                      } : {
                        color:  'var(--text-secondary)' ,
                      }}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>

                {activeChart === 'weight' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {insights.weightChange <= 0 ? <TrendingDown size={14} color= "var(--accent-green)"  /> : <TrendingUp size={14} color= "var(--accent-pink)"  />}
                    <span className="font-mono-code" style={{ color: insights.weightChange <= 0 ?  'var(--accent-green)'  :  'var(--accent-pink)' , fontSize: '0.75rem' }}>
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
                        tick={{ fill:  'var(--text-dim)' , fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill:  'var(--text-dim)' , fontSize: 11, fontFamily: 'JetBrains Mono' }} 
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
                        tick={{ fill:  'var(--text-dim)' , fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                        dy={10}
                      />
                      <YAxis 
                        domain={['dataMin - 1', 'dataMax + 1']}
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill:  'var(--text-dim)' , fontSize: 11, fontFamily: 'JetBrains Mono' }} 
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
              <h3 className="font-display font-bold mb-4 flex items-center gap-2" style={{ fontSize: '1rem', color:  'var(--text-primary)'  }}>
                <Zap size={18} color= "var(--accent-amber)"  />
                Progress Insights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InsightCard 
                  title="Avg Daily Steps" 
                  value={insights.avgSteps.toLocaleString()} 
                  subtitle="This week"
                  icon={Footprints} 
                  color= "var(--accent-cyan)"  
                />
                <InsightCard 
                  title="Best Day" 
                  value={insights.maxSteps.toLocaleString()} 
                  subtitle="Highest step count"
                  icon={Trophy} 
                  color= "var(--accent-amber)"  
                />
                <InsightCard 
                  title="Avg Calories" 
                  value={`${insights.avgCals.toLocaleString()} kcal`} 
                  subtitle="Daily average"
                  icon={Flame} 
                  color= "var(--accent-green)"  
                />
                <InsightCard 
                  title="Consistency Streak" 
                  value="5 Days" 
                  subtitle="Active logging"
                  icon={Calendar} 
                  color= "var(--accent-violet-bright)"  
                />
              </div>
            </div>

          </div>

          {/* Right Column: Logging Forms */}
          <div className="flex flex-col gap-5 sticky top-6">
            <h3 className="font-display font-bold mb-1" style={{ fontSize: '1rem', color:  'var(--text-primary)'  }}>
              Daily Logs
            </h3>
            
            <div className="grid grid-rows-3 gap-5" style={{ height: 'calc(100vh - 200px)', minHeight: '650px' }}>
              <LogForm
                title="Log Steps"
                icon={Activity}
                color= "var(--accent-cyan)" 
                fields={[{ key: 'steps', label: 'TOTAL STEPS', placeholder: 'e.g. 8500' }]}
              />
              <LogForm
                title="Log Calories"
                icon={Flame}
                color= "var(--accent-green)" 
                fields={[{ key: 'calories', label: 'CALORIES INTAKE', placeholder: 'e.g. 1800' }]}
              />
              <LogForm
                title="Log Weight"
                icon={Target}
                color= "var(--accent-violet-bright)" 
                fields={[{ key: 'weight', label: 'CURRENT WEIGHT (KG)', placeholder: 'e.g. 77.5' }]}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}