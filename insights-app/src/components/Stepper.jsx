export default function Stepper({ currentStep }) {
  const steps = [
    { num: 1, label: "Assessment" },
    { num: 2, label: "Your Profile" },
    { num: 3, label: "Draft Message" },
    { num: 4, label: "Energy Audit" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep > step.num
                ? 'bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                : currentStep === step.num
                  ? 'bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'bg-white/5 text-white/30 border border-white/10'
            }`}>
              {currentStep > step.num ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : step.num}
            </div>
            <span className={`mt-2 text-xs whitespace-nowrap ${
              currentStep === step.num ? 'text-white/70' : 'text-white/30'
            }`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-14 h-px mx-1 mb-5 transition-all duration-300 ${
              currentStep > step.num ? 'bg-green-500/50' : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
