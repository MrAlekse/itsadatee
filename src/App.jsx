import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import dateConfig from './config/dateConfig';
import { musicPlayer } from './utils/audio';
import { sendDateResponse } from './utils/sendResponse';

// Components
import Welcome from './components/Welcome';
import ActivitySelection from './components/ActivitySelection';
import FoodSelection from './components/FoodSelection';
import DateSelection from './components/DateSelection';
import LocationSelection from './components/LocationSelection';
import DateSummary from './components/DateSummary';
import FinalScreen from './components/FinalScreen';
import ProgressBar from './components/ProgressBar';
import FloatingHearts from './components/FloatingHearts';

export default function App() {
  // Read name dynamically from URL query parameter (e.g. ?to=Annika or ?name=Sarah)
  const getInitialName = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('to') || params.get('name');
      if (urlName && urlName.trim()) {
        return urlName.trim();
      }
    }
    return dateConfig.name || '';
  };

  const [recipientName, setRecipientName] = useState(getInitialName);

  // Navigation & Progress state (Steps 1 to 7)
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  // Background music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Date Plan state
  const [hasAccepted, setHasAccepted] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState(['coffee', 'dinner']);
  const [selectedFoods, setSelectedFoods] = useState(['pizza', 'ice-cream', 'coffee-drink']);

  // Default date suggestion: 2 days in the future
  const getInitialDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState('18:00');

  const [selectedLocation, setSelectedLocation] = useState({
    id: 'tacloban-city',
    name: 'Tacloban City',
    address: 'Tacloban City, Leyte, Philippines',
    lat: 11.2433,
    lng: 125.0047,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // Sync maxStepReached and scroll smoothly to top
  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    if (stepNumber > maxStepReached) {
      setMaxStepReached(stepNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Music toggle handler
  const handleToggleMusic = () => {
    const playing = musicPlayer.toggle();
    setIsMusicPlaying(playing);
  };

  // Step 1: Accepted the initial question
  const handleAcceptInvitation = () => {
    setHasAccepted(true);
    goToStep(2);
  };

  // Activity toggling
  const handleToggleActivity = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Food toggling
  const handleToggleFood = (foodId) => {
    setSelectedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  };

  // Final confirmation: trigger automatic notification to backend/discord/email
  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      const plan = {
        hasAccepted: true,
        recipient: recipientName,
        activities: selectedActivities,
        foods: selectedFoods,
        date: selectedDate,
        time: selectedTime,
        location: selectedLocation,
      };
      const activeConfig = {
        ...dateConfig,
        name: recipientName,
      };
      const res = await sendDateResponse(plan, activeConfig);
      if (res.backend || res.discord || res.email) {
        setNotificationSent(true);
      }
    } catch (err) {
      console.warn("Notice during submission:", err);
    } finally {
      setIsSubmitting(false);
      goToStep(7); // Final celebratory screen
    }
  };

  // Start Over flow
  const handleStartOver = () => {
    setCurrentStep(1);
    setMaxStepReached(1);
    setHasAccepted(false);
    setNotificationSent(false);
  };

  // Active configuration with dynamic recipient name
  const currentConfig = {
    ...dateConfig,
    name: recipientName || 'You',
  };

  // Aggregated date plan data
  const datePlan = {
    hasAccepted,
    recipient: recipientName,
    activities: selectedActivities,
    foods: selectedFoods,
    date: selectedDate,
    time: selectedTime,
    location: selectedLocation,
  };

  return (
    <div className="relative min-h-screen bg-[#0D0A0B] bg-ambient-glow text-[#FFF7F9] flex flex-col justify-between overflow-x-hidden">
      {/* Ambient floating romantic particles */}
      <FloatingHearts count={20} />

      {/* Top App Header / Bar (Mobile-friendly touch spacing) */}
      <header className="relative z-30 w-full px-3 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
        </div>

        {/* Music Player Button */}
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={isMusicPlaying ? 'Mute romantic ambient music' : 'Play romantic ambient music'}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 backdrop-blur-md active:scale-95 touch-manipulation
            ${
              isMusicPlaying
                ? 'bg-[#FF4F81]/25 border-[#FF4F81] text-[#FFF7F9] shadow-sm shadow-[#FF4F81]/50'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }
          `}
        >
          <span>{isMusicPlaying ? '🔊' : '🔇'}</span>
          <span className="text-[11px] sm:text-xs">
            {isMusicPlaying ? 'Music On' : 'Music Off'}
          </span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-1 sm:px-4 py-2 sm:py-4 pb-12">
        {/* Top Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          maxStepReached={maxStepReached}
          onStepClick={goToStep}
        />

        {/* Step Transition Screens */}
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome / Invitation Question */}
          {currentStep === 1 && (
            <Welcome
              key="step-welcome"
              config={currentConfig}
              recipientName={recipientName}
              onUpdateName={setRecipientName}
              onAccept={handleAcceptInvitation}
            />
          )}

          {/* Step 2: Activity Selection */}
          {currentStep === 2 && (
            <ActivitySelection
              key="step-activity"
              config={currentConfig}
              selectedActivities={selectedActivities}
              onToggleActivity={handleToggleActivity}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {/* Step 3: Food Selection */}
          {currentStep === 3 && (
            <FoodSelection
              key="step-food"
              config={currentConfig}
              selectedFoods={selectedFoods}
              onToggleFood={handleToggleFood}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}

          {/* Step 4: Date & Time */}
          {currentStep === 4 && (
            <DateSelection
              key="step-date"
              config={currentConfig}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onChangeDate={setSelectedDate}
              onChangeTime={setSelectedTime}
              onNext={() => goToStep(5)}
              onBack={() => goToStep(3)}
            />
          )}

          {/* Step 5: Pinpoint Google Map Location */}
          {currentStep === 5 && (
            <LocationSelection
              key="step-location"
              config={currentConfig}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              onNext={() => goToStep(6)}
              onBack={() => goToStep(4)}
            />
          )}

          {/* Step 6: Summary Review & Tweak */}
          {currentStep === 6 && (
            <DateSummary
              key="step-summary"
              config={currentConfig}
              datePlan={datePlan}
              isSubmitting={isSubmitting}
              onConfirm={handleFinalConfirm}
              onEditStep={(targetStep) => goToStep(targetStep)}
              onBack={() => goToStep(5)}
            />
          )}

          {/* Step 7: Final Celebration Screen */}
          {currentStep === 7 && (
            <FinalScreen
              key="step-final"
              config={currentConfig}
              datePlan={datePlan}
              notificationSent={notificationSent}
              onStartOver={handleStartOver}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
