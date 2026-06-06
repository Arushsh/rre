import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import TalentHuntPage from './pages/TalentHuntPage'
import EventsPage from './pages/EventsPage'
import AIHubPage from './pages/AIHubPage'
import GalleryPortal from './pages/GalleryPortal'
import GalleryView from './pages/GalleryView'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import ClientDashboard from './pages/ClientDashboard'
import ClientOnboarding from './pages/ClientOnboarding'
import About from './pages/About'
import Photography from './pages/Photography'
import Videography from './pages/Videography'
import AudioRecording from './pages/AudioRecording'
import MusicProduction from './pages/MusicProduction'
import LiveStreaming from './pages/LiveStreaming'
import PortfolioPage from './pages/PortfolioPage'
import BookingPage from './pages/BookingPage'
import AIAssistant from './components/AIAssistant'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="bg-secondary min-h-screen text-dark flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/talent-hunt" element={<TalentHuntPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/ai-hub" element={<AIHubPage />} />
            <Route path="/gallery" element={<GalleryPortal />} />
            <Route path="/gallery/:slug" element={<GalleryView />} />
            <Route path="/onboarding/:slug" element={<ClientOnboarding />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/videography" element={<Videography />} />
            <Route path="/audio-recording" element={<AudioRecording />} />
            <Route path="/music-production" element={<MusicProduction />} />
            <Route path="/live-streaming" element={<LiveStreaming />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        <AIAssistant />
        <Footer />
      </div>
    </Router>
  )
}

export default App
