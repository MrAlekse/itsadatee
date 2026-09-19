import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FoodSelection({
  config,
  selectedFoods,
  onToggleFood,
  onNext,
  onBack,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [errorMsg, setErrorMsg] = useState('');

  const foodCategories = config.foodCategories || {};
  const categoryKeys = Object.keys(foodCategories);

  const allItems = categoryKeys.flatMap((key) =>
    foodCategories[key].items.map((item) => ({ ...item, categoryKey: key }))
  );

  const displayedItems =
    activeCategory === 'all'
      ? allItems
      : foodCategories[activeCategory]?.items.map((item) => ({
          ...item,
          categoryKey: activeCategory,
        })) || [];

  const handleNext = () => {
    if (!selectedFoods || selectedFoods.length === 0) {
      setErrorMsg('Please pick at least one delicious treat for us! 🥺');
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
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-4xl font-cute font-bold text-[#FFF7F9] mb-1.5">
          {config.foodTitle || "What are we eating? 🍜"}
        </h2>
        <p className="text-xs sm:text-base text-[#FFD6E0]/80 max-w-lg mx-auto">
          {config.foodSubtitle || "Select everything you're craving! No limits here 👀"}
        </p>
      </div>

      {/* Category Tabs (Smooth touch scrolling) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar touch-pan-x">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap active:scale-95 touch-manipulation
            ${
              activeCategory === 'all'
                ? 'bg-[#FF4F81] text-white shadow-md shadow-[#FF4F81]/40'
                : 'bg-white/5 text-gray-300 active:bg-white/10'
            }
          `}
        >
          All 😋
        </button>

        {categoryKeys.map((key) => {
          const cat = foodCategories[key];
          const isCurrent = activeCategory === key;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap active:scale-95 touch-manipulation
                ${
                  isCurrent
                    ? 'bg-[#FF4F81] text-white shadow-md shadow-[#FF4F81]/40'
                    : 'bg-white/5 text-gray-300 active:bg-white/10'
                }
              `}
            >
              {cat.categoryName}
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid (2 cols on mobile, up to 5 on large screens) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
        {displayedItems.map((item) => {
          const isSelected = selectedFoods.includes(item.id);

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setErrorMsg('');
                onToggleFood(item.id);
              }}
              className={`relative p-3 sm:p-4 rounded-2xl text-center flex flex-col items-center justify-center min-h-[95px] sm:min-h-[110px] transition-all duration-200 border active:scale-95 touch-manipulation
                ${
                  isSelected
                    ? 'glass-card-selected'
                    : 'glass-card'
                }
              `}
            >
              {/* Checkmark badge */}
              <div
                className={`absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-[#FF4F81] text-white scale-100'
                      : 'border border-white/20 text-transparent scale-75'
                  }
                `}
              >
                ✓
              </div>

              {/* Icon */}
              <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow-sm">
                {item.icon}
              </span>

              {/* Item Name */}
              <span className="text-xs sm:text-sm font-semibold text-[#FFF7F9] truncate max-w-full px-1">
                {isSelected ? `✓ ${item.name}` : item.name}
              </span>
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

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-gray-300 hover:text-white active:bg-white/10 transition-colors"
        >
          ← Back
        </button>

        <div className="text-[11px] sm:text-xs text-[#FF8FAB]/80">
          {selectedFoods.length > 0 ? (
            <span>{selectedFoods.length} selected </span>
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