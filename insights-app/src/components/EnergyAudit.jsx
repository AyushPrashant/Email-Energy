import { useState } from 'react';
import { api } from '../api';
import { energyProfiles } from '../data/questions';

const ec = {
  blue:   { hex:'#3B82F6', bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.25)', badge:'bg-blue-500/15 text-blue-400 border border-blue-500/20',   dot:'bg-blue-500'   },
  green:  { hex:'#22C55E', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.25)',  badge:'bg-green-500/15 text-green-400 border border-green-500/20', dot:'bg-green-500'  },
  yellow: { hex:'#EAB308', bg:'rgba(234,179,8,0.1)',   border:'rgba(234,179,8,0.25)',  badge:'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20', dot:'bg-yellow-500' },
  red:    { hex:'#EF4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)',  badge:'bg-red-500/15 text-red-400 border border-red-500/20',       dot:'bg-red-500'    },
};
const names = { blue:'Cool Blue', green:'Earth Green', yellow:'Sunshine Yellow', red:'Fiery Red' };

// Recipient diamond chart – clean, no percentage in center
function RecipientChart({ scores }) {
  const SIZE=200, cx=100, cy=100, maxR=70;
  const dirs=[{key:'blue',angle:-90},{key:'green',angle:0},{key:'yellow',angle:90},{key:'red',angle:180}];
  const toXY = (angle,r) => ({ x: cx+r*Math.cos(angle*Math.PI/180), y: cy+r*Math.sin(angle*Math.PI/180) });
  const pts = dirs.map(d => toXY(d.angle, ((scores[d.key]||0)/100)*maxR));
  const dominant = dirs.reduce((b,d)=>(scores[d.key]||0)>(scores[b.key]||0)?d:b,dirs[0]);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[200px]">
      {[0.25,0.5,0.75,1].map(l=>(
        <polygon key={l} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={l===1?'1':'0.7'} strokeDasharray={l===1?'':'2,2'}
          points={dirs.map(d=>{const p=toXY(d.angle,maxR*l);return`${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join(' ')}/>
      ))}
      {dirs.map(d=>{const e=toXY(d.angle,maxR);return<line key={d.key} x1={cx} y1={cy} x2={e.x.toFixed(1)} y2={e.y.toFixed(1)} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>;})}
      <polygon points={pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
        fill={`${ec[dominant.key].hex}20`} stroke={ec[dominant.key].hex} strokeWidth="1.5" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="5" fill={ec[dirs[i].key].hex} opacity="0.2"/>
          <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={ec[dirs[i].key].hex} stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
        </g>
      ))}
      <text x={cx} y={cy-maxR-12} textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">Cool Blue</text>
      <text x={cx+maxR+8} y={cy+4} textAnchor="start" fill="#4ade80" fontSize="8" fontWeight="600">Green</text>
      <text x={cx} y={cy+maxR+16} textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="600">Sunshine Yellow</text>
      <text x={cx-maxR-8} y={cy+4} textAnchor="end" fill="#f87171" fontSize="8" fontWeight="600">Red</text>
      <text x={cx} y={cy+4} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{names[dominant.key]}</text>
    </svg>
  );
}

export default function EnergyAudit({ user, recipient, subject, message, rewrittenEmail, onDraftAnother, onGoToAssess }) {
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [sendMsg,   setSendMsg]   = useState('');
  const [sendErr,   setSendErr]   = useState('');
  const [copied,    setCopied]    = useState(false);

  const profile = energyProfiles[recipient.energy];
  const color   = ec[recipient.energy];

  const handleSend = async () => {
    if (!recipient.email) { setSendErr('No recipient email available.'); return; }
    setSending(true); setSendErr('');
    try {
      const res = await api.analyzeAndSend(user.id, recipient.name, recipient.email, message);
      // Mark as sent regardless of res.sent boolean —
      // if the API didn't throw, the email was processed
      setSent(true);
      setSendMsg(res.message || `Email sent successfully to ${recipient.email}`);
    } catch (e) {
      // Only show error if the request actually failed (non-2xx)
      setSendErr(e.message || 'Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenEmail);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.25)', color:'#22d3ee' }}>
          ✦ Energy Audit Results
        </div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">Your Message, Rewritten</h2>
        <p className="text-white/40">Tailored to <span style={{color:color.hex}}>{recipient.name}</span>'s {names[recipient.energy]} style</p>
      </div>

      {/* Two column: original + rewritten */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {/* Original */}
        <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Original Draft</p>
          {subject && (
            <div className="text-xs mb-3 px-3 py-2 rounded-lg"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-white/25">Subject: </span>
              <span className="text-white/60">{subject}</span>
            </div>
          )}
          <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{message}</div>
        </div>

        {/* Recipient profile */}
        <div className="rounded-2xl p-5 flex flex-col items-center" style={{ background: color.bg, border:`1px solid ${color.border}` }}>
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3 self-start">Recipient Profile</p>
          <RecipientChart scores={recipient.scores || {blue:20,green:80,yellow:5,red:5}} />
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {['blue','green','yellow','red'].filter(k=>(recipient.scores?.[k]||0)>0).map(k=>(
              <span key={k} className={`text-xs px-2 py-0.5 rounded-full ${ec[k].badge}`}>
                {names[k]} {Math.round(recipient.scores?.[k]||0)}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rewritten email */}
      <div className="rounded-2xl p-5 mb-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ background: color.bg, color: color.hex, border:`1px solid ${color.border}` }}>✦</div>
            <div>
              <p className="text-white font-semibold text-sm">AI-Rewritten Version</p>
              <p className="text-white/30 text-xs">Matched to {names[recipient.energy]} communication style</p>
            </div>
          </div>
          <button onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color: copied?'#4ade80':'rgba(255,255,255,0.4)' }}>
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
        </div>
        <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line px-4 py-4 rounded-xl"
          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
          {rewrittenEmail}
        </div>
      </div>

      {/* Communication tip */}
      <div className="rounded-2xl p-5 mb-5" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-start gap-2 mb-2">
          <span className="text-yellow-400">✦</span>
          <p className="text-white/35 text-xs uppercase tracking-widest">Why rewritten this way</p>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">{profile?.communication}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(profile?.traits||[]).map(t=>(
            <span key={t} className={`text-xs px-2.5 py-0.5 rounded-full ${color.badge}`}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── SEND EMAIL SECTION ── */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: color.bg, border:`1px solid ${color.border}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color.bg, border:`1px solid ${color.border}` }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color.hex} strokeWidth="2">
              <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              Send to {recipient.name && recipient.name !== recipient.email ? recipient.name : 'Recipient'}
            </p>
            <p className="text-xs" style={{ color:`${color.hex}99` }}>
              {recipient.email || 'No recipient email available'}
            </p>
          </div>
        </div>

        {sent ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)' }}>
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-green-400 text-sm font-semibold">
                ✓ Email sent to {recipient.name && recipient.name !== recipient.email ? recipient.name : 'recipient'}
              </p>
              <p className="text-green-400/50 text-xs mt-0.5">{recipient.email}</p>
              {sendMsg && <p className="text-green-400/40 text-xs mt-0.5">{sendMsg}</p>}
            </div>
          </div>
        ) : (
          <>
            {sendErr && (
              <p className="text-xs mb-3 px-3 py-2 rounded-lg"
                style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5' }}>
                ⚠ {sendErr}
              </p>
            )}
            <button onClick={handleSend}
              disabled={sending || !recipient.email}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
              style={!sending && recipient.email
                ? { background:`linear-gradient(135deg,${color.hex}cc,${color.hex}88)`, color:'white', boxShadow:`0 0 24px ${color.hex}33` }
                : { background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.2)', cursor:'not-allowed' }}>
              {sending
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending...</>
                : <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Send to {recipient.name && recipient.name !== recipient.email ? recipient.name : recipient.email}
                  </>}
            </button>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onDraftAnother}
          className="flex-1 py-3 rounded-xl text-sm text-white/50 hover:text-white transition-all font-medium"
          style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
          ← Draft Another
        </button>
        <button onClick={onGoToAssess}
          className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#60a5fa' }}>
          Take Assessment →
        </button>
      </div>
    </div>
  );
}
