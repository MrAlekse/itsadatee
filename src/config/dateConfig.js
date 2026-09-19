export const dateConfig = {
  name: "", 
  senderName: "Your Name",

  backend: {
    // 1. Local or deployed Node.js backend server endpoint
    apiEndpoint: "http://localhost:5000/api/responses",

    // 2. Discord Webhook (Push notification on your phone)
    discordWebhookUrl: "", // e.g. "https://discord.com/api/webhooks/..."

    // 3. Formspree / Web3Forms email endpoint
    formspreeOrWeb3FormsUrl: "", // e.g. "https://formspree.io/f/your_form_id"

    // 4. WhatsApp direct number (with country code e.g. "639123456789")
    whatsappNumber: "", 
  },

  // Step 1: Landing Page & Question
  landing: {
    greeting: "Hi, {name}",
    defaultGreeting: "Hey there 💗",
    namePromptTitle: "May I know your full name?",
    namePlaceholder: "Enter your name...",
    introSubtitle: "I have a question for you...",
    question: "Would you go on a date with me?",
    yesButtonText: "YES 💕",
    initialNoButtonText: "NO",
    personalMessage: "I've been wanting to ask you this for a while, but I'm too shy to say it directly.",
  },

  // Playful NO button phrases
  noButtonPhrases: [
    "No",
    "Are you sure?",
    "Really? 🥺",
    "Think again! 💭",
    "Please? 👉👈",
    "Look at this cute heart! 💕",
    "Are you 100% positive?",
    "I'll bring your favorite snacks! 🍪",
    "Pretty please with cherry on top? 🍒",
    "I'll wait...",
  ],

  // Respectful decline screen
  declinedState: {
    title: "That's okay!",
    message: "No pressure at all! Thank you for taking the time to read this.",
    reconsiderText: "Changed your mind? 🥺",
  },

  // Step 2: Activities
  activitiesTitle: "Yey!",
  activitiesSubtitle: "What date would you like?",
  activities: [
    {
      id: "coffee",
      name: "Coffee Date",
      icon: "☕",
      description: "Try some new coffee shops and cozy flavors together."
    },
    {
      id: "movie",
      name: "Movie Date",
      icon: "🎬",
      description: "Watch a movie and share popcorn together."
    },
    {
      id: "dinner",
      name: "Dinner Date",
      icon: "🍽️",
      description: "Try a new restaurant and delicious dishes together."
    },
    {
      id: "sunset-walk",
      name: "Sunset Date",
      icon: "🌅",
      description: "Let's watch the sunset and get to know each other better."
    },
    {
      id: "arcade",
      name: "Arcade Date",
      icon: "🎮",
      description: "Have fun playing games and friendly competition against each other."
    },
    {
      id: "park-picnic",
      name: "Park / Picnic",
      icon: "🌳",
      description: "Enjoy a relaxing day in the park with a picnic blanket."
    },
    {
      id: "mall-date",
      name: "Mall Date",
      icon: "🛍️",
      description: "Explore the mall, window shopping, and casual strolling."
    },
    {
      id: "art-creative",
      name: "Art & Crafts",
      icon: "🎨",
      description: "Create something beautiful together and keep a keepsake."
    },
    {
      id: "church",
      name: "Church Date",
      icon: "⛪",
      description: "Attend a church service together and reflect on life."
    }
  ],

  // Step 3: Food Selections
  foodTitle: "What are we eating? 🍜",
  foodSubtitle: "Select your craving.",
  foodCategories: {
    casual: {
      categoryName: "American style 🍔",
      items: [
        { id: "burger", name: "Burger", icon: "🍔" },
        { id: "fries", name: "Fries", icon: "🍟" },
        { id: "chicken", name: "Fried Chicken", icon: "🍗" },
        { id: "pizza", name: "Pizza", icon: "🍕" },
        { id: "pasta", name: "Pasta", icon: "🍝" },
      ]
    },
    asian: {
      categoryName: "Asian style 🍜",
      items: [
        { id: "ramen", name: "Ramen", icon: "🍜" },
        { id: "kbbq", name: "BBQ", icon: "🥩" },
        { id: "sushi", name: "Sushi", icon: "🍣" },
        { id: "samgyupsal", name: "Samgyupsal", icon: "🥓" },
      ]
    },
    sweet: {
      categoryName: "Desserts 🍰",
      items: [
        { id: "ice-cream", name: "Ice Cream", icon: "🍦" },
        { id: "cake", name: "Cake & Pastry", icon: "🍰" },
        { id: "donuts", name: "Donuts", icon: "🍩" },
        { id: "waffles", name: "Waffles / Pancakes", icon: "🥞" },
      ]
    },
    drinks: {
      categoryName: "Drinks & Refreshments ☕",
      items: [
        { id: "coffee-drink", name: "Iced / Hot Coffee", icon: "☕" },
        { id: "matcha", name: "Matcha Latte", icon: "🍵" },
        { id: "milktea", name: "Milk Tea", icon: "🧋" },
        { id: "softdrink", name: "Soft Drink", icon: "🥤" },
        { id: "fruittea", name: "Fruit Tea", icon: "🍹" },
      ]
    }
  },

  // Step 4: Date & Time
  dateTimeTitle: "When should I steal you for a while?",
  dateTimeSubtitle: "Choose a date and time that fits your schedule perfectly.",

  // Step 5: Interactive Google Map Location
  locationTitle: "Where should we go?",
  locationSubtitle: "Pinpoint our meeting spot on the map or choose a favorite spot!",
  defaultMapCenter: {
    lat: 11.2433,
    lng: 125.0047,
    city: "Tacloban City",
  },


  // Step 6: Summary Review
  summaryTitle: "So... are we really doing this? 🥺",
  summarySubtitle: "Here is what we plan looks like so far:",

  // Step 7: Final Confirmation Screen
  finalScreen: {
    celebrationTitle: "IT'S A DATE! 💕",
    celebrationSubtitle: "Can't wait to spend some time with you, {name}.",
    sweetNote: "I've locked this into my heart! You can save your official Date Pass ticket below.",
  }
};

export default dateConfig;
