import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationSelection({
  config,
  selectedLocation,
  onSelectLocation,
  onNext,
  onBack,
}) {
  const presets = config.locationPresets || [];

  // Default is Tacloban City
  const defaultPreset = presets.find((p) => p.id === 'tacloban-city') || {
    id: 'tacloban-city',
    name: 'Tacloban City',
    address: 'Tacloban City, Leyte, Philippines',
    lat: 11.2433,
    lng: 125.0047,
  };

  const initialLocation = selectedLocation?.name ? selectedLocation : defaultPreset;

  const [locationState, setLocationState] = useState({
    id: initialLocation.id || 'tacloban-city',
    name: initialLocation.name || 'Tacloban City',
    address: initialLocation.address || 'Tacloban City, Leyte, Philippines',
    lat: initialLocation.lat || 11.2433,
    lng: initialLocation.lng || 125.0047,
  });

  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const city = config.defaultMapCenter?.city || 'Tacloban City';

  // Filtered preset suggestions
  const filteredSuggestions = searchInput.trim()
    ? presets.filter((p) => {
        const q = searchInput.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
        );
      })
    : [];

  // Initialize interactive Leaflet map
  useEffect(() => {
    let isMounted = true;

    const setupMap = () => {
      if (!window.L || !mapContainerRef.current || mapInstanceRef.current) return;

      const pinkHeartIcon = window.L.divIcon({
        className: 'custom-leaflet-heart-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 32px; height: 42px;">
              <svg width="32" height="42" viewBox="0 0 30 40" style="filter: drop-shadow(0 4px 8px rgba(255,79,129,0.6));">
                <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26.2 13.5 38.8 14.3 39.6 C14.7 40 15.3 40 15.7 39.6 C16.5 38.8 30 26.2 30 15 C30 6.7 23.3 0 15 0 Z" fill="#FF4F81" stroke="#FFFFFF" stroke-width="2"/>
                <circle cx="15" cy="14" r="7" fill="#FFFFFF"/>
                <text x="15" y="17.5" text-anchor="middle" font-size="10">💗</text>
              </svg>
            </div>
            <div style="width: 8px; height: 4px; background: rgba(0,0,0,0.5); border-radius: 50%; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      });

      const startLat = locationState.lat || 11.2433;
      const startLng = locationState.lng || 125.0047;

      const map = window.L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: 14,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Real interactive tile map
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Marker
      const marker = window.L.marker([startLat, startLng], {
        icon: pinkHeartIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;
      marker.bindPopup(`<b>${locationState.name}</b><br/><span style="font-size:11px;color:#666;">${locationState.address}</span>`);

      // CLICK ANYWHERE ON MAP TO PIN AN ADDRESS
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);

        let resolvedName = `Pinned Location`;
        let resolvedAddress = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;

        // Check if close to a known preset landmark
        const matchPreset = presets.find((p) => {
          if (!p.lat || !p.lng) return false;
          const dLat = Math.abs(p.lat - lat);
          const dLng = Math.abs(p.lng - lng);
          return dLat < 0.003 && dLng < 0.003;
        });

        if (matchPreset) {
          resolvedName = matchPreset.name;
          resolvedAddress = matchPreset.address;
        } else {
          // Live OpenStreetMap Reverse Geocoding
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                resolvedName = parts[0] || resolvedName;
                resolvedAddress = parts.slice(1, 4).join(',').trim();
              }
            }
          } catch (err) {
            console.warn('Geocoding notice:', err);
          }
        }

        const newLoc = {
          id: matchPreset ? matchPreset.id : 'pinned-address',
          name: resolvedName,
          address: resolvedAddress,
          lat: lat,
          lng: lng,
        };

        setLocationState(newLoc);
        onSelectLocation(newLoc);
        marker.bindPopup(`<b>${resolvedName}</b><br/><span style="font-size:11px;color:#666;">${resolvedAddress}</span>`).openPopup();
        setErrorMsg('');
      });

      // DRAG PIN
      marker.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        let resolvedName = `Pinned Location`;
        let resolvedAddress = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const parts = data.display_name.split(',');
              resolvedName = parts[0] || resolvedName;
              resolvedAddress = parts.slice(1, 4).join(',').trim();
            }
          }
        } catch (err) {
          console.warn('Geocode notice:', err);
        }

        const newLoc = {
          id: 'pinned-address',
          name: resolvedName,
          address: resolvedAddress,
          lat: lat,
          lng: lng,
        };

        setLocationState(newLoc);
        onSelectLocation(newLoc);
        marker.bindPopup(`<b>${resolvedName}</b><br/><span style="font-size:11px;color:#666;">${resolvedAddress}</span>`).openPopup();
      });
    };

    // Load Leaflet CSS & JS from CDN dynamically
    if (!window.L) {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          if (isMounted) setupMap();
        };
        document.head.appendChild(script);
      }
    } else {
      setupMap();
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Preset selector
  const handleSelectPreset = (preset) => {
    const lat = preset.lat || 11.2433;
    const lng = preset.lng || 125.0047;

    const newLoc = {
      id: preset.id,
      name: preset.name,
      address: preset.address,
      lat: lat,
      lng: lng,
    };

    setLocationState(newLoc);
    onSelectLocation(newLoc);
    setSearchInput('');
    setShowSuggestions(false);
    setErrorMsg('');

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 });
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.bindPopup(`<b>${preset.name}</b><br/><span style="font-size:11px;color:#666;">${preset.address}</span>`).openPopup();
    }
  };

  // Search Address / Landmark
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    const query = searchInput.trim();
    setIsSearching(true);
    setShowSuggestions(false);

    // 1. First check local presets (e.g. Robinsons North)
    const localMatch = presets.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (localMatch) {
      handleSelectPreset(localMatch);
      setIsSearching(false);
      return;
    }

    // 2. Real Geocoding search via Nominatim
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ' ' + city
        )}`
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const first = results[0];
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);

          const parts = first.display_name.split(',');
          const newLoc = {
            id: 'search-result',
            name: parts[0] || query,
            address: parts.slice(1, 4).join(',').trim(),
            lat: lat,
            lng: lng,
          };

          setLocationState(newLoc);
          onSelectLocation(newLoc);

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
            markerRef.current.setLatLng([lat, lng]);
            markerRef.current.bindPopup(`<b>${newLoc.name}</b><br/><span style="font-size:11px;color:#666;">${newLoc.address}</span>`).openPopup();
          }
        } else {
          const currentLat = locationState.lat || 11.2433;
          const currentLng = locationState.lng || 125.0047;
          const newLoc = {
            id: 'custom-spot',
            name: query,
            address: `Custom location in ${city}`,
            lat: currentLat,
            lng: currentLng,
          };
          setLocationState(newLoc);
          onSelectLocation(newLoc);
        }
      }
    } catch (err) {
      console.warn('Search notice:', err);
    } finally {
      setIsSearching(false);
      setErrorMsg('');
    }
  };

  // Custom name editing
  const handleSaveCustomName = (e) => {
    if (e) e.preventDefault();
    const finalName = customNameInput.trim() || locationState.name;
    const updated = {
      ...locationState,
      name: finalName,
    };
    setLocationState(updated);
    onSelectLocation(updated);
    setIsEditingName(false);

    if (markerRef.current) {
      markerRef.current.bindPopup(`<b>${finalName}</b><br/><span style="font-size:11px;color:#666;">${updated.address}</span>`).openPopup();
    }
  };

  const handleNext = () => {
    if (!locationState.name) {
      setErrorMsg('Please pin or choose a meeting spot on the map! 📍');
      return;
    }
    setErrorMsg('');
    onSelectLocation(locationState);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl w-full mx-auto px-3 sm:px-4 py-2"
    >
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <span className="text-[11px] uppercase tracking-widest text-[#FF8FAB] font-semibold block mb-1">
          Step 5 • Meeting Spot
        </span>
        <h2 className="text-2xl sm:text-4xl font-cute font-bold text-[#FFF7F9] mb-1.5">
          {config.locationTitle || "Where should we go? 📍"}
        </h2>
        <p className="text-xs sm:text-sm text-[#FFD6E0]/80 max-w-lg mx-auto">
          Click or tap anywhere on the map to pin an exact address, or search!
        </p>
      </div>

      {/* Map Card Container */}
      <div className="glass-panel-glow rounded-3xl p-3 sm:p-5 mb-5 border border-[#FF8FAB]/30 shadow-2xl relative">
        {/* Search Bar with Autocomplete */}
        <div className="relative mb-3 z-30">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-[#1B161B]/95 border border-white/20 rounded-2xl px-3.5 py-2 shadow-inner focus-within:border-[#FF4F81] focus-within:ring-2 focus-within:ring-[#FF4F81]/30 transition-all"
          >
            <span className="text-gray-400 text-base mr-2 select-none">🔍</span>
            <input
              type="text"
              placeholder="Search Robinsons North, Café, Baywalk, Church..."
              value={searchInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none placeholder-gray-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setShowSuggestions(false);
                }}
                className="text-gray-400 hover:text-white text-xs px-2"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching}
              className="ml-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4F81] to-[#FF8FAB] text-white text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
            >
              {isSearching ? 'Finding...' : 'Pin Spot 📍'}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSuggestions && searchInput.trim() && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 right-0 mt-1 bg-[#1A1218]/98 backdrop-blur-xl border border-[#FF8FAB]/40 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5"
              >
                {filteredSuggestions.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#FF4F81]/20 flex items-center gap-3 transition-colors"
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <div className="flex-1 truncate">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {preset.address}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Real Interactive Click-to-Pin Map Viewport */}
        <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#1A1A1A]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Pin Instruction Badge */}
          <div className="absolute top-3 left-3 bg-[#0D0A0B]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FF4F81]/40 text-[11px] sm:text-xs text-white shadow-xl flex items-center gap-2 pointer-events-none z-20">
            <span className="w-2 h-2 rounded-full bg-[#FF4F81] animate-ping" />
            <span>📍 Tap anywhere to pin • Drag to adjust</span>
          </div>
        </div>

        {/* Selected Location Details Card */}
        <div className="mt-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4F81]/20 border border-[#FF4F81]/40 flex items-center justify-center text-xl shrink-0">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-[#FF8FAB] uppercase tracking-wider flex items-center gap-2">
                <span>Current Meeting Destination:</span>
                {!isEditingName && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomNameInput(locationState.name);
                      setIsEditingName(true);
                    }}
                    className="text-gray-400 hover:text-white underline text-[10px] font-normal"
                  >
                    Edit Name ✏️
                  </button>
                )}
              </div>

              {isEditingName ? (
                <form onSubmit={handleSaveCustomName} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    placeholder="Enter custom place name..."
                    autoFocus
                    className="px-2.5 py-1 rounded-lg bg-black/60 border border-[#FF4F81] text-white text-xs font-bold focus:outline-none w-full max-w-[240px]"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-[#FF4F81] text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="text-gray-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="text-sm sm:text-base font-bold text-white truncate" title={locationState.name}>
                    {locationState.name}
                  </div>
                  <div className="text-xs text-gray-400 font-light truncate">
                    {locationState.address}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Open in Google Maps Link */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              locationState.lat && locationState.lng
                ? `${locationState.lat},${locationState.lng}`
                : `${locationState.name},${city}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-[#FFD6E0] font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Open in Google Maps</span>
            <span>↗</span>
          </a>
        </div>

        {/* Quick Pick Location Presets (Tacloban City, Robinsons North, etc.) */}
        <div className="mt-3">
          <span className="text-[11px] font-medium text-gray-400 block mb-1.5">
            Quick Landmark Presets:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {presets.map((preset) => {
              const isSelected = locationState.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 touch-manipulation
                    ${
                      isSelected
                        ? 'bg-[#FF4F81] text-white border-[#FF4F81] shadow-md shadow-[#FF4F81]/40'
                        : 'bg-white/5 text-gray-300 border-white/10 active:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
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
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
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