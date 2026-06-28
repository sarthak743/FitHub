import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import { suggestedPrompts } from '../data/mockData.js';

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const isError = msg.isError;

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: 'slideUp 0.18s ease-out both' }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 30,
          height: 30,
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
            : isError
              ? 'rgba(239,68,68,0.15)'
              : 'linear-gradient(135deg, #0891b2, #06b6d4)',
          boxShadow: isUser
            ? '0 0 10px rgba(var(--accent-violet-rgb),0.25)'
            : isError
              ? 'none'
              : '0 0 10px rgba(var(--accent-cyan-rgb),0.22)',
          flexShrink: 0,
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        {isUser
          ? <span style={{ color: 'white', fontSize: '0.6rem', fontFamily: 'Orbitron', fontWeight: 700 }}>AS</span>
          : isError
            ? <AlertCircle size={13} color="#f87171" />
            : <Bot size={13} color="white" />
        }
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: isUser ? '62%' : '74%',
          minWidth: 0,
          padding: '12px 16px',
          borderRadius: isUser ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
          background: isUser
            ? 'linear-gradient(135deg, rgba(var(--accent-violet-rgb),0.22), rgba(var(--accent-violet-bright-rgb),0.14))'
            : isError
              ? 'rgba(239,68,68,0.07)'
              : 'rgba(13,20,40,0.85)',
          border: isUser
            ? '1px solid rgba(var(--accent-violet-bright-rgb),0.28)'
            : isError
              ? '1px solid rgba(239,68,68,0.2)'
              : '1px solid rgba(var(--accent-cyan-rgb),0.12)',
        }}
      >
        {!isUser && !isError && (
          <div
            className="mb-2 inline-block"
            style={{
              fontSize: '0.5rem',
              fontFamily: 'Orbitron',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color:  'var(--accent-cyan)' ,
              background: 'rgba(var(--accent-cyan-rgb),0.08)',
              border: '1px solid rgba(var(--accent-cyan-rgb),0.18)',
              padding: '2px 7px',
              borderRadius: 3,
            }}
          >
            FITHUB AI COACH
          </div>
        )}
        <div
          style={{
            color: isError ? '#f87171' : '#dde1ff',
            fontSize: '0.875rem',
            lineHeight: 1.68,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {msg.content}
        </div>
        <div
          style={{
            color: '#363a58',
            fontSize: '0.52rem',
            fontFamily: 'monospace',
            marginTop: 6,
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4" style={{ alignItems: 'flex-start' }}>
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 30, height: 30,
          background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
          boxShadow: '0 0 10px rgba(var(--accent-cyan-rgb),0.22)',
          marginTop: 2,
        }}
      >
        <Bot size={13} color="white" />
      </div>
      <div
        style={{
          padding: '14px 18px',
          borderRadius: '4px 14px 14px 14px',
          background: 'rgba(13,20,40,0.85)',
          border: '1px solid rgba(var(--accent-cyan-rgb),0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background:  'var(--accent-cyan)' ,
              animation: `typingDot 1.1s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const SYSTEM_PROMPT = `You are FitHub AI Coach — a knowledgeable, motivating, and practical fitness assistant built into the FitHub app. Your role is to help users with:
- Workout guidance (exercise selection, sets/reps, progression)
- Nutrition advice (protein targets, calorie goals, meal suggestions)
- Form correction tips (posture, technique, common mistakes)
- Recovery guidance (rest days, sleep, muscle soreness)
- Goal setting and consistency strategies
- Beginner to intermediate fitness education

Your tone: direct, energetic, encouraging — like a coach who knows their stuff and keeps it real. Keep responses concise but complete. Use bullet points when listing multiple tips. Always be specific and practical.

User context: The user is Arjun Sharma, Intermediate level, goal is to Build Muscle + Lose Fat, currently at 78kg, target 74kg. They track steps, calories, and weekly weight on FitHub.`;

const WELCOME = {
  role: 'assistant',
  content: "Hey! I'm your FitHub AI Coach — ask me anything about workouts, nutrition, or form.\n\nWhat's on your mind today? 💪",
  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
};

const getTs = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export default function AICoach() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Count real exchanges (excludes the welcome message)
  const exchangeCount = messages.filter(m => m.role === 'user').length;

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = { role: 'user', content: userText, timestamp: getTs() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.content?.[0]?.text;

      if (!aiText) throw new Error('Empty response from API.');

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiText, timestamp: getTs() },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Connection error: ${err.message}\n\nPlease check your API key or try again.`,
          timestamp: getTs(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show chips: before first message and during early conversation
  const showChips = exchangeCount < 3;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.25; transform: scale(1); }
          30%            { opacity: 1;    transform: scale(1.25); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .chip-btn {
          background: rgba(var(--accent-violet-rgb),0.06);
          border: 1px solid rgba(var(--accent-violet-rgb),0.14);
          color: #7a80a8;
          font-family: Inter, sans-serif;
          font-size: 0.72rem;
          padding: 5px 11px;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .chip-btn:hover {
          background: rgba(var(--accent-violet-rgb),0.13);
          border-color: rgba(var(--accent-violet-bright-rgb),0.38);
          color: #c4c9f0;
        }
        .coach-scroll::-webkit-scrollbar { width: 3px; }
        .coach-scroll::-webkit-scrollbar-track { background: transparent; }
        .coach-scroll::-webkit-scrollbar-thumb { background: rgba(var(--accent-violet-rgb),0.18); border-radius: 2px; }
      `}</style>

      <div style={{
        background: 'var(--bg-base)',
        height: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 24px',
            borderBottom: '1px solid rgba(var(--accent-violet-rgb),0.11)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Bot size={16} color="white" />
          </div>

          <div>
            <div style={{
              fontFamily: 'Orbitron', fontWeight: 700,
              fontSize: '0.78rem', letterSpacing: '0.09em', color: '#dde1ff',
            }}>
              FITHUB AI COACH
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background:  'var(--accent-green)' , boxShadow: '0 0 5px #10b981',
              }} />
              <span style={{ fontFamily: 'monospace', color:  'var(--accent-green)' , fontSize: '0.56rem' }}>
                ONLINE · claude-sonnet-4-6
              </span>
            </div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.1em',
              color:  'var(--accent-cyan)' , background: 'rgba(var(--accent-cyan-rgb),0.08)',
              border: '1px solid rgba(var(--accent-cyan-rgb),0.22)', padding: '3px 8px', borderRadius: 3,
            }}>
              AI POWERED
            </span>
            {exchangeCount > 0 && (
              <span style={{ fontFamily: 'monospace', color: '#363a58', fontSize: '0.58rem' }}>
                {exchangeCount} {exchangeCount === 1 ? 'message' : 'messages'}
              </span>
            )}
          </div>
        </div>

        {/* ── Chat scroll area ── */}
        <div
          className="coach-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px 8px',
            minHeight: 0,
          }}
        >
          {/* Neural grid overlay — subtle aesthetic */}
          <div style={{ position: 'relative' }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
          </div>
          <div ref={bottomRef} style={{ height: 4 }} />
        </div>

        {/* ── Input area ── */}
        <div
          style={{
            flexShrink: 0,
            padding: '10px 24px 16px',
            borderTop: '1px solid rgba(var(--accent-violet-rgb),0.11)',
            background: 'rgba(var(--bg-base-rgb),0.6)',
          }}
        >
          {/* Prompt chips — always inside the input zone, above textarea */}
          {showChips && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 10,
            }}>
              {suggestedPrompts.slice(0, exchangeCount === 0 ? suggestedPrompts.length : 3).map((p, i) => (
                <button key={i} className="chip-btn" onClick={() => sendMessage(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Textarea + Send row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 10,
              background: 'rgba(var(--bg-surface-rgb),0.85)',
              border: '1px solid rgba(var(--accent-violet-rgb),0.22)',
              borderRadius: 13,
              padding: '10px 12px 10px 16px',
            }}
          >
            <textarea
              ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
              rows={1}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
              }}
              onKeyDown={handleKey}
              placeholder="Ask anything about fitness, nutrition, or form…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#dde1ff',
                lineHeight: 1.55,
                minHeight: 22,
                maxHeight: 110,
                padding: 0,
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                flexShrink: 0,
                width: 34, height: 34,
                borderRadius: 9,
                border: `1px solid ${input.trim() && !loading ? 'rgba(var(--accent-violet-bright-rgb),0.38)' : 'rgba(var(--accent-violet-rgb),0.1)'}`,
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                  : 'rgba(var(--accent-violet-rgb),0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              {loading
                ? <Loader2 size={13} color= "var(--text-dim)"  style={{ animation: 'spin 1s linear infinite' }} />
                : <Send size={13} color={input.trim() ? 'white' : '#363a58'} />
              }
            </button>
          </div>

          {/* Footer hint */}
          <div style={{
            marginTop: 8,
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.52rem',
            color: '#2e3252',
            letterSpacing: '0.06em',
          }}>
            POWERED BY ANTHROPIC · ENTER TO SEND · SHIFT+ENTER FOR NEW LINE
          </div>
        </div>
      </div>
    </>
  );
}