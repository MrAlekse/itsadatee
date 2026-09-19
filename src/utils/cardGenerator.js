export const downloadDateCardImage = (details) => {
  const {
    recipientName = "",
    senderName = "",
    date = "Not set",
    time = "Not set",
    activities = [],
    foods = [],
    location = "Somewhere Special"
  } = details;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // 2x scale for Retina sharpness (width 800px, height 1100px)
  const width = 800;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;

  // 1. Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#190D15");
  bgGrad.addColorStop(0.5, "#0D0A0B");
  bgGrad.addColorStop(1, "#210C1A");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ticket outer card with rounded corners
  const cardX = 40;
  const cardY = 40;
  const cardW = width - 80;
  const cardH = height - 80;
  const radius = 28;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = "rgba(32, 19, 29, 0.85)";
  ctx.fill();

  // Glowing romantic border
  ctx.lineWidth = 3;
  const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  borderGrad.addColorStop(0, "#FF4F81");
  borderGrad.addColorStop(0.5, "#FF8FAB");
  borderGrad.addColorStop(1, "#FFD6E0");
  ctx.strokeStyle = borderGrad;
  ctx.stroke();
  ctx.restore();

  // 3. Ticket header
  ctx.textAlign = "center";
  ctx.fillStyle = "#FF8FAB";
  ctx.font = "bold 18px sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("SEE YOU THERE!", width / 2, 100);

  ctx.fillStyle = "#FFF7F9";
  ctx.font = "bold 44px sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("💕 IT'S A DATE! 💕", width / 2, 155);

  ctx.fillStyle = "#FFD6E0";
  ctx.font = "italic 20px Georgia, serif";
  ctx.fillText(`Dedicated to ${recipientName}`, width / 2, 195);

  // Dotted separator line
  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "rgba(255, 143, 171, 0.35)";
  ctx.beginPath();
  ctx.moveTo(80, 230);
  ctx.lineTo(width - 80, 230);
  ctx.stroke();
  ctx.restore();

  // 4. Ticket notch cutouts left & right
  ctx.fillStyle = "#0D0A0B";
  ctx.beginPath();
  ctx.arc(cardX, 230, 22, 0, Math.PI * 2);
  ctx.arc(cardX + cardW, 230, 22, 0, Math.PI * 2);
  ctx.fill();

  // 5. Details Section
  const startY = 280;
  const colLeft = 90;
  const colRight = width / 2 + 20;

  const drawField = (label, value, x, y, icon = "✦") => {
    ctx.textAlign = "left";
    ctx.fillStyle = "#FF8FAB";
    ctx.font = "bold 15px sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText(`${icon} ${label.toUpperCase()}`, x, y);

    ctx.fillStyle = "#FFF7F9";
    ctx.font = "600 22px sans-serif";
    ctx.fillText(value, x, y + 28);
  };

  drawField("Date", date, colLeft, startY, "📅");
  drawField("Time", time, colRight, startY, "⏰");

  // Location across bottom of top grid
  drawField("Location", location, colLeft, startY + 85, "📍");

  // Activities
  const actY = startY + 185;
  ctx.textAlign = "left";
  ctx.fillStyle = "#FF8FAB";
  ctx.font = "bold 15px sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("🎯 PLANNED ACTIVITIES", colLeft, actY);

  ctx.fillStyle = "#FFE5EC";
  ctx.font = "19px sans-serif";
  const activityList = activities.length > 0 ? activities.join("  •  ") : "Relaxing & enjoying together";
  ctx.fillText(activityList, colLeft, actY + 30);

  // Foods
  const foodY = actY + 85;
  ctx.fillStyle = "#FF8FAB";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("🍕 MENU HIGHLIGHTS", colLeft, foodY);

  ctx.fillStyle = "#FFE5EC";
  ctx.font = "19px sans-serif";
  const foodList = foods.length > 0 ? foods.join("  •  ") : "Delicious treats of your choice";
  ctx.fillText(foodList, colLeft, foodY + 30);

  // Sweet message box
  const noteBoxY = foodY + 80;
  ctx.fillStyle = "rgba(255, 79, 129, 0.12)";
  ctx.beginPath();
  ctx.roundRect(80, noteBoxY, width - 160, 110, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 79, 129, 0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFF7F9";
  ctx.font = "italic 19px Georgia, serif";
  ctx.fillText(`"Can\'t wait to see you there, ${recipientName}!"`, width / 2, noteBoxY + 45);
  ctx.fillText('I hope you\'ll have a wonderful time!', width / 2, noteBoxY + 75);

  // Barcode / Ticket Footer
  const footerY = 930;
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgba(255, 143, 171, 0.25)";
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();
  ctx.restore();

  // Faux Barcode
  const barY = footerY + 25;
  const barStartX = width / 2 - 140;
  ctx.fillStyle = "#FF8FAB";
  for (let i = 0; i < 48; i++) {
    const barW = (i % 3 === 0 || i % 7 === 0) ? 5 : 2;
    ctx.fillRect(barStartX + i * 6, barY, barW, 40);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFD6E0";
  ctx.font = "13px monospace";
  ctx.letterSpacing = "2px";
  ctx.fillText("TICKET NO: #DATE-2026", width / 2, barY + 60);

  // Download Trigger
  const imageURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `Our-Date-Invitation-Pass-${recipientName}.png`;
  link.href = imageURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
