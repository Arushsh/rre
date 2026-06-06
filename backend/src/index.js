const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const galleryRoutes = require('./routes/galleryRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/galleries', galleryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rre_studio')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Basic Route
app.get('/', (req, res) => {
  res.send('RRE Entertainment API is running');
});

// AI Chat Route
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  console.log('AI Request:', message);
  
  try {
    const msg = message.toLowerCase();
    const isHindi = /[अ-ह]/.test(message);
    let response = "";

    // Knowledge Base
    const knowledge = {
      services: {
        en: "We offer Photography (Wedding, Fashion, Maternity), Videography (Cinematic Films, Ads), Music Production (Beats, Arrangement), and Live Streaming.",
        hi: "हम फोटोग्राफी (शादी, फैशन), वीडियोग्राफी (सिनेमैटिक फिल्में, विज्ञापन), संगीत उत्पादन और लाइव स्ट्रीमिंग की सेवाएं प्रदान करते हैं।"
      },
      booking: {
        en: "You can book a session through our 'Booking' page or by contacting us at +91 99999 99999.",
        hi: "आप हमारे 'बुकिंग' पेज के माध्यम से या +91 99999 99999 पर हमसे संपर्क करके सत्र बुक कर सकते हैं।"
      },
      location: {
        en: "Our main studios are located in Mumbai and Delhi, but we travel worldwide for events.",
        hi: "हमारे मुख्य स्टूडियो मुंबई और दिल्ली में स्थित हैं, लेकिन हम आयोजनों के लिए दुनिया भर में यात्रा करते हैं।"
      },
      pricing: {
        en: "Our photography starts from ₹25,000 and videography from ₹45,000. For detailed quotes, please use our AI Budget Planner in the Events section.",
        hi: "हमारी फोटोग्राफी ₹25,000 से और वीडियोग्राफी ₹45,000 से शुरू होती है। विस्तृत जानकारी के लिए, कृपया हमारे बजट प्लानर का उपयोग करें।"
      }
    };

    if (msg.includes("service") || msg.includes("kya karte ho") || msg.includes("काम")) {
      response = isHindi ? knowledge.services.hi : knowledge.services.en;
    } else if (msg.includes("book") || msg.includes("appointment") || msg.includes("बुकिंग")) {
      response = isHindi ? knowledge.booking.hi : knowledge.booking.en;
    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("कितना") || msg.includes("पैसा")) {
      response = isHindi ? knowledge.pricing.hi : knowledge.pricing.en;
    } else if (msg.includes("where") || msg.includes("location") || msg.includes("कहाँ") || msg.includes("पता")) {
      response = isHindi ? knowledge.location.hi : knowledge.location.en;
    } else if (msg.includes("talent") || msg.includes("hunt") || msg.includes("टैलेंट")) {
      response = isHindi 
        ? "हमारा टैलेंट हंट 2024 गायकों, अभिनेताओं और नर्तकों के लिए खुला है। आप हमारे टैलेंट हंट पेज पर AI-आधारित ऑडिशन के लिए पंजीकरण कर सकते हैं।"
        : "Our Talent Hunt 2024 is open for singers, actors, and dancers. You can register on our Talent Hunt page for an AI-powered audition.";
    } else if (msg.includes("ai") || msg.includes("face") || msg.includes("search")) {
      response = isHindi
        ? "हमारा उन्नत AI चेहरा पहचान सिस्टम आपको गैलरी में अपनी तस्वीरें तुरंत ढूंढने में मदद करता है। बस एक सेल्फी अपलोड करें!"
        : "Our advanced AI face recognition system helps you find your photos in galleries instantly. Just upload a selfie!";
    } else if (msg.includes("owner") || msg.includes("who is rajat") || msg.includes("मालिक")) {
      response = isHindi
        ? "रजत राज एंटरटेनमेंट के संस्थापक रजत राज हैं, जो एक प्रसिद्ध मीडिया विशेषज्ञ और संगीत निर्माता हैं।"
        : "Rajat Raj Entertainment was founded by Rajat Raj, a renowned media expert and music producer.";
    } else {
      // Fallback to a smart generic response
      response = isHindi
        ? `आपका प्रश्न "${message}" बहुत अच्छा है। मैं रजत राज एंटरटेनमेंट के बारे में आपकी सहायता करने के लिए यहाँ हूँ। क्या आप हमारी सेवाओं, बुकिंग या टैलेंट हंट के बारे में और जानना चाहेंगे?`
        : `Your question "${message}" is very interesting. I am here to help you with anything related to Rajat Raj Entertainment. Would you like to know more about our services, booking process, or the Talent Hunt?`;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    res.json({ text: response });
  } catch (error) {
    res.status(500).json({ error: "AI Assistant is currently unavailable." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
