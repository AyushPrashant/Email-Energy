import { useState, useEffect } from 'react';
import { api, mapScores } from '../api';

export default function Evaluator({ user, onComplete }) {
  const [questions, setQuestions]   = useState([]);
  const [loadingQ,  setLoadingQ]    = useState(true);
  const [fetchError,setFetchError]  = useState('');
  const [answers,   setAnswers]     = useState({});  // { [qId]: { value, type } }
  const [currentPage, setCurrentPage] = useState(0);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');

  const PAGE_SIZE = 4;

  useEffect(() => {
    api.getQuestions()
      .then(d => setQuestions(d))
      .catch(e => setFetchError(e.message || 'Failed to load questions'))
      .finally(() => setLoadingQ(false));
  }, []);

  if (loadingQ) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
      <p className="text-white/40 text-sm">Loading questions...</p>
    </div>
  );

  if (fetchError) return (
    <div className="text-center py-20">
      <p className="text-red-400 text-sm mb-4">{fetchError}</p>
      <button onClick={() => window.location.reload()} className="text-white/40 text-sm underline">Retry</button>
    </div>
  );

  const totalPages  = Math.ceil(questions.length / PAGE_SIZE);
  const pageQs      = questions.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const isLastPage  = currentPage === totalPages - 1;
  const progress    = ((currentPage + 1) / totalPages) * 100;

  // Per-page: every question must have M or L or 1-5
  const pageAnswered = pageQs.every(q => answers[q.id] !== undefined);

  // Per-page MANDATORY on EVERY page: must have 1 M and at least 1 L
  const pageAnswerList = pageQs.map(q => answers[q.id]).filter(Boolean);
  const pageMostCount  = pageAnswerList.filter(a => a.type === 'MOST').length;
  const pageLeastCount = pageAnswerList.filter(a => a.type === 'LEAST').length;

  // Every page requires all answered + at least 1 M + at least 1 L
  const pageValid = pageAnswered && pageMostCount >= 1 && pageLeastCount >= 1;

  const getType = v => v === 6 ? 'MOST' : v === 0 ? 'LEAST' : 'NORMAL';

  const handleSelect = (qId, value) => {
    const type = getType(value);
    setAnswers(prev => {
      const next = { ...prev };
      // Only 1 MOST allowed globally
      if (type === 'MOST') {
        Object.keys(next).forEach(k => { if (next[k].type === 'MOST') delete next[k]; });
      }
      next[qId] = { value, type };
      return next;
    });
  };

  // Validation hints — shown on any page once all questions answered but M or L missing
  const showMostHint  = pageAnswered && pageMostCount === 0;
  const showLeastHint = pageAnswered && pageLeastCount === 0;

  const handleNext = async () => {
    if (!pageValid) return;
    setSubmitError('');

    if (!isLastPage) { setCurrentPage(p => p + 1); window.scrollTo(0,0); return; }

    const payload = Object.entries(answers).map(([qId, ans]) => ({
      questionId: parseInt(qId),
      value: ans.value === 6 ? 5 : ans.value,
      type: ans.type,
    }));

    setSubmitting(true);
    try {
      const result = await api.submitAssessment(user.id, payload);
      onComplete(mapScores(result));
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('submitted')) {
        setSubmitError('You already submitted. Loading your profile...');
        setTimeout(async () => {
          try { const e = await api.getUserEnergy(user.email); if (e) onComplete(mapScores(e)); }
          catch { setSubmitError('Could not retrieve profile. Please contact support.'); }
        }, 1500);
      } else {
        setSubmitError(msg || 'Submission failed. Please try again.');
      }
    } finally { setSubmitting(false); }
  };

  const cols = ['L','1','2','3','4','5','M'];
  const energyMeta = {
    COOL_BLUE:       { label:'Cool Blue',       cls:'text-blue-400',   bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.2)'  },
    EARTH_GREEN:     { label:'Earth Green',     cls:'text-green-400',  bg:'rgba(34,197,94,0.08)',   border:'rgba(34,197,94,0.2)'   },
    SUNSHINE_YELLOW: { label:'Sunshine Yellow', cls:'text-yellow-400', bg:'rgba(234,179,8,0.08)',   border:'rgba(234,179,8,0.2)'   },
    FIERY_RED:       { label:'Fiery Red',       cls:'text-red-400',    bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.2)'   },
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-medium"
          style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#60a5fa' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
          Question {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage+1)*PAGE_SIZE, questions.length)} of {questions.length}
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Hi {user.name} 👋</h1>
        <p className="text-white/40 text-sm">Rate how much each statement is like you</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-white/30 mb-2">
          <span>Page {currentPage+1} of {totalPages}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width:`${progress}%`, background:'linear-gradient(90deg,#3B82F6,#22d3ee)' }}/>
        </div>
      </div>

      {/* Mandatory requirements — shown on every page */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          pageMostCount >= 1
            ? 'bg-green-500/10 border border-green-500/25 text-green-400'
            : 'bg-white/4 border border-white/8 text-white/35'
        }`}>
          {pageMostCount >= 1 ? '✓' : '○'} Select 1 Most (M) — required
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          pageLeastCount >= 1
            ? 'bg-green-500/10 border border-green-500/25 text-green-400'
            : 'bg-white/4 border border-white/8 text-white/35'
        }`}>
          {pageLeastCount >= 1 ? '✓' : '○'} Select 1 Least (L) — required
        </div>
      </div>

      {/* Question cards */}
      <div className="space-y-3 mb-6">
        {pageQs.map((q, idx) => {
          const sel    = answers[q.id];
          const meta   = energyMeta[q.energyType] || {};
          const isAnswered = sel !== undefined;

          return (
            <div key={q.id} className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: isAnswered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: isAnswered ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)',
              }}>
              {/* Statement */}
              <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/20 text-xs font-mono">Q{currentPage * PAGE_SIZE + idx + 1}</span>
                    {meta.label && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.cls}`}
                        style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                        {meta.label}
                      </span>
                    )}
                  </div> */}
                  <p className="text-white/85 text-sm leading-relaxed">{q.text}</p>
                </div>
                {isAnswered && (
                  <div className="flex-shrink-0 mt-1">
                    {sel.type === 'MOST'  && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25 font-medium">MOST</span>}
                    {sel.type === 'LEAST' && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25 font-medium">LEAST</span>}
                    {sel.type === 'NORMAL'&& <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 font-medium">{sel.value}</span>}
                  </div>
                )}
              </div>

              {/* Radio row */}
              <div className="px-4 pb-4">
                <div className="flex items-center rounded-xl overflow-hidden"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  {cols.map(col => {
                    const value = col==='L' ? 0 : col==='M' ? 6 : parseInt(col);
                    const active = sel?.value === value;
                    const isL = col === 'L', isM = col === 'M';

                    return (
                      <button key={col} onClick={() => handleSelect(q.id, value)}
                        className="flex-1 flex flex-col items-center py-3 transition-all duration-150 hover:bg-white/5 relative group"
                        style={active ? {
                          background: isM ? 'rgba(34,197,94,0.15)' : isL ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)'
                        } : {}}>
                        {/* Top label */}
                        <span className={`text-xs font-bold mb-2 ${
                          isL ? 'text-red-400' : isM ? 'text-green-400' : 'text-white/25'
                        }`}>{col}</span>
                        {/* Circle */}
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          active
                            ? isM  ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                            : isL  ? 'bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]'
                            :        'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]'
                            : 'border-white/15 group-hover:border-white/35 bg-transparent'
                        }`}/>
                      </button>
                    );
                  })}
                </div>
                {/* Axis labels */}
                <div className="flex justify-between px-1 mt-1.5">
                  <span className="text-xs text-red-400/50">Least like me</span>
                  <span className="text-xs text-green-400/50">Most like me</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation hint — tells user exactly what's missing */}
      {pageAnswered && (showMostHint || showLeastHint) && (
        <div className="mb-4 px-4 py-3 rounded-xl text-xs flex items-center gap-2"
          style={{ background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.2)', color:'#fbbf24' }}>
          ⚠&nbsp;
          {showMostHint && showLeastHint && 'Please select one Most (M) and one Least (L) on this page.'}
          {showMostHint && !showLeastHint && 'Please select one Most (M) on this page.'}
          {!showMostHint && showLeastHint && 'Please select one Least (L) on this page.'}
        </div>
      )}

      {submitError && (
        <div className="mb-4 px-4 py-3 rounded-xl text-xs"
          style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
          {submitError}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between items-center">
        {currentPage > 0
          ? <button onClick={() => setCurrentPage(p => p-1)}
              className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-all"
              style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
              ← Back
            </button>
          : <div/>}

        <button onClick={handleNext} disabled={!pageValid || submitting}
          className={`px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
            pageValid && !submitting
              ? 'text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]'
              : 'text-white/25 cursor-not-allowed'
          }`}
          style={pageValid && !submitting ? { background:'linear-gradient(135deg,#3B82F6,#06b6d4)' } : { background:'rgba(255,255,255,0.05)' }}>
          {submitting
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Submitting...</>
            : isLastPage ? 'Submit & See Profile →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
