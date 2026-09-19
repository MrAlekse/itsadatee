/**
 * Automatically sends her date selections to your backend, Discord, or Email.
 */
export async function sendDateResponse(datePlan, config) {
  const recipientName = config.name || "Annika";
  const senderName = config.senderName || "You";

  const locationDisplay = typeof datePlan.location === 'object'
    ? (datePlan.location?.name || 'Somewhere Special')
    : (datePlan.location || 'Somewhere Special');

  const locationAddress = typeof datePlan.location === 'object'
    ? (datePlan.location?.address || '')
    : '';

  const selectedActivityObjs = config.activities?.filter((a) =>
    datePlan.activities?.includes(a.id)
  ) || [];

  const allFoods = Object.values(config.foodCategories || {}).flatMap((c) => c.items);
  const selectedFoodObjs = allFoods.filter((f) => datePlan.foods?.includes(f.id));

  const activitiesText = selectedActivityObjs.map((a) => `${a.icon} ${a.name}`).join(', ') || 'None selected';
  const foodsText = selectedFoodObjs.map((f) => `${f.icon} ${f.name}`).join(', ') || 'None selected';

  const payload = {
    recipient: recipientName,
    sender: senderName,
    date: datePlan.date,
    time: datePlan.time,
    location: locationDisplay,
    locationAddress: locationAddress,
    activities: activitiesText,
    foods: foodsText,
    timestamp: new Date().toISOString(),
  };

  const results = {
    backend: false,
    discord: false,
    email: false,
  };

  // 1. Custom Node.js Backend Server (runs on localhost:5000 or custom deployed URL)
  const backendUrl = config.backend?.apiEndpoint;
  if (backendUrl) {
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) results.backend = true;
    } catch (err) {
      // Backend not running locally or unreachable - silent fallback
      console.log("Local backend not running or unreachable.");
    }
  }

  // 2. Discord Webhook (Instant Mobile Notification)
  const discordUrl = config.backend?.discordWebhookUrl;
  if (discordUrl && discordUrl.startsWith("http")) {
    try {
      const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationDisplay)}`;
      const discordEmbed = {
        embeds: [
          {
            title: `💕 She said YES to the Date! 💕`,
            description: `**${recipientName}** just finalized the date invitation plan!`,
            color: 16732033, // Hex #FF4F81
            fields: [
              { name: "📅 Date", value: datePlan.date || "TBD", inline: true },
              { name: "⏰ Time", value: datePlan.time || "TBD", inline: true },
              { name: "📍 Pinned Location", value: `[${locationDisplay}](${gmapsLink})${locationAddress ? `\n*${locationAddress}*` : ''}`, inline: false },
              { name: "🎯 Planned Activities", value: activitiesText, inline: false },
              { name: "🍕 Food & Drinks", value: foodsText, inline: false },
            ],
            footer: {
              text: `Date Invitation for ${recipientName} • Planned with ${senderName}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const res = await fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordEmbed),
      });

      if (res.ok) results.discord = true;
    } catch (err) {
      console.warn("Discord webhook error:", err);
    }
  }

  // 3. Formspree / Web3Forms Email endpoint
  const emailUrl = config.backend?.formspreeOrWeb3FormsUrl;
  if (emailUrl && emailUrl.startsWith("http")) {
    try {
      const res = await fetch(emailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) results.email = true;
    } catch (err) {
      console.warn("Email service error:", err);
    }
  }

  return results;
}
