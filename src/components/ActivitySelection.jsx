import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ActivitySelection({
  config,
  selectedActivities,
  onToggleActivity,
  onNext,
  onBack,
}) {
  const [errorMsg, setErrorMsg] = useState('');
  const activities = config.activities || [];

  const handleNext = () => {
    if (!selectedActivities || selectedActivities.length === 0) {
      setErrorMsg('Please pick at least one fun activity for us! 🥺');
      return;
    }
    setErrorMsg('');
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl w-full mx-auto px-3 sm:px-4 py-2"
    >
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-cute font-bold text-[#FFF7F9] mb-2">
          {config.activitiesTitle || "Yey! "}
        </h2>
        <p className="text-xs sm:text-base text-[#FFD6E0]/80 max-w-lg mx-auto">
          {config.activitiesSubtitle || "Now let's decide what our date looks like."}
        </p>
      </div>

      {/* Activities Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {activities.map((item) => {
          const isSelected = selectedActivities.includes(item.id);

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setErrorMsg('');
                onToggleActivity(item.id);
              }}
              className={`text-left p-4 sm:p-5 rounded-2xl relative transition-all duration-200 border flex flex-col justify-between min-h-[105px] sm:min-h-[125px] active:scale-[0.98] touch-manipulation
                ${
                  isSelected
                    ? 'glass-card-selected'
                    : 'glass-card'
                }
              `}
            >
              {/* Checkmark indicator */}
              <div
                className={`absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-[#FF4F81] text-white scale-100 shadow-md shadow-[#FF4F81]/50'
                      : 'border border-white/20 text-transparent scale-90'
                  }
                `}
              >
                ✓
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-1.5 pr-6">
                <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{item.icon}</span>
                <h3 className="font-bold text-sm sm:text-base text-[#FFF7F9]">
                  {item.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-[#FFD6E0]/70 font-light leading-relaxed">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Validation Message */}
      {errorMsg && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs sm:text-sm text-[#FF4F81] font-medium mb-3"
        >
          {errorMsg}
        </motion.p>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-gray-300 hover:text-white active:bg-white/10 transition-colors"
        >
          ← Back
        </button>

        <div className="text-[11px] sm:text-xs text-[#FF8FAB]/80">
          {selectedActivities.length > 0 ? (
            <span>{selectedActivities.length} selected</span>
          ) : (
            <span>Pick at least 1</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="px-7 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB] text-white font-bold text-xs sm:text-sm shadow-romantic hover:shadow-romantic-lg active:scale-95 transition-all duration-200"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}
