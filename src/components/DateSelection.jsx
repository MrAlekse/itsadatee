import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function DateSelection({
  config,
  selectedDate,
  selectedTime,
  onChangeDate,
  onChangeTime,
  onNext,
  onBack,
}) {
  const [errorMsg, setErrorMsg] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMsg('Please choose both a date and a time for our meet-up! 📅⏰');
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
      className="max-w-2xl w-full mx-auto px-3 sm:px-4 py-2"
    >
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-cute font-bold text-[#FFF7F9] mb-2">
          {config.dateTimeTitle || "When should I steal you for a while?"}
        </h2>
        <p className="text-xs sm:text-base text-[#FFD6E0]/80 max-w-md mx-auto">
          {config.dateTimeSubtitle || "Pick a day and time that feels just right for you."}
        </p>
      </div>

      {/* Modern Card Container */}
      <div className="glass-panel rounded-3xl p-5 sm:p-8 mb-6 space-y-5 shadow-2xl">
        {/* Date Picker Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8FAB] mb-1.5 flex items-center gap-1.5">
            <span>📅</span>
            <span>Select Date</span>
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => {
              setErrorMsg('');
              onChangeDate(e.target.value);
            }}
            className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white font-medium text-base focus:outline-none focus:border-[#FF4F81] focus:ring-2 focus:ring-[#FF4F81]/30 transition-all cursor-pointer [color-scheme:dark]"
          />
        </div>

        {/* Time Picker Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8FAB] mb-1.5 flex items-center gap-1.5">
            <span>⏰</span>
            <span>Select Time</span>
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => {
              setErrorMsg('');
              onChangeTime(e.target.value);
            }}
            className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white font-medium text-base focus:outline-none focus:border-[#FF4F81] focus:ring-2 focus:ring-[#FF4F81]/30 transition-all cursor-pointer [color-scheme:dark]"
          />
        </div>

        {/* Selected Preview Pill */}
        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-2xl bg-[#FF4F81]/15 border border-[#FF4F81]/30 text-center text-xs text-[#FFD6E0]"
          >
            Marked for: <strong className="text-white">{selectedDate}</strong> at{' '}
            <strong className="text-white">{selectedTime} </strong> 💕
          </motion.div>
        )}
      </div>

      {/* Validation Error */}
      {errorMsg && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs sm:text-sm text-[#FF4F81] font-medium mb-3"
        >
          {errorMsg}
        </motion.p>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-gray-300 hover:text-white active:bg-white/10 transition-colors"
        >
          ← Back
        </button>

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
