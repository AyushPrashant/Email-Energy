import { energyProfiles } from '../data/questions';

const energyColors = {
  blue:   { hex:'#3B82F6', bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.25)', badge:'bg-blue-500/15 text-blue-400 border border-blue-500/20',   bar:'bg-blue-500'   },
  green:  { hex:'#22C55E', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.25)',  badge:'bg-green-500/15 text-green-400 border border-green-500/20', bar:'bg-green-500'  },
  yellow: { hex:'#EAB308', bg:'rgba(234,179,8,0.1)',   border:'rgba(234,179,8,0.25)',  badge:'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20', bar:'bg-yellow-500' },
  red:    { hex:'#EF4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)',  badge:'bg-red-500/15 text-red-400 border border-red-500/20',       bar:'bg-red-500'    },
};
const names = { blue:'Cool Blue', green:'Earth Green', yellow:'Sunshine Yellow', red:'Fiery Red' };

// Improved diamond chart — shows energy name at peak axis, no percentage in center
function DiamondChart({ scores }) {
  const SIZE = 240, cx = 120, cy = 120, maxR = 80;
  const dirs = [
    { key:'blue',   angle:-90 },
    { key:'green',  angle:0   },
    { key:'yellow', angle:90  },
    { key:'red',    angle:180 },
  ];

  const toXY = (angle, r) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const pts = dirs.map(d => toXY(d.angle, ((scores[d.key] || 0) / 100) * maxR));
  const polyStr = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const dominant = dirs.reduce((best, d) => scores[d.key] > scores[best.key] ? d : best, dirs[0]);
  const domColor = energyColors[dominant.key].hex;

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[240px]">
      {/* Grid rings */}
      {gridLevels.map(l => (
        <polygon key={l}
          points={dirs.map(d => { const p = toXY(d.angle, maxR*l); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={l===1?'1.5':'0.8'}
          strokeDasharray={l===1?'':'3,3'}/>
      ))}
      {/* Axis lines */}
      {dirs.map(d => {
        const end = toXY(d.angle, maxR);
        return <line key={d.key} x1={cx} y1={cy} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>;
      })}

      {/* Score area */}
      <polygon points={polyStr}
        fill={`${domColor}22`} stroke={domColor} strokeWidth="2"
        strokeLinejoin="round" opacity="0.9"/>

      {/* Dots at each energy point */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="6"
            fill={energyColors[dirs[i].key].hex} opacity="0.25"/>
          <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3.5"
            fill={energyColors[dirs[i].key].hex} stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
        </g>
      ))}

      {/* Axis labels */}
      <text x={cx} y={cy-maxR-14} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">Cool Blue</text>
      <text x={cx+maxR+10} y={cy+4} textAnchor="start" fill="#4ade80" fontSize="9" fontWeight="600">Earth Green</text>
      <text x={cx} y={cy+maxR+18} textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="600">Sunshine Yellow</text>
      <text x={cx-maxR-10} y={cy+4} textAnchor="end" fill="#f87171" fontSize="9" fontWeight="600">Fiery Red</text>

      {/* Center: show dominant energy name */}
      <text x={cx} y={cy-4} textAnchor="middle" fill="white" fontSize="9" fontWeight="700" opacity="0.9">
        {names[dominant.key]}
      </text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)">dominant</text>
    </svg>
  );
}

export default function ProfileResult({ scores, userName, onContinue }) {
  // Filter out non-score keys like dominantEnergy
  const scoreKeys = ['blue','green','yellow','red'];
  const dominant = scoreKeys.reduce((best, k) => (scores[k]||0) > (scores[best]||0) ? k : best, scoreKeys[0]);
  const profile = energyProfiles[dominant];
  const ec = energyColors[dominant];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
          style={{ background: ec.bg, border: `1px solid ${ec.border}`, color: ec.hex }}>
          ✦ Your Energy Profile
        </div>
        <h2 className="font-display text-4xl font-bold text-white mb-3">
          {userName && <span className="text-white/50 font-normal">{userName}, you're </span>}
          <span style={{ color: ec.hex }}>{profile.name}</span>
        </h2>
        <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">{profile.description}</p>
      </div>

      {/* Main grid: chart left, bars right */}
      <div className="rounded-2xl p-6 mb-4 flex flex-col md:flex-row gap-8 items-center"
        style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex-shrink-0 flex justify-center">
          <DiamondChart scores={scores} />
        </div>
        <div className="flex-1 w-full">
          <p className="text-white/35 text-xs uppercase tracking-widest mb-4">Energy Breakdown</p>
          {scoreKeys.map(key => {
            const pct = Math.round(scores[key] || 0);
            const isDom = key === dominant;
            return (
              <div key={key} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${energyColors[key].bar}`}
                      style={isDom ? { boxShadow:`0 0 8px ${energyColors[key].hex}` } : {}}/>
                    <span className={`text-sm ${isDom ? 'text-white font-semibold' : 'text-white/60'}`}>{names[key]}</span>
                    {isDom && <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ background: ec.bg, color: ec.hex, border:`1px solid ${ec.border}` }}>dominant</span>}
                  </div>
                  <span className={`text-sm font-bold ${isDom ? '' : 'text-white/40'}`}
                    style={isDom ? { color: ec.hex } : {}}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
                  <div className={`h-full rounded-full transition-all duration-700 ${energyColors[key].bar}`}
                    style={{ width:`${pct}%`, opacity: isDom ? 1 : 0.5 }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traits + Working Style row */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-xs uppercase tracking-widest mb-3">Key Traits</p>
          <div className="flex flex-wrap gap-2">
            {profile.traits.map(t => (
              <span key={t} className={`px-3 py-1 rounded-full text-xs font-medium ${ec.badge}`}>{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-xs uppercase tracking-widest mb-3">Working Style</p>
          <ul className="space-y-2">
            {profile.workStyle.map((s,i) => (
              <li key={i} className="flex gap-2 text-sm text-white/60">
                <span style={{ color: ec.hex }}>•</span>{s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={onContinue}
        className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.01]"
        style={{ background:`linear-gradient(135deg,${ec.hex}cc,${ec.hex}88)`, boxShadow:`0 0 40px ${ec.hex}33` }}>
        Draft a Message Tailored to Someone →
      </button>
    </div>
  );
}
