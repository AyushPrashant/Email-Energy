import { useState } from 'react';
import { api, mapScores } from '../api';

export default function Register({ onRegistered }) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) { setError('Please enter both your name and email.'); return; }
    setError(''); setLoading(true);
    try {
      const user = await api.register(name.trim(), email.trim());
      let existingEnergy = null;
      try { existingEnergy = await api.getUserEnergy(email.trim()); } catch {}
      if (existingEnergy?.dominantEnergy) {
        onRegistered(user, mapScores(existingEnergy), true);
      } else {
        onRegistered(user, null, false);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-10 max-w-lg">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5"
          style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)', color:'#60a5fa' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
          Insights Discovery Platform
        </div>
        <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
          Discover Your<br/>
          <span style={{ background:'linear-gradient(135deg,#60a5fa,#22d3ee,#4ade80)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Energy Profile
          </span>
        </h1>
        <p className="text-white/45 text-base leading-relaxed">
          A 10-minute assessment revealing your communication style and how to connect better with every personality type.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 mb-8">
        {[['~10 min','to complete'],['30','questions'],['4','energy types']].map(([val,lbl])=>(
          <div key={lbl} className="text-center">
            <div className="font-display font-bold text-2xl text-white">{val}</div>
            <div className="text-white/25 text-xs mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="w-full max-w-lg">
        <div className="rounded-2xl p-6" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs text-white/35 uppercase tracking-widest mb-2">Your Name</label>
              <input type="text" placeholder="e.g. Ayush"
                value={name} onChange={e=>setName(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}/>
            </div>
            <div>
              <label className="block text-xs text-white/35 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" placeholder="ayush@gmail.com"
                value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}/>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-xs"
              style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={!loading
              ? { background:'linear-gradient(135deg,#3B82F6,#06b6d4)', color:'white', boxShadow:'0 0 30px rgba(59,130,246,0.3)' }
              : { background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.2)', cursor:'not-allowed' }}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Checking...</>
              : 'Start Assessment →'}
          </button>
        </div>
      </div>
    </div>
  );
}
