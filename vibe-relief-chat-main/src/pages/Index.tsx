import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MoodSelector } from "@/components/MoodSelector";
import { OnlineVolunteers } from "@/components/OnlineVolunteers";
import { VolunteerChat } from "@/components/VolunteerChat";
import { YogaSection } from "@/components/YogaSection";
import { RelaxationSection } from "@/components/RelaxationSection";
import { Footer } from "@/components/Footer";

interface Mood {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedVolunteerName, setSelectedVolunteerName] = useState("");

  const handleGetStarted = () => {
    document.getElementById('mood-selector')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setShowVolunteers(true);
  };

  const handleVolunteerSelect = (volunteer: { id: string; name: string }) => {
    setSelectedVolunteerName(volunteer.name);
    setShowVolunteers(false);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero onGetStarted={handleGetStarted} />
      
      <MoodSelector onMoodSelect={handleMoodSelect} />
      
      <div id="yoga">
        <YogaSection />
      </div>
      
      <div id="relaxation">
        <RelaxationSection />
      </div>
      
      <Footer />

      <OnlineVolunteers
        isOpen={showVolunteers}
        onClose={() => setShowVolunteers(false)}
        onSelectVolunteer={handleVolunteerSelect}
        moodName={selectedMood?.name || ""}
      />
      
      <VolunteerChat
        mood={selectedMood}
        volunteerName={selectedVolunteerName}
        isOpen={isChatOpen}
        onClose={handleChatClose}
      />
    </div>
  );
};

export default Index;
