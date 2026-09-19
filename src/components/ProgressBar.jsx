import React from 'react';

const STEPS = [
  { id: 1, label: 'Question'},
  { id: 2, label: 'Activity'},
  { id: 3, label: 'Food'},
  { id: 4, label: 'Date'},
  { id: 5, label: 'Location'},
  { id: 6, label: 'Confirm'},
];

export default function ProgressBar({ currentStep, onStepClick, maxStepReached }) {
  // Hide progress bar on step 1 (landing) and step 7 (final celebration)
  if (currentStep <= 1 || currentStep >= 7) {
    return null;
  }

  return (
    <nav
      aria-label="Date Planning Progress"
      className="w-full max-w-2xl mx-auto mb-5 px-4"
    >
      <div className="glass-panel rounded-2xl py-2.5 px-3 sm:px-6 shadow-romantic flex items-center justify-between overflow-x-auto no-scrollbar">
        {STEPS.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isAccessible = step.id <= maxStepReached;

          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <button
                type="button"
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-xl transition-all duration-300 relative group
                  ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
                  ${isActive ? 'bg-[#FF4F81]/25 border border-[#FF4F81]/50 scale-105 shadow-md shadow-[#FF4F81]/20' : 'hover:bg-white/5'}
                `}
                title={`${step.label} ${isCompleted ? '(Completed)' : isActive ? '(Current)' : ''}`}
              >
                <span
                  className={`text-base sm:text-lg transition-transform duration-300 ${
                    isActive ? 'scale-125' : 'group-hover:scale-110'
                  }`}
                >
                  {step.icon}
                </span>
                <span
                  className={`text-[11px] sm:text-xs font-medium tracking-wide hidden md:inline transition-colors ${
                    isActive
                      ? 'text-[#FFF7F9] font-bold'
                      : isCompleted
                      ? 'text-[#FF8FAB]'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>

                {/* Active indicator dot for mobile */}
                {isActive && (
                  <span className="md:hidden w-1.5 h-1.5 rounded-full bg-[#FF4F81] mt-0.5 animate-pulse" />
                )}
              </button>

              {/* Connector line between steps */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-1 min-w-[12px] sm:min-w-[20px] transition-all duration-500 rounded-full ${
                    currentStep > step.id
                      ? 'bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB]'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
