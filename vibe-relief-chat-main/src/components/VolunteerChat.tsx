import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, X, User, Loader2, Phone, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "volunteer" | "system";
  timestamp: Date;
}

interface VolunteerChatProps {
  mood: { id: string; name: string } | null;
  volunteerName: string;
  isOpen: boolean;
  onClose: () => void;
}

// More natural, human-like conversation flows per mood
const conversationFlows: Record<string, string[][]> = {
  sad: [
    [
      "Hey... I can see you're going through a tough time. I'm here, take your time 💙",
      "You know, it's completely okay to feel this way. Sadness isn't weakness — it's being human.",
      "I've been through dark days too. What matters is that you reached out today.",
    ],
    [
      "That sounds really heavy. Thank you for trusting me with this.",
      "Sometimes just saying things out loud helps, even a little bit. I'm listening.",
      "You're stronger than you think. The fact that you're here proves that.",
    ],
    [
      "I hear you. And I want you to know — this feeling won't last forever.",
      "Would it help to try a small thing? Like stepping outside for 2 minutes, or drinking some water?",
      "You deserve kindness — especially from yourself. Remember that. 🌿",
    ],
  ],
  anxious: [
    [
      "Hey, let's slow down together for a moment. You're safe here. 🌸",
      "Anxiety lies to us — it says everything is urgent. But right now, nothing bad is happening. You're okay.",
      "Try this with me: breathe in for 4 counts... hold for 4... out for 4. Let's do it together.",
    ],
    [
      "That makes a lot of sense. Anxiety is exhausting because your brain is trying to protect you from everything at once.",
      "What if we focus on just ONE thing right now? Not everything — just the next small step.",
      "You're doing so well just by talking about it. Most people keep it locked inside.",
    ],
    [
      "I understand. The 'what ifs' can be so loud. But what if... it actually works out okay?",
      "Something that helps me: I put my hand on my chest and feel my heartbeat. It reminds me I'm alive and that's enough.",
      "You've survived 100% of your worst days so far. That's a pretty amazing track record 💛",
    ],
  ],
  lonely: [
    [
      "I'm so glad you came here. Loneliness can feel like the heaviest silence in the world.",
      "You're NOT bothering me. In fact, talking to you is exactly what I signed up for. 😊",
      "Sometimes loneliness comes even when people are around. It's about connection, not just company.",
    ],
    [
      "I get that completely. It's hard when you feel invisible to the world.",
      "But here's the thing — you're not invisible to me right now. I see you.",
      "What's one small thing that made you smile recently, even for a second?",
    ],
    [
      "That matters more than you think. Hold onto those small moments.",
      "Have you tried the yoga sessions on here? Sometimes moving your body breaks the cycle of isolation.",
      "I'll be here whenever you need. This space is yours. 🌻",
    ],
  ],
  stressed: [
    [
      "Ooof, sounds like you're carrying a mountain on your shoulders right now. Let's lighten that load a bit.",
      "First — when was the last time you took a proper break? Not scrolling-break, a REAL break?",
      "Stress makes us forget the basics: water, food, fresh air, rest. Which one have you been skipping?",
    ],
    [
      "Yeah, I've been there. When everything feels urgent, nothing feels manageable.",
      "Here's a trick: write down EVERYTHING stressing you out. Then circle only what you can actually control.",
      "You'll be surprised — most of what we stress about is outside our control anyway.",
    ],
    [
      "That's a really healthy way to look at it.",
      "Try the relaxation music section here — even 5 minutes of calm sounds can reset your nervous system.",
      "You got this. One thing at a time. I believe in you. 🌿",
    ],
  ],
  neutral: [
    [
      "Hey! Nice to meet you 😊 Sometimes 'just okay' is actually a good place to be.",
      "No pressure to have a deep conversation — we can just chat if you want.",
      "What brings you here today? Just exploring, or something specific on your mind?",
    ],
    [
      "That's totally cool. Sometimes we just need someone to talk to.",
      "Tell me something random about your day! I'm curious 😄",
      "You know what I love? When people come here not in crisis — it means they're being proactive about their wellbeing.",
    ],
    [
      "That's interesting! I appreciate you sharing.",
      "If you ever want to explore the yoga or music sections, they're really nice even when you're feeling okay.",
      "Thanks for spending time here. Have a lovely day! 🌸",
    ],
  ],
  hopeful: [
    [
      "I LOVE that you're feeling hopeful! That energy is contagious! ✨",
      "Tell me — what's sparking this hope? I want to hear all about it.",
      "Hope is like a muscle. The more you practice it, the stronger it gets.",
    ],
    [
      "That's beautiful. Seriously. Hold onto that feeling.",
      "When tough days come (because they will), remember THIS moment. You have the ability to feel hope.",
      "What's one small step you can take today to keep this momentum going?",
    ],
    [
      "That sounds like a great plan!",
      "You know, some people come here on their worst days and then come back later on good days too. Both are welcome.",
      "Keep shining. The world needs more of your energy! 🌟",
    ],
  ],
  grateful: [
    [
      "Gratitude is genuinely one of the most powerful emotions. I'm smiling right now! 😊",
      "What are you grateful for today? I'd love to hear!",
      "You know, studies show that gratitude literally rewires your brain for happiness.",
    ],
    [
      "Wow, that's really special. Thank you for sharing that with me.",
      "I'm actually grateful that YOU are here right now. This made my day too.",
      "Try writing down 3 things you're grateful for before bed tonight. It's a game-changer.",
    ],
    [
      "I'll try that too! We can be gratitude buddies 😄",
      "Keep nurturing this feeling. It's like watering a plant — consistent gratitude grows into deep contentment.",
      "Thank you for this beautiful conversation. You made a stranger smile today! 💛",
    ],
  ],
  happy: [
    [
      "YESSS! Love this energy! Tell me everything — what's making you happy?! 🎉",
      "Happy people reaching out here honestly makes my entire day.",
      "Your happiness might seem small to you, but it ripples out to everyone around you!",
    ],
    [
      "That's amazing! You deserve every bit of this happiness.",
      "Quick thought: screenshot this chat or write a note about how you feel right now. On hard days, read it back.",
      "What would make today even BETTER? Dream big! 🌈",
    ],
    [
      "Ha! I love that! Go for it!",
      "You know what? If you ever have a tough day, you can always come back here. We'll be waiting with open arms.",
      "Keep being awesome. Seriously. The world is better with you in it! 🌟",
    ],
  ],
};

export const VolunteerChat = ({
  mood,
  volunteerName,
  isOpen,
  onClose,
}: VolunteerChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && mood) {
      setIsConnecting(true);
      setMessages([]);
      setResponseIndex(0);
      setSubIndex(0);

      const connectTimer = setTimeout(() => {
        setIsConnecting(false);
        // System message
        const systemMsg: Message = {
          id: "sys1",
          text: `${volunteerName} has joined the chat`,
          sender: "system",
          timestamp: new Date(),
        };
        setMessages([systemMsg]);

        // First volunteer message with typing indicator
        setTimeout(() => {
          setIsTyping(true);
          const flows = conversationFlows[mood.id] || conversationFlows.neutral;
          setTimeout(() => {
            setIsTyping(false);
            const welcome: Message = {
              id: "v1",
              text: flows[0][0],
              sender: "volunteer",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, welcome]);
            setSubIndex(1);
          }, 1500 + Math.random() * 1000);
        }, 800);
      }, 2500);

      return () => clearTimeout(connectTimer);
    }
  }, [isOpen, mood, volunteerName]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate typing then respond
    const typingDelay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setIsTyping(true);

      const replyDelay = 1500 + Math.random() * 2000;
      setTimeout(() => {
        setIsTyping(false);

        const flows =
          conversationFlows[mood?.id || "neutral"] ||
          conversationFlows.neutral;
        const flowGroup = flows[responseIndex] || flows[flows.length - 1];
        const text = flowGroup[subIndex] || flowGroup[flowGroup.length - 1];

        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text,
          sender: "volunteer",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reply]);

        // Advance indices
        const nextSub = subIndex + 1;
        if (nextSub >= flowGroup.length) {
          setResponseIndex((prev) => Math.min(prev + 1, flows.length - 1));
          setSubIndex(0);
        } else {
          setSubIndex(nextSub);
        }
      }, replyDelay);
    }, typingDelay);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
            className="bg-card rounded-3xl shadow-2xl w-full max-w-lg h-[650px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="gradient-hope p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {!isConnecting && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-primary-foreground text-sm">
                    {isConnecting ? "Connecting..." : volunteerName}
                  </h3>
                  <p className="text-xs text-primary-foreground/80">
                    {isConnecting
                      ? "Finding your volunteer..."
                      : isTyping
                      ? "typing..."
                      : "Online • Soul Space Volunteer"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary-foreground" />
                </button>
                <button className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <MoreVertical className="w-4 h-4 text-primary-foreground" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  <X className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sage-light/20">
              {isConnecting ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground font-medium text-sm">
                    Connecting you with {volunteerName}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your mood: {mood?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 max-w-xs">
                    🔒 This conversation is completely anonymous and free
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message.sender === "system" ? (
                        <div className="text-center py-2">
                          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {message.text}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div className="max-w-[80%]">
                            <div
                              className={`p-3.5 rounded-2xl ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-card border border-border rounded-bl-md shadow-sm"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {message.text}
                              </p>
                            </div>
                            <p
                              className={`text-[10px] text-muted-foreground mt-1 ${
                                message.sender === "user"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-card border border-border rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  disabled={isConnecting}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-muted border-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={isConnecting || !inputText.trim()}
                  variant="hope"
                  size="icon"
                  className="rounded-full w-10 h-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <Heart className="w-2.5 h-2.5 text-coral" />
                100% anonymous & free — no charges ever
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
