# 💌 Romantic & Interactive Date Invitation Website

A modern, cute, romantic interactive date invitation web application built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 What's New & Updated

1. **Vibe Step Removed**: The entire workflow is now streamlined into 6 focused steps (Question 💌 → Activities ✨ → Food 🍕 → Date & Time 📅 → Google Maps Location 📍 → Confirmation 💗).
2. **Interactive Google Maps Pinpoint Location**:
   - Google Maps-styled search bar (search any custom café, landmark, or venue).
   - **Click-to-pin**: Tap anywhere on the cartography map to drop an animated bouncing 3D pin with real-time coordinates and custom popup InfoWindow.
   - Quick preset chips (Cozy Café, Sunset Baywalk, Church/Cathedral, Scenic Park, Mall, Romantic Restaurant, Surprise Me).
   - Live Google Maps Embed preview + direct "Open in Google Maps ↗" button.
3. **Dedicated Backend & Response Capture**:
   - Ready-to-run Node.js / Express server in `server/server.js`.
   - Saves responses to `server/responses.json`.
   - Prints a celebration banner directly in your terminal.
   - Built-in web dashboard at `http://localhost:5000` to view responses in your browser.
   - Supports zero-server options: Discord Webhooks, Formspree/Web3Forms email, and direct WhatsApp sharing.

---

## 🚀 How to Run

### 1. Frontend Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Backend Server (To receive responses locally)
```bash
npm run server
```
- Listens on `http://localhost:5000`.
- Whenever she completes the date plan, her responses will print in your terminal and be saved in `server/responses.json`.
- Open `http://localhost:5000` in your browser to view the visual responses dashboard!

---

## 📬 How to Receive Her Responses (All Options)

### Option A: Local / Deployed Backend Server (Included!)
- Run `npm run server`.
- Her choices automatically save to `server/responses.json` and display on `http://localhost:5000`.

### Option B: Discord Webhook (Zero Hosting — Best for Mobile Notifications)
1. In Discord: **Server Settings** → **Integrations** → **Webhooks** → **New Webhook**.
2. Copy the Webhook URL.
3. Paste it in `src/config/dateConfig.js` under `backend.discordWebhookUrl`:
   ```javascript
   backend: {
     discordWebhookUrl: "https://discord.com/api/webhooks/...",
   }
   ```
4. When she confirms, an instant pink embed notification with her full itinerary and Google Maps link will pop up on your phone!

### Option C: Free Email Forwarding
1. Get a free form ID at [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com).
2. Paste it in `src/config/dateConfig.js` under `backend.formspreeOrWeb3FormsUrl`.

### Option D: Direct WhatsApp / Share Sheet
1. Put your phone number in `src/config/dateConfig.js` under `backend.whatsappNumber` (e.g., `639123456789`).
2. A green "Send on WhatsApp" button will appear on the final celebration screen, pre-filling her complete itinerary.
