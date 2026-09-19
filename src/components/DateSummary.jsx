import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DateSummary({
  config,
  datePlan,
  isSubmitting,
  onConfirm,
  onEditStep,
  onBack,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  const recipientName = config.name || "Annika";

  // Helper to format date string nicely
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'To be decided';
    try {
      const [y, m, d] = dateStr.split('-');
      const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to format time (HH:mm to 12-hour AM/PM)
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return 'Flexible';
    try {
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const locationDisplay = typeof datePlan.location === 'object'
    ? (datePlan.location?.name || 'Somewhere Special')
    : (datePlan.location || 'Somewhere Special');

  const locationAddress = typeof datePlan.location === 'object'
    ? datePlan.location?.address
    : '';

  const selectedActivityObjs = config.activities?.filter((a) =>
    datePlan.activities?.includes(a.id)
  ) || [];

  // Flatten all foods
  const allFoods = Object.values(config.foodCategories || {}).flatMap(
    (c) => c.items
  );
  const selectedFoodObjs = allFoods.filter((f) =>
    datePlan.foods?.includes(f.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl w-full mx-auto px-4 py-4"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-cute font-bold text-[#FFF7F9] mb-2">
          {config.summaryTitle || "So... are we really doing this? 🥺"}
        </h2>
        <p className="text-sm text-[#FFD6E0]/80">
          {config.summarySubtitle || "Take a look at what we've put together:"}
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 relative overflow-hidden mb-8 border border-[#FF8FAB]/30 shadow-2xl">
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F81]/15 rounded-bl-full blur-2xl pointer-events-none" />

        {/* Card Title */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#FF8FAB] uppercase">
              Official Invitation
            </span>
            <h3 className="text-2xl font-romantic font-bold text-white flex items-center gap-2">
              <span>OUR DATE</span>
              <span className="text-[#FF4F81]">💗</span>
            </h3>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#FFD6E0]">
            For: <strong className="text-white">{recipientName}</strong>
          </div>
        </div>

        {/* Details Grid (Date, Time, Location) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-sm mb-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-xs text-[#FF8FAB] font-semibold block mb-1 flex items-center gap-1.5">
              <span>📅</span>
              <span>DATE</span>
            </span>
            <span className="font-medium text-white text-sm sm:text-base">
              {formatDateDisplay(datePlan.date)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-xs text-[#FF8FAB] font-semibold block mb-1 flex items-center gap-1.5">
              <span>⏰</span>
              <span>TIME</span>
            </span>
            <span className="font-medium text-white text-sm sm:text-base">
              {formatTimeDisplay(datePlan.time)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-xs text-[#FF8FAB] font-semibold block mb-1 flex items-center gap-1.5">
              <span>📍</span>
              <span>LOCATION</span>
            </span>
            <span className="font-medium text-white text-sm sm:text-base block truncate" title={locationDisplay}>
              {locationDisplay}
            </span>
            {locationAddress && (
              <span className="text-[10px] text-gray-400 block truncate">
                {locationAddress}
              </span>
            )}
          </div>
        </div>

        {/* Planned Activities */}
        <div className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <span className="text-xs text-[#FF8FAB] font-semibold block mb-2 flex items-center gap-1.5">
            <span>🎯</span>
            <span>ACTIVITIES</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedActivityObjs.length > 0 ? (
              selectedActivityObjs.map((act) => (
                <span
                  key={act.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4F81]/15 border border-[#FF4F81]/30 text-xs font-medium text-[#FFF7F9]"
                >
                  <span>{act.icon}</span>
                  <span>{act.name}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Whatever we feel like!</span>
            )}
          </div>
        </div>

        {/* Selected Treats & Sips */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <span className="text-xs text-[#FF8FAB] font-semibold block mb-2 flex items-center gap-1.5">
            <span>🍕</span>
            <span>FOOD & DRINKS</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedFoodObjs.length > 0 ? (
              selectedFoodObjs.map((food) => (
                <span
                  key={food.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-[#FFF7F9]"
                >
                  <span>{food.icon}</span>
                  <span>{food.name}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Delicious cravings!</span>
            )}
          </div>
        </div>

        {/* Question Prompt */}
        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-sm sm:text-base font-cute font-bold text-[#FFD6E0]">
            Does this sound good to you? 💕
          </p>
        </div>
      </div>

      {/* Main Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setShowEditModal(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-medium text-gray-300 hover:text-white transition-all text-center"
        >
          ✏️ CHANGE SOMETHING
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB] text-white font-bold text-base shadow-romantic hover:shadow-romantic-lg hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'SENDING PLAN... 💌' : "YES, LET'S DO IT 💕"}</span>
        </button>
      </div>

      {/* Modal to pick which step to change */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel-glow rounded-3xl p-6 max-w-sm w-full text-center"
            >
              <h4 className="text-xl font-bold font-cute text-white mb-2">
                What would you like to tweak?
              </h4>
              <p className="text-xs text-[#FFD6E0]/80 mb-6">
                Pick any section to jump right back:
              </p>

              <div className="space-y-2 mb-6">
                {[
                  { step: 2, label: '✨ Activities' },
                  { step: 3, label: '🍴 Food & Drinks' },
                  { step: 4, label: '📅 Date & Time' },
                  { step: 5, label: '📍 Location & Map' },
                ].map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      onEditStep(item.step);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#FF4F81]/25 border border-white/10 hover:border-[#FF4F81] text-sm text-left text-white font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs font-medium hover:text-white"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
