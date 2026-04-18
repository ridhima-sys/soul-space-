import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Wind, Sparkles, Brain, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface VideoContent {
  id: string;
  title: string;
  duration: string;
  category: string;
  gradient: string;
  youtubeId: string;
}

const videoContent: VideoContent[] = [
  {
    id: "1",
    title: "Sunset Meditation",
    duration: "10:00",
    category: "Guided",
    gradient: "from-coral/40 to-warm/40",
    youtubeId: "inpok4MKVLM",
  },
  {
    id: "2",
    title: "Forest Walk",
    duration: "15:00",
    category: "Nature",
    gradient: "from-sage/40 to-primary/40",
    youtubeId: "xNN7iTA57jM",
  },
  {
    id: "3",
    title: "Breathing Exercise",
    duration: "5:00",
    category: "Technique",
    gradient: "from-sky/40 to-lavender/40",
    youtubeId: "tEmt1Znux58",
  },
];

type GameId = "breathe" | "pop" | "memory";

interface Game {
  id: GameId;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const games: Game[] = [
  {
    id: "breathe",
    name: "Breathing Bubble",
    description: "Follow the bubble — inhale, hold, exhale. Calm in 60 seconds.",
    icon: <Wind className="w-7 h-7" />,
    color: "text-sky",
    bgColor: "from-sky-light to-sky/20",
  },
  {
    id: "pop",
    name: "Bubble Pop",
    description: "Pop floating bubbles — a satisfying stress reliever.",
    icon: <Sparkles className="w-7 h-7" />,
    color: "text-lavender",
    bgColor: "from-lavender-light to-lavender/20",
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Match pairs of soothing symbols. Gentle focus practice.",
    icon: <Brain className="w-7 h-7" />,
    color: "text-sage",
    bgColor: "from-sage-light to-sage/20",
  },
];

// ---------------- Breathing Bubble ----------------
const BreathingGame = () => {
  const phases = [
    { label: "Breathe in", duration: 4000, scale: 1.6 },
    { label: "Hold", duration: 2000, scale: 1.6 },
    { label: "Breathe out", duration: 6000, scale: 1 },
  ];
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, phases[phaseIndex].duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex]);

  const phase = phases[phaseIndex];

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-8">
      <motion.div
        animate={{ scale: phase.scale }}
        transition={{ duration: phase.duration / 1000, ease: "easeInOut" }}
        className="w-40 h-40 rounded-full bg-gradient-to-br from-sky to-lavender shadow-2xl flex items-center justify-center"
      >
        <div className="w-32 h-32 rounded-full bg-card/30 backdrop-blur-sm" />
      </motion.div>
      <p className="font-display text-2xl text-foreground">{phase.label}</p>
      <p className="text-sm text-muted-foreground">Follow the bubble at your own pace</p>
    </div>
  );
};

// ---------------- Bubble Pop ----------------
interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const bubbleColors = [
  "from-sky to-lavender",
  "from-coral to-warm",
  "from-sage to-primary",
  "from-lavender to-coral",
];

const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const idRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev.slice(-12),
        {
          id: idRef.current++,
          x: Math.random() * 85,
          size: 40 + Math.random() * 50,
          duration: 5 + Math.random() * 4,
          delay: 0,
          color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        },
      ]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const pop = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-light/40 to-lavender-light/40">
      <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-card/90 text-foreground text-sm font-medium shadow-md">
        Popped: {score}
      </div>
      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.button
            key={b.id}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "-110%", opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: b.duration, ease: "linear" }}
            onClick={() => pop(b.id)}
            onAnimationComplete={() =>
              setBubbles((prev) => prev.filter((x) => x.id !== b.id))
            }
            style={{
              left: `${b.x}%`,
              width: b.size,
              height: b.size,
            }}
            className={`absolute bottom-0 rounded-full bg-gradient-to-br ${b.color} shadow-lg cursor-pointer hover:scale-110 transition-transform`}
            aria-label="Pop bubble"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ---------------- Memory Match ----------------
const symbols = ["🌸", "🍃", "🌙", "☁️", "🌊", "✨", "🕊️", "🌿"];

interface MemoryCard {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

const buildDeck = (): MemoryCard[] => {
  const deck = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));
  return deck;
};

const MemoryGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (selected.length === 2) {
      const [a, b] = selected;
      const cardA = cards[a];
      const cardB = cards[b];
      setMoves((m) => m + 1);
      if (cardA.symbol === cardB.symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            )
          );
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
        }, 900);
      }
    }
  }, [selected, cards]);

  const flip = (id: number) => {
    if (selected.length === 2) return;
    if (cards[id].flipped || cards[id].matched) return;
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setSelected((prev) => [...prev, id]);
  };

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">Moves: <span className="font-medium text-foreground">{moves}</span></span>
        <button
          onClick={reset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card hover:bg-muted text-foreground text-sm border border-border transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {allMatched && (
        <p className="font-display text-lg text-primary">You did it! 🎉 Take a deep breath.</p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => flip(card.id)}
            className={`
              w-16 h-16 md:w-20 md:h-20 rounded-xl text-3xl md:text-4xl
              flex items-center justify-center transition-all duration-300
              ${card.flipped || card.matched
                ? "bg-gradient-to-br from-sage-light to-lavender-light"
                : "bg-gradient-to-br from-primary/80 to-sky/80 hover:from-primary hover:to-sky"}
              ${card.matched ? "opacity-60" : ""}
              shadow-md
            `}
            disabled={card.matched}
          >
            {(card.flipped || card.matched) ? card.symbol : ""}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ---------------- Main Section ----------------
export const RelaxationSection = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoContent | null>(null);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-lavender-light text-lavender text-sm font-medium mb-4">
              Mini Games
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Calming Games
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Light, soothing games to gently shift your mood and quiet your mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                onClick={() => setActiveGame(game)}
                className={`
                  relative text-left p-6 rounded-2xl bg-gradient-to-br ${game.bgColor}
                  border border-border/50 hover:border-primary/30
                  hover:shadow-xl transition-all duration-300
                `}
              >
                <div className={`mb-4 ${game.color}`}>{game.icon}</div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {game.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <Play className="w-4 h-4" />
                  Play
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-coral-light text-coral text-sm font-medium mb-4">
              Video Library
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Calming Videos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch soothing content designed to help you unwind and find your inner peace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videoContent.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className={`
                  relative aspect-video rounded-2xl overflow-hidden
                  bg-gradient-to-br ${video.gradient}
                  border border-border/50
                `}>
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 group-hover:bg-foreground/10 transition-colors">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-card/90 flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-6 h-6 text-primary ml-1" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-foreground/80 text-background text-xs font-medium">
                    {video.duration}
                  </div>

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/80 text-foreground text-xs font-medium">
                    {video.category}
                  </div>
                </div>

                <h3 className="font-display font-medium text-foreground mt-3">
                  {video.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Game Modal */}
      {activeGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setActiveGame(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-2xl bg-card rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={activeGame.color}>{activeGame.icon}</div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {activeGame.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveGame(null)}
                className="p-2 rounded-full hover:bg-muted text-foreground"
                aria-label="Close game"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {activeGame.id === "breathe" && <BreathingGame />}
              {activeGame.id === "pop" && <BubblePopGame />}
              {activeGame.id === "memory" && <MemoryGame />}
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/90 hover:bg-card text-foreground shadow-md"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              title={activeVideo.title}
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
