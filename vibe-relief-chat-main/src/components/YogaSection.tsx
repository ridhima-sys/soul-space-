import { motion } from "framer-motion";
import { Play, Clock, Star, Leaf, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface YogaSession {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
  youtubeId: string;
}

const yogaSessions: YogaSession[] = [
  {
    id: "1",
    title: "Morning Calm",
    duration: "10 min",
    level: "Beginner",
    description: "Gentle stretches to start your day with peace and clarity",
    gradient: "from-sage-light to-sage/30",
    icon: <Leaf className="w-6 h-6" />,
    youtubeId: "VaoV1PrYft4",
  },
  {
    id: "2",
    title: "Anxiety Relief",
    duration: "15 min",
    level: "All Levels",
    description: "Breathing exercises and poses to calm racing thoughts",
    gradient: "from-lavender-light to-lavender/30",
    icon: <Star className="w-6 h-6" />,
    youtubeId: "hJbRpHZr_d0",
  },
  {
    id: "3",
    title: "Deep Relaxation",
    duration: "20 min",
    level: "Beginner",
    description: "Restorative yoga to release tension and find inner peace",
    gradient: "from-sky-light to-sky/30",
    icon: <Star className="w-6 h-6" />,
    youtubeId: "v7SN-d4qXx0",
  },
  {
    id: "4",
    title: "Evening Wind Down",
    duration: "12 min",
    level: "All Levels",
    description: "Prepare your body and mind for restful sleep",
    gradient: "from-coral-light to-coral/30",
    icon: <Leaf className="w-6 h-6" />,
    youtubeId: "BiWDsfZ3zbo",
  },
];

export const YogaSection = () => {
  const [activeSession, setActiveSession] = useState<YogaSession | null>(null);

  return (
    <section className="py-20 px-4 gradient-calm">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sage-light text-sage text-sm font-medium mb-4">
            Guided Sessions
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Yoga & Mindfulness
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Gentle practices designed to help you reconnect with your body,
            calm your mind, and find moments of peace.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {yogaSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              onClick={() => setActiveSession(session)}
              className="group cursor-pointer"
            >
              <div className={`
                relative overflow-hidden rounded-3xl p-6 h-full
                bg-gradient-to-br ${session.gradient}
                border border-border/50 hover:border-primary/30
                transition-all duration-300 hover:shadow-xl
              `}>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-card/80 text-primary">
                      {session.icon}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-card/80 px-2 py-1 rounded-full">
                      {session.level}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {session.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {session.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {session.duration}
                    </div>

                    <Button
                      variant="calm"
                      size="sm"
                      className="rounded-full gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSession(session);
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {activeSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setActiveSession(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveSession(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/90 hover:bg-card text-foreground shadow-md"
              aria-label="Close session"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeSession.youtubeId}?autoplay=1&rel=0`}
              title={activeSession.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </motion.div>
        </div>
      )}
    </section>
  );
};
