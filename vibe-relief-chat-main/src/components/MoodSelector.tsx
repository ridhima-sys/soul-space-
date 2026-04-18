import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  CloudRain, 
  Zap,
  Moon,
  Sun
} from "lucide-react";

interface Mood {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

const moods: Mood[] = [
  {
    id: "sad",
    name: "Feeling Sad",
    icon: <Frown className="w-8 h-8" />,
    color: "text-sky",
    bgColor: "bg-sky-light hover:bg-sky/20",
    description: "It's okay to feel down sometimes"
  },
  {
    id: "anxious",
    name: "Anxious",
    icon: <Zap className="w-8 h-8" />,
    color: "text-coral",
    bgColor: "bg-coral-light hover:bg-coral/20",
    description: "Let's calm those racing thoughts"
  },
  {
    id: "lonely",
    name: "Lonely",
    icon: <Moon className="w-8 h-8" />,
    color: "text-lavender",
    bgColor: "bg-lavender-light hover:bg-lavender/20",
    description: "You're not alone, we're here"
  },
  {
    id: "stressed",
    name: "Stressed",
    icon: <CloudRain className="w-8 h-8" />,
    color: "text-sage",
    bgColor: "bg-sage-light hover:bg-sage/20",
    description: "Time to release that tension"
  },
  {
    id: "neutral",
    name: "Just Okay",
    icon: <Meh className="w-8 h-8" />,
    color: "text-warm",
    bgColor: "bg-warm-light hover:bg-warm/20",
    description: "Let's make today better"
  },
  {
    id: "hopeful",
    name: "Hopeful",
    icon: <Sun className="w-8 h-8" />,
    color: "text-primary",
    bgColor: "bg-sage-light hover:bg-sage/20",
    description: "Beautiful! Let's nurture that"
  },
  {
    id: "grateful",
    name: "Grateful",
    icon: <Heart className="w-8 h-8" />,
    color: "text-coral",
    bgColor: "bg-coral-light hover:bg-coral/20",
    description: "Gratitude is powerful"
  },
  {
    id: "happy",
    name: "Happy",
    icon: <Smile className="w-8 h-8" />,
    color: "text-sage",
    bgColor: "bg-sage-light hover:bg-sage/20",
    description: "Wonderful! Share the joy"
  },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

export const MoodSelector = ({ onMoodSelect }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood.id);
    setTimeout(() => onMoodSelect(mood), 300);
  };

  return (
    <section id="mood-selector" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            How are you feeling right now?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            There's no right or wrong answer. Select what resonates with you, 
            and we'll connect you with someone who understands.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMoodClick(mood)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${mood.bgColor}
                ${selectedMood === mood.id 
                  ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                  : 'border-transparent'
                }
              `}
            >
              <div className={`${mood.color} mb-3 flex justify-center`}>
                {mood.icon}
              </div>
              <h3 className="font-display font-medium text-foreground mb-1">
                {mood.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {mood.description}
              </p>
              
              {selectedMood === mood.id && (
                <motion.div
                  layoutId="mood-selected"
                  className="absolute inset-0 border-2 border-primary rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
