import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Welcome({ config, recipientName, onUpdateName, onAccept }) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isDeclined, setIsDeclined] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(!recipientName);
  const [tempName, setTempName] = useState(recipientName || '');
  const noBtnRef = useRef(null);
  const containerRef = useRef(null);

  const phrases = config.noButtonPhrases || [
    "No",
    "Are you sure?",
    "Really? 🥺",
    "Think again! 💭",
    "Please? 👉👈",
    "Look at this cute heart! 💕",
    "I'll bring snacks! 🍪",
    "I'll wait...",
  ];

  const maxDodges = 6;

  const handleNoInteraction = (e) => {
    if (noCount < maxDodges) {
      if (e && e.preventDefault) e.preventDefault();

      // Ensure NO button stays reasonably within mobile/desktop screen bounds
      const bounds = 80;
      const randomAngle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 60;
      let newX = Math.cos(randomAngle) * distance;
      let newY = Math.sin(randomAngle) * distance;

      // Keep within viewport boundary
      if (Math.abs(newX) > bounds) newX = Math.sign(newX) * bounds;
      if (Math.abs(newY) > bounds) newY = Math.sign(newY) * bounds;

      setNoPosition({ x: newX, y: newY });
      setNoCount((prev) => prev + 1);
    }
  };

  const handleNoClick = () => {
    if (noCount < maxDodges) {
      handleNoInteraction();
    } else {
      setIsDeclined(true);
    }
  };

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    const finalName = tempName.trim() || 'You';
    onUpdateName(finalName);
    setIsEditingName(false);
  };

  const handleYesClick = () => {
    setIsCelebrating(true);
    setTimeout(() => {
      onAccept();
    }, 850);
  };

  const displayName = recipientName || "there";
  const greeting = (config.landing?.greeting || "Hi, {name}").replace("{name}", displayName);
  const currentNoText = phrases[Math.min(noCount, phrases.length - 1)];
  const yesScale = Math.min(1 + noCount * 0.08, 1.35);

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] px-3 sm:px-4 text-center max-w-lg w-full mx-auto"
    >
      <AnimatePresence mode="wait">
        {/* Name Entry Screen (If link was shared without a name) */}
        {isEditingName ? (
          <motion.div
            key="name-modal"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            className="glass-panel-glow rounded-3xl p-6 sm:p-10 w-full relative overflow-hidden shadow-2xl"
          >

            <h3 className="text-xl sm:text-2xl font-cute font-bold text-white mb-1.5">
              {config.landing?.namePromptTitle || "May I know your full name?"}
            </h3>
            <p className="text-xs sm:text-sm text-[#FFD6E0]/80 mb-6 font-light">
              This will help me to know you better.:
            </p>

            <form onSubmit={handleSaveName} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={config.landing?.namePlaceholder || "Enter your name..."}
                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/20 text-white font-medium text-base text-center placeholder-gray-500 focus:outline-none focus:border-[#FF4F81] focus:ring-2 focus:ring-[#FF4F81]/30 transition-all"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB] text-white font-bold text-sm shadow-romantic hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Continue
              </button>
            </form>
          </motion.div>
        ) : !isDeclined ? (
          /* Main Question Invitation Card */
          <motion.div
            key="invitation-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-glow rounded-3xl p-6 sm:p-10 w-full relative overflow-hidden shadow-2xl"
          >
            {/* Ambient Corner Glows */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FF4F81]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#FF8FAB]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badge with edit name option */}
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="text-xs text-[#FF8FAB] bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <span>Name: <strong>{recipientName}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(recipientName);
                    setIsEditingName(true);
                  }}
                  className="text-gray-400 hover:text-white ml-1 text-[11px] underline"
                  title="Change name"
                >
                  Edit
                </button>
              </span>
            </div>

            {/* Greeting */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl sm:text-3xl font-cute font-bold text-[#FFD6E0] mb-1.5"
            >
              {greeting}
            </motion.h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#FFF7F9]/80 mb-5 font-light">
              {config.landing?.introSubtitle || "I have a little question for you..."}
            </p>

            {/* Main Question Box */}
            <div className="my-4 py-4 px-4 sm:px-6 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner">
              <h1 className="text-2xl sm:text-4xl font-romantic font-bold tracking-tight text-white leading-tight">
                {config.landing?.question || "Would you go on a date with me?"}
              </h1>
            </div>

            {/* Personal Message */}
            {config.landing?.personalMessage && (
              <p className="text-xs sm:text-sm text-[#FFD6E0]/80 italic max-w-sm mx-auto mb-6 leading-relaxed font-romantic">
                "{config.landing.personalMessage}"
              </p>
            )}

            {/* Interactive Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[95px] relative mt-2">
              {/* YES Button (Touch-optimized) */}
              <motion.button
                type="button"
                onClick={handleYesClick}
                whileHover={{ scale: yesScale * 1.04 }}
                whileTap={{ scale: yesScale * 0.96 }}
                style={{ transform: `scale(${yesScale})` }}
                className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white shadow-romantic hover:shadow-romantic-lg transition-all duration-200 z-20 touch-manipulation
                  ${isCelebrating ? 'bg-gradient-to-r from-[#FF4F81] via-[#FF8FAB] to-[#FF4F81] animate-pulse' : 'bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB]'}
                `}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{config.landing?.yesButtonText || "YES 💕"}</span>
                  {isCelebrating && <span className="animate-spin">✨</span>}
                </span>
              </motion.button>

              {/* Playful Evasive NO Button */}
              <motion.button
                ref={noBtnRef}
                type="button"
                onMouseEnter={handleNoInteraction}
                onTouchStart={handleNoInteraction}
                onClick={handleNoClick}
                animate={{
                  x: noPosition.x,
                  y: noPosition.y,
                  transition: { type: "spring", stiffness: 450, damping: 25 },
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 z-10 select-none touch-manipulation
                  ${noCount >= maxDodges
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}
                `}
                aria-label="No option"
              >
                {currentNoText}
              </motion.button>
            </div>

            {/* Playful hint */}
            {noCount > 0 && noCount < maxDodges && (
              <p className="text-[11px] text-[#FF8FAB] mt-4 tracking-wide">
                (Psst... that button seems a little camera shy 🤭)
              </p>
            )}
          </motion.div>
        ) : (
          /* Gentle Respectful Decline Screen */
          <motion.div
            key="declined-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel rounded-3xl p-6 sm:p-10 w-full"
          >
            <div className="text-4xl mb-3">💔</div>
            <h3 className="text-xl sm:text-2xl font-bold font-cute text-[#FFD6E0] mb-2">
              {config.declinedState?.title || "That's okay!"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              {config.declinedState?.message || "No pressure at all! Thank you for taking the time to read this, and I still appreciate you deeply."}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsDeclined(false);
                setNoCount(0);
                setNoPosition({ x: 0, y: 0 });
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB] text-white font-medium text-xs sm:text-sm shadow-romantic hover:scale-105 transition-transform"
            >
              {config.declinedState?.reconsiderText || "Changed your mind? 🥺"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
