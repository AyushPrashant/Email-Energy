import { useState } from 'react';

import Register    from './components/Register';
import Evaluator   from './components/Evaluator';
import ProfileResult from './components/ProfileResult';
import MessageDrafter from './components/MessageDrafter';
import EnergyAudit from './components/EnergyAudit';

/**
 * TWO-PART APP
 *
 * Part A  (Assessment flow) – steps: register → questions → profile
 * Part B  (Email flow)      – always-visible landing → draft → audit
 *
 * URL hash controls which part shows:
 *   #email  → Part B (default landing)
 *   #assess → Part A
 */

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.4)]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" fill="white" opacity="0.9"/>
          <circle cx="8" cy="2" r="1.5" fill="white" opacity="0.5"/>
          <circle cx="8" cy="14" r="1.5" fill="white" opacity="0.5"/>
          <circle cx="2" cy="8" r="1.5" fill="white" opacity="0.5"/>
          <circle cx="14" cy="8" r="1.5" fill="white" opacity="0.5"/>
        </svg>
      </div>
      <div>
        <span className="font-display font-bold text-white text-base tracking-tight">insights</span>
        <span className="ml-1.5 text-white/25 text-xs px-1.5 py-0.5 rounded-md border border-white/10 bg-white/3 font-medium">discovery</span>
      </div>
    </div>
  );
}

// ─── Assessment Part (A) ────────────────────────────────────────────
function AssessmentApp({ onGoToEmail }) {
  const [step, setStep]       = useState('register'); // register | questions | profile
  const [user, setUser]       = useState(null);
  const [scores, setScores]   = useState(null);

  const handleRegistered = (u, existingScores, alreadyDone) => {
    setUser(u);
    if (alreadyDone && existingScores) { setScores(existingScores); setStep('profile'); }
    else setStep('questions');
  };

  const stepNum = step === 'register' ? 1 : step === 'questions' ? 2 : 3;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#080d1a 0%,#0d1530 50%,#080d1a 100%)' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(ellipse at 20% 50%,rgba(59,130,246,0.06) 0,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(34,197,94,0.04) 0,transparent 50%)'
      }}/>

      <header className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5"
        style={{ background: 'rgba(8,13,26,0.8)' }}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            {/* Mini step indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              {['Register','Questions','Profile'].map((label,i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold transition-all ${
                    stepNum > i+1 ? 'bg-green-500 text-white' :
                    stepNum === i+1 ? 'bg-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                    'bg-white/5 text-white/20 border border-white/8'
                  }`}>{stepNum > i+1 ? '✓' : i+1}</div>
                  <span className={`text-xs ${stepNum===i+1?'text-white/60':'text-white/20'}`}>{label}</span>
                  {i<2 && <div className={`w-4 h-px ${stepNum>i+1?'bg-green-500/40':'bg-white/8'}`}/>}
                </div>
              ))}
            </div>
            <button onClick={onGoToEmail}
              className="text-xs text-white/30 hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg border border-white/6 hover:border-blue-500/30">
              Draft Email →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {step === 'register' && <Register onRegistered={handleRegistered} />}
        {step === 'questions' && user && (
          <Evaluator user={user} onComplete={s => { setScores(s); setStep('profile'); }} />
        )}
        {step === 'profile' && scores && (
          <ProfileResult scores={scores} userName={user?.name}
            onContinue={() => onGoToEmail(user)} />
        )}
      </main>
    </div>
  );
}

// ─── Email Part (B) ─────────────────────────────────────────────────
function EmailApp({ prefillUser, onGoToAssess }) {
  const [step, setStep]       = useState('draft'); // draft | audit
  const [user, setUser]       = useState(prefillUser || null);
  const [draftData, setDraft] = useState(null);
  const [analyzed, setAnalyzed] = useState(null); // { rewrittenEmail } from /analyze

  // Called when MessageDrafter asks for analysis (no send yet)
  const handleAnalyze = (data, result) => {
    setDraft(data);
    setAnalyzed(result);
    setStep('audit');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#080d1a 0%,#0d1530 50%,#080d1a 100%)' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(ellipse at 80% 30%,rgba(59,130,246,0.06) 0,transparent 60%),radial-gradient(ellipse at 20% 70%,rgba(34,197,94,0.04) 0,transparent 50%)'
      }}/>

      <header className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5"
        style={{ background: 'rgba(8,13,26,0.8)' }}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            {user && <span className="text-white/30 text-xs hidden sm:block">{user.name} · {user.email}</span>}
            {step === 'audit' && (
              <button onClick={() => setStep('draft')}
                className="text-xs text-white/30 hover:text-white/60 transition-colors">
                ← Edit draft
              </button>
            )}
            <button onClick={onGoToAssess}
              className="text-xs text-white/30 hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg border border-white/6 hover:border-blue-500/30">
              Take Assessment
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {step === 'draft' && (
          <MessageDrafter
            user={user}
            onUserChange={setUser}
            onAnalyze={handleAnalyze}
            onNeedRegister={onGoToAssess}
          />
        )}
        {step === 'audit' && draftData && analyzed && (
          <EnergyAudit
            user={user}
            recipient={draftData.recipient}
            subject={draftData.subject}
            message={draftData.message}
            rewrittenEmail={analyzed}
            onDraftAnother={() => { setStep('draft'); setDraft(null); setAnalyzed(null); }}
            onGoToAssess={onGoToAssess}
          />
        )}
      </main>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────
export default function App() {
  // Default landing = email tool (Part B)
  const [part, setPart] = useState('email'); // 'email' | 'assess'
  const [carryUser, setCarryUser] = useState(null);

  const goToEmail = (u) => { if (u) setCarryUser(u); setPart('email'); };
  const goToAssess = () => setPart('assess');

  if (part === 'assess') return <AssessmentApp onGoToEmail={goToEmail} />;
  return <EmailApp prefillUser={carryUser} onGoToAssess={goToAssess} />;
}
