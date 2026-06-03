import { useState, useRef } from 'react';
import { api, mapScores } from '../api';
import { energyProfiles } from '../data/questions';

const ec = {
  blue:   { hex:'#3B82F6', bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.25)', badge:'bg-blue-500/15 text-blue-400 border border-blue-500/20',   dot:'bg-blue-500'   },
  green:  { hex:'#22C55E', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.25)',  badge:'bg-green-500/15 text-green-400 border border-green-500/20', dot:'bg-green-500'  },
  yellow: { hex:'#EAB308', bg:'rgba(234,179,8,0.1)',   border:'rgba(234,179,8,0.25)',  badge:'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20', dot:'bg-yellow-500' },
  red:    { hex:'#EF4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)',  badge:'bg-red-500/15 text-red-400 border border-red-500/20',       dot:'bg-red-500'    },
};
const names = { blue:'Cool Blue', green:'Earth Green', yellow:'Sunshine Yellow', red:'Fiery Red' };

function EnergyBars({ scores }) {
  const keys = ['blue','green','yellow','red'];
  return (
    <div className="space-y-2 mt-3">
      {keys.map(k => (
        <div key={k} className="flex items-center gap-3">
          <span className="text-xs text-white/30 w-28 flex-shrink-0">{names[k]}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width:`${Math.round(scores[k]||0)}%`, background: ec[k].hex }}/>
          </div>
          <span className="text-xs font-semibold w-8 text-right" style={{ color: ec[k].hex }}>
            {Math.round(scores[k]||0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// Sender email lookup — user types their own email to link their profile
function SenderSection({ user, onUserChange, onNeedRegister }) {
  const [email, setEmail]       = useState(user?.email || '');
  const [state, setState]       = useState(user ? 'found' : 'idle');
  const [errMsg, setErrMsg]     = useState('');
  const debRef                  = useRef(null);

  const lookup = async (val) => {
    const trimmed = val.trim();
    if (!trimmed.includes('@')) return;
    setState('loading'); setErrMsg('');

    try {
      // Step 1: get energy scores (always required — proves user has an assessment)
      const data = await api.getUserEnergy(trimmed);
      const scores = mapScores(data);

      // Step 2: try to get user id + full name via GET /api/user?email=
      // Falls back gracefully if endpoint not yet deployed
      let userId = data.userId || data.id || null;
      let userName = data.name || null;

      try {
        const userInfo = await api.getUserByEmail(trimmed);
        userId   = userInfo.id   || userId;
        userName = userInfo.name || userName;
      } catch {
        // GET /api/user not available yet — userId stays null
        // user can still analyze but will see a warning
      }

      // Final fallback for name: use part before @ if still empty
      if (!userName || userName.trim() === '') {
        userName = trimmed.split('@')[0];
      }

      onUserChange({
        id:    userId,
        name:  userName,
        email: trimmed,
        scores,
      });
      setState('found');
    } catch (err) {
      setState('not_found');
      const msg = err.message || '';
      if (msg.includes('No profile') || msg.includes('assessment')) {
        setErrMsg('This email is registered but has not completed the assessment yet. Please complete the assessment first.');
      } else {
        setErrMsg('No account found for this email. Please register and complete the assessment first.');
      }
      onUserChange(null);
    }
  };

  const onChange = (v) => {
    setEmail(v); setState('idle'); setErrMsg(''); onUserChange(null);
    if (debRef.current) clearTimeout(debRef.current);
    if (v.includes('@') && v.includes('.')) debRef.current = setTimeout(() => lookup(v), 700);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/40 text-xs uppercase tracking-widest">Your Profile</p>
        {state === 'not_found' && (
          <button onClick={onNeedRegister}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">
            Register &amp; take assessment →
          </button>
        )}
      </div>

      <div className="relative mb-2">
        <input type="email" placeholder="Enter your email to link your energy profile"
          value={email} onChange={e => onChange(e.target.value)}
          onBlur={() => state === 'idle' && lookup(email)}
          className="w-full px-4 py-3 pr-10 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
          style={{
            background:'rgba(255,255,255,0.04)',
            border: state==='found' ? '1px solid rgba(34,197,94,0.4)'
                  : state==='not_found' ? '1px solid rgba(239,68,68,0.3)'
                  : '1px solid rgba(255,255,255,0.08)'
          }}/>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {state==='loading'    && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/>}
          {state==='found'      && <span className="text-green-400 text-sm">✓</span>}
          {state==='not_found'  && <span className="text-red-400 text-sm">✕</span>}
        </div>
      </div>

      {errMsg && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-xs"
          style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5' }}>
          <span>⚠</span>
          <span>{errMsg} <button onClick={onNeedRegister} className="underline text-blue-400 ml-1">Register here</button></span>
        </div>
      )}

      {state==='found' && user && (
        <>
          <div className="flex items-center gap-3 mt-3 px-4 py-3 rounded-xl"
            style={{ background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.15)' }}>
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">
              {(user.name || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-white/35 text-xs">{user.email}</p>
            </div>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 whitespace-nowrap">
              Profile linked ✓
            </span>
          </div>
          {!user.id && (
            <div className="mt-2 px-3 py-2 rounded-lg text-xs flex items-start gap-2"
              style={{ background:'rgba(234,179,8,0.07)', border:'1px solid rgba(234,179,8,0.2)', color:'#fbbf24' }}>
              <span className="flex-shrink-0">⚠</span>
              <span>
                User ID not resolved. Add <code className="bg-white/10 px-1 rounded">UserController.java</code> to your backend
                (from the email-feature download) to enable <code className="bg-white/10 px-1 rounded">GET /api/user?email=</code>.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MessageDrafter({ user, onUserChange, onAnalyze, onNeedRegister }) {
  // Recipient lookup
  const [recipEmail, setRecipEmail]       = useState('');
  const [recipState, setRecipState]       = useState('idle');
  const [recipient,  setRecipient]        = useState(null);
  const [recipErr,   setRecipErr]         = useState('');
  const debRef2 = useRef(null);

  // Draft
  const [subject, setSubject]   = useState('');
  const [message, setMessage]   = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState('');

  const lookupRecip = async (val) => {
    const t = val.trim();
    if (!t.includes('@')) return;
    setRecipState('loading'); setRecipErr(''); setRecipient(null);
    try {
      const data = await api.getUserEnergy(t);
      const scores = mapScores(data);

      // Try to get real name from user endpoint
      let recipName = data.name || null;
      if (!recipName) {
        try {
          const userInfo = await api.getUserByEmail(t);
          recipName = userInfo.name;
        } catch { /* fallback below */ }
      }
      // Final fallback: use part before @
      if (!recipName || recipName.trim() === '') {
        recipName = t.split('@')[0];
      }

      setRecipient({ name: recipName, email: t, energy: scores.dominantEnergy, scores });
      setRecipState('found');
    } catch {
      setRecipState('not_found');
      setRecipErr('No profile found for this email. The recipient hasn\'t completed an assessment yet.');
    }
  };

  const onRecipChange = (v) => {
    setRecipEmail(v); setRecipState('idle'); setRecipient(null); setRecipErr('');
    if (debRef2.current) clearTimeout(debRef2.current);
    if (v.includes('@') && v.includes('.')) debRef2.current = setTimeout(() => lookupRecip(v), 700);
  };

  const profile = recipient ? energyProfiles[recipient.energy] : null;

  const canAnalyze = user && recipient && message.trim().length > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAnalyzeErr('');

    // Guard: user.id must exist — it comes from the database via register/getUserByEmail
    if (!user.id) {
      setAnalyzeErr('Could not resolve your user ID. Please re-enter your email above and wait for profile to load.');
      return;
    }

    setAnalyzing(true);
    try {
      // Only analyze (rewrite) — no send yet
      // Pass recipient.email so backend looks up RECIPIENT's energy profile
      const rewritten = await api.analyzeEmail(user.id, recipient.name, recipient.email, message);
      onAnalyze({ recipient, subject, message }, rewritten);
    } catch (e) {
      const msg = e.message || '';
      if (msg.includes('No assessment found')) {
        setAnalyzeErr('Your profile was linked but no assessment was found in the database. Please complete the assessment first.');
      } else {
        setAnalyzeErr(msg || 'Analysis failed. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Page header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', color:'#a78bfa' }}>
          ✦ AI Email Drafter
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3">Draft Your Message</h1>
        <p className="text-white/40 text-base">Enter recipient's email — AI rewrites your message to match their energy</p>
      </div>

      {/* ── Sender section ── */}
      <SenderSection user={user} onUserChange={onUserChange} onNeedRegister={onNeedRegister} />

      {/* ── Recipient lookup ── */}
      <div className="mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Recipient Email</p>

        <div className="relative mb-2">
          <input type="email" placeholder="Enter recipient's email to load their energy profile"
            value={recipEmail} onChange={e => onRecipChange(e.target.value)}
            onBlur={() => recipState==='idle' && lookupRecip(recipEmail)}
            className="w-full px-4 py-3 pr-10 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
            style={{
              background:'rgba(255,255,255,0.04)',
              border: recipState==='found' ? '1px solid rgba(34,197,94,0.4)'
                    : recipState==='not_found' ? '1px solid rgba(239,68,68,0.3)'
                    : '1px solid rgba(255,255,255,0.08)'
            }}/>
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {recipState==='loading'   && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/>}
            {recipState==='found'     && <span className="text-green-400 text-sm">✓</span>}
            {recipState==='not_found' && <span className="text-red-400 text-sm">✕</span>}
          </div>
        </div>

        {recipErr && (
          <p className="text-xs px-3 py-2 rounded-lg mt-1"
            style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5' }}>
            ⚠ {recipErr}
          </p>
        )}

        {/* Recipient profile card */}
        {recipState==='found' && recipient && profile && (
          <div className="mt-3 rounded-2xl overflow-hidden" style={{ border:`1px solid ${ec[recipient.energy].border}` }}>
            <div className="px-5 py-4 flex items-start gap-4"
              style={{ background: ec[recipient.energy].bg }}>
              <div className={`w-11 h-11 rounded-xl ${ec[recipient.energy].dot} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {recipient.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-white">{recipient.name}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ec[recipient.energy].badge}`}>
                    {names[recipient.energy]}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{profile.description}</p>
              </div>
            </div>
            <div className="px-5 py-4" style={{ background:'rgba(255,255,255,0.02)' }}>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Energy Scores</p>
              <EnergyBars scores={recipient.scores} />
              <div className="mt-4 px-3 py-2.5 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-yellow-400 text-xs mr-1.5">✦</span>
                <span className="text-xs text-white/30 uppercase tracking-widest mr-2">Communication tip:</span>
                <span className="text-sm text-white/65">{profile.communication}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Draft area ── */}
      <div className="mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Your Draft</p>
        <input type="text" placeholder="Subject (optional)"
          value={subject} onChange={e => setSubject(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none mb-3 transition-all"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}/>
        <textarea
          placeholder={recipient ? `Write your message to ${recipient.name}. AI will rewrite it to match their ${names[recipient.energy] || 'energy'} style.` : 'Look up a recipient above, then write your message here...'}
          value={message} onChange={e => setMessage(e.target.value)}
          disabled={!recipient}
          rows={6}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none resize-none transition-all"
          style={{
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)',
            opacity: recipient ? 1 : 0.4,
            cursor: recipient ? 'auto' : 'not-allowed'
          }}/>
        {message.length > 0 && <p className="text-right text-xs text-white/20 mt-1">{message.length} chars</p>}
      </div>

      {analyzeErr && (
        <div className="mb-4 px-4 py-3 rounded-xl text-xs"
          style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
          {analyzeErr}
        </div>
      )}

      {/* Analyze button */}
      <button onClick={handleAnalyze} disabled={!canAnalyze || analyzing}
        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
        style={canAnalyze && !analyzing
          ? { background:'linear-gradient(135deg,#3B82F6,#06b6d4)', color:'white', boxShadow:'0 0 30px rgba(59,130,246,0.3)' }
          : { background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.2)', cursor:'not-allowed' }}>
        {analyzing
          ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Analyzing...</>
          : !user ? '← Enter your email above first'
          : !recipient ? '← Look up recipient email first'
          : !message.trim() ? '← Write your message first'
          : `✦ Analyze & Rewrite for ${recipient.name}`}
      </button>
    </div>
  );
}
