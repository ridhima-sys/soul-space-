import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Clock, MessageCircle, Shield, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  chatsCompleted: number;
  status: "online" | "busy";
  languages: string[];
  bio: string;
}

const volunteers: Volunteer[] = [
  {
    id: "v1",
    name: "Sarah M.",
    avatar: "👩‍⚕️",
    specialty: "Anxiety & Stress",
    rating: 4.9,
    chatsCompleted: 1243,
    status: "online",
    languages: ["English", "Hindi"],
    bio: "Certified counselor with 5+ years helping people find calm.",
  },
  {
    id: "v2",
    name: "Arjun K.",
    avatar: "👨‍💼",
    specialty: "Loneliness & Depression",
    rating: 4.8,
    chatsCompleted: 987,
    status: "online",
    languages: ["English", "Hindi", "Punjabi"],
    bio: "I believe everyone deserves to be heard. Let's talk.",
  },
  {
    id: "v3",
    name: "Priya S.",
    avatar: "👩‍🏫",
    specialty: "Self-Esteem & Confidence",
    rating: 4.9,
    chatsCompleted: 1560,
    status: "online",
    languages: ["English", "Hindi"],
    bio: "Your feelings matter. I'm here to listen without judgment.",
  },
  {
    id: "v4",
    name: "Rahul D.",
    avatar: "🧑‍💻",
    specialty: "Life Transitions",
    rating: 4.7,
    chatsCompleted: 645,
    status: "online",
    languages: ["English", "Hindi", "Marathi"],
    bio: "Change is hard. Let's navigate it together.",
  },
  {
    id: "v5",
    name: "Ananya R.",
    avatar: "👩‍🎓",
    specialty: "Grief & Loss",
    rating: 4.9,
    chatsCompleted: 834,
    status: "busy",
    languages: ["English", "Hindi", "Bengali"],
    bio: "Healing takes time. I'll walk with you.",
  },
  {
    id: "v6",
    name: "Vikram P.",
    avatar: "👨‍🔬",
    specialty: "Overthinking & Worry",
    rating: 4.8,
    chatsCompleted: 1102,
    status: "online",
    languages: ["English", "Hindi"],
    bio: "Let's untangle those thoughts together.",
  },
];

interface OnlineVolunteersProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVolunteer: (volunteer: { id: string; name: string }) => void;
  moodName: string;
}

export const OnlineVolunteers = ({
  isOpen,
  onClose,
  onSelectVolunteer,
  moodName,
}: OnlineVolunteersProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (volunteer: Volunteer) => {
    if (volunteer.status === "busy") return;
    setConnecting(volunteer.id);
    setTimeout(() => {
      setConnecting(null);
      onSelectVolunteer({ id: volunteer.id, name: volunteer.name });
    }, 1200);
  };

  const onlineCount = volunteers.filter((v) => v.status === "online").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="gradient-hope p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-primary-foreground">
                  Choose a Volunteer
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-primary-foreground/90">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {onlineCount} volunteers online
                  </span>
                  <span className="text-sm text-primary-foreground/70">
                    • Your mood: {moodName}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Free badge */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-light border border-border">
                <Shield className="w-4 h-4 text-sage" />
                <span className="text-sm text-foreground font-medium">
                  100% Free & Anonymous
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  — No charges, no sign-up, no data stored
                </span>
              </div>
            </div>

            {/* Volunteer list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {volunteers.map((volunteer, index) => (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`
                    relative p-4 rounded-2xl border transition-all duration-200
                    ${
                      volunteer.status === "online"
                        ? "border-border hover:border-primary/40 hover:shadow-md cursor-pointer bg-card"
                        : "border-border/50 opacity-60 cursor-not-allowed bg-muted/30"
                    }
                    ${connecting === volunteer.id ? "ring-2 ring-primary/50 border-primary" : ""}
                  `}
                  onClick={() => handleConnect(volunteer)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center text-2xl">
                        {volunteer.avatar}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${
                          volunteer.status === "online"
                            ? "bg-green-500"
                            : "bg-amber-400"
                        }`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-display font-semibold text-foreground">
                          {volunteer.name}
                        </h4>
                        <span className="flex items-center gap-0.5 text-xs text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {volunteer.rating}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-1">
                        {volunteer.specialty}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {volunteer.bio}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {volunteer.chatsCompleted.toLocaleString()} chats
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {volunteer.status === "online"
                            ? "Available now"
                            : "In a session"}
                        </span>
                      </div>
                    </div>

                    {/* Connect button */}
                    <div className="flex-shrink-0 self-center">
                      {connecting === volunteer.id ? (
                        <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-pulse">
                          Connecting...
                        </div>
                      ) : volunteer.status === "online" ? (
                        <Button
                          variant="hope"
                          size="sm"
                          className="rounded-full"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted">
                          Busy
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-coral" />
                All volunteers are trained listeners dedicated to your wellbeing
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
