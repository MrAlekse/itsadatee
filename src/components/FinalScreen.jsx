import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from './Confetti';
import { downloadDateCardImage } from '../utils/cardGenerator';

export default function FinalScreen({ config, datePlan, notificationSent, onStartOver }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const recipientName = config.name || "Annika";
  const senderName = config.senderName || "Your Name";

  const locationDisplay = typeof datePlan.location === 'object'
    ? (datePlan.location?.name || 'Somewhere Special')
    : (datePlan.location || 'Somewhere Special');

  const locationAddress = typeof datePlan.location === 'object'
    ? datePlan.location?.address
    : '';

  const selectedActivityObjs = config.activities?.filter((a) =>
    datePlan.activities?.includes(a.id)
  ) || [];

  const allFoods = Object.values(config.foodCategories || {}).flatMap(
    (c) => c.items
  );
  const selectedFoodObjs = allFoods.filter((f) =>
    datePlan.foods?.includes(f.id)
  );

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const [y, m, d] = dateStr.split('-');
      const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return 'TBD';
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

  const handleDownloadCard = () => {
    setDownloading(true);
    try {
      downloadDateCardImage({
        recipientName: recipientName,
        senderName: senderName,
        date: formatDateDisplay(datePlan.date),
        time: formatTimeDisplay(datePlan.time),
        activities: selectedActivityObjs.map((a) => `${a.icon} ${a.name}`),
        foods: selectedFoodObjs.map((f) => `${f.icon} ${f.name}`),
        location: locationDisplay,
      });
    } catch (err) {
      console.error('Error generating card image:', err);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const getShareText = () => {
    return (
      `Hey! We officially have a date planned! 💕\n\n` +
      `📅 Date: ${formatDateDisplay(datePlan.date)}\n` +
      `⏰ Time: ${formatTimeDisplay(datePlan.time)}\n` +
      `📍 Location: ${locationDisplay}\n` +
      `🎯 Activities: ${selectedActivityObjs.map((a) => a.name).join(', ')}\n` +
      `🍕 Food: ${selectedFoodObjs.map((f) => f.name).join(', ')}\n\n` +
      `Can't wait to see you, ${recipientName}! 💗`
    );
  };

  // Web Share API or Clipboard Fallback
  const handleShare = async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Our Date Plan with ${recipientName} 💕`,
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // WhatsApp direct link if phone number configured
  const whatsappNumber = config.backend?.whatsappNumber;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getShareText())}`
    : null;

  const celebrationTitle = config.finalScreen?.celebrationTitle || "IT'S A DATE! 💕";
  const celebrationSubtitle = (config.finalScreen?.celebrationSubtitle || "Can't wait to spend some time with you, {name}.").replace("{name}", recipientName);

  return (
    <div className="relative z-10 max-w-xl w-full mx-auto px-4 py-6 text-center">
      {/* Continuous celebratory Confetti */}
      <Confetti trigger={true} duration={6000} />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-glow rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl"
      >
        {/* Floating background orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FF4F81]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#FF8FAB]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="text-6xl sm:text-7xl mb-3 filter drop-shadow-md"
        >
          💌
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-5xl font-romantic font-bold text-white mb-2 tracking-tight"
        >
          {celebrationTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg font-cute font-medium text-[#FFD6E0] mb-4"
        >
          {celebrationSubtitle}
        </motion.p>

        {/* Automated delivery confirmation pill */}
        {notificationSent && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium mb-6"
          >
            <span>✓</span>
            <span>Your date response has been delivered to {senderName}! 💌</span>
          </motion.div>
        )}

        {/* The Official Ticket Pass Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-5 sm:p-6 bg-white/[0.04] border border-[#FF8FAB]/30 shadow-lg text-left relative overflow-hidden mb-6"
        >
          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="text-[10px] tracking-widest font-bold text-[#FF8FAB] uppercase">
              See you there, {recipientName}!
            </span>
            <span className="text-xs text-[#FFD6E0] font-mono">
              #DATE-2026-PASS
            </span>
          </div>

          {/* Quick Rows */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">📅 When:</span>
              <span className="font-semibold text-white">
                {formatDateDisplay(datePlan.date)} at {formatTimeDisplay(datePlan.time)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">📍 Pinned Spot:</span>
              <span className="font-semibold text-white truncate max-w-[200px]" title={locationDisplay}>
                {locationDisplay}
              </span>
            </div>

            {locationAddress && (
              <div className="text-[11px] text-gray-400 -mt-1 pl-6 truncate">
                {locationAddress}
              </div>
            )}

            <div className="pt-2 border-t border-white/10">
              <span className="text-gray-400 block mb-1">🎯 We will enjoy:</span>
              <span className="text-xs text-[#FFE5EC]">
                {selectedActivityObjs.map((a) => `${a.icon} ${a.name}`).join(' • ')}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">🍕 Food cravings:</span>
              <span className="text-xs text-[#FFE5EC]">
                {selectedFoodObjs.map((f) => `${f.icon} ${f.name}`).join(' • ')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons: Save Our Date, Share, WhatsApp, Start Over */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          {/* WhatsApp Direct Option (if enabled) */}
          {whatsappUrl && (
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>💬 Send on WhatsApp</span>
            </motion.a>
          )}

          {/* Save Date Pass (Canvas PNG Generator) */}
          <motion.button
            type="button"
            onClick={handleDownloadCard}
            disabled={downloading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB] text-white font-bold text-sm shadow-romantic hover:shadow-romantic-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{downloading ? 'Generating Pass... 🎨' : '💾 Save Our Date'}</span>
          </motion.button>

          {/* Share / Copy Result */}
          <motion.button
            type="button"
            onClick={handleShare}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{copied ? 'Copied to Clipboard! 💌' : '📤 Share Date Plan'}</span>
          </motion.button>
        </div>

        {/* Start Over option */}
        <button
          type="button"
          onClick={onStartOver}
          className="text-xs text-gray-400 hover:text-[#FF8FAB] transition-colors underline-offset-4 hover:underline"
        >
          🔄 Start Over / Plan Another Date
        </button>
      </motion.div>
    </div>
  );
}
