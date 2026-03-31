import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Suit = "♠" | "♥" | "♦" | "♣";
type SuitColor = "black" | "red";

interface FloatingPiece {
  id: number;
  x: number;
  suit: Suit;
  color: SuitColor;
  size: number;
  duration: number;
  delay: number;
  isConfetti?: boolean;
  confettiColor?: string;
}

interface JokeCard {
  suit: Suit;
  color: SuitColor;
  joke: string;
  label: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];

const SUIT_COLORS: Record<Suit, SuitColor> = {
  "♠": "black",
  "♥": "red",
  "♦": "red",
  "♣": "black",
};

const JOKES: JokeCard[] = [
  {
    suit: "♠",
    color: "black",
    label: "THE BLUFFER'S PARADOX",
    joke: "You've been bluffing about your age for years... we finally called your hand. Happy Birthday, you magnificent fraud!",
  },
  {
    suit: "♥",
    color: "red",
    label: "THE LIFETIME MASTERCLASS",
    joke: "They say poker takes a minute to learn and a lifetime to master. Good news: you're well into the lifetime part. Bad news: you're still losing to beginners.",
  },
  {
    suit: "♦",
    color: "red",
    label: "THE FULL HOUSE THEORY",
    joke: "Getting older is like poker: you start with a full house and end up with a pair of aching knees. At least the chips are still on the table!",
  },
  {
    suit: "♣",
    color: "black",
    label: "THE POKER FACE SAGA",
    joke: "You know you're old when your back goes out more than you do — but hey, at least your poker face hasn't aged one bit. Still unreadable. Still terrifying.",
  },
  {
    suit: "♥",
    color: "red",
    label: "DON'T FOLD NOW",
    joke: "Another year older? Don't fold now! The best hands are still coming — probably in a retirement home with excellent Wi-Fi and early bird specials.",
  },
  {
    suit: "♠",
    color: "black",
    label: "THE GRAND BLUFF",
    joke: "Life is like poker: even with a bad hand, you can win with a good bluff. Happy Birthday, you magnificent, audacious, gloriously aging bluffer!",
  },
];

const DRAW_MESSAGES = [
  "🎰 ACE HIGH! You're so lucky to still have all your own teeth!",
  "🃏 ROYAL FLUSH! Just like your hairline — mostly gone but legendary!",
  "♠ FULL HOUSE! Of birthday cake, bad jokes, and unsolicited advice!",
  "🎲 PAIR OF KINGS! One for each chin. You've earned them both!",
  "♦ STRAIGHT! Your back, on the other hand, is anything but.",
  "🎴 TWO PAIR! That's also your age... if you're in hexadecimal.",
  "♣ WILD CARD! Nobody knows what year you actually were born. Not even you.",
  "🃏 DEALER'S CHOICE! The dealer chose to remind you: sunscreen exists.",
];

const CONFETTI_COLORS = [
  "oklch(0.75 0.12 75)",
  "oklch(0.5 0.22 25)",
  "oklch(0.7 0.15 120)",
  "oklch(0.6 0.2 260)",
  "oklch(0.8 0.1 200)",
  "oklch(0.9 0.08 90)",
];

// ── Confetti Component ─────────────────────────────────────────────────────
function ConfettiLayer({ count = 40 }: { count?: number }) {
  const [pieces, setPieces] = useState<FloatingPiece[]>([]);

  useEffect(() => {
    const newPieces: FloatingPiece[] = Array.from({ length: count }, (_, i) => {
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const isConfetti = Math.random() > 0.4;
      return {
        id: i,
        x: Math.random() * 100,
        suit,
        color: SUIT_COLORS[suit],
        size: isConfetti ? 8 + Math.random() * 10 : 16 + Math.random() * 20,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5,
        isConfetti,
        confettiColor:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      };
    });
    setPieces(newPieces);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 font-bold select-none"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            color: p.isConfetti
              ? p.confettiColor
              : p.color === "red"
                ? "oklch(0.5 0.22 25)"
                : "oklch(0.15 0 0)",
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0,
          }}
        >
          {p.suit}
        </div>
      ))}
    </div>
  );
}

// ── Joke Card Component ────────────────────────────────────────────────────
function JokeCard({ card, index }: { card: JokeCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.2 } }}
      className="card-felt rounded-2xl p-6 relative overflow-hidden cursor-default"
      data-ocid={`jokes.item.${index + 1}`}
    >
      {/* Corner suit decorations */}
      <div
        className={`absolute top-3 left-4 text-2xl font-black leading-none ${
          card.color === "red" ? "suit-red" : "suit-black"
        }`}
      >
        {card.suit}
      </div>
      <div
        className={`absolute bottom-3 right-4 text-2xl font-black leading-none rotate-180 ${
          card.color === "red" ? "suit-red" : "suit-black"
        }`}
      >
        {card.suit}
      </div>

      {/* Card content */}
      <div className="pt-6 pb-4 px-2 text-center">
        <p
          className={`text-xs font-bold tracking-widest uppercase mb-3 ${
            card.color === "red" ? "text-felt-red" : "text-casino-dark"
          }`}
        >
          {card.label}
        </p>
        <p className="text-casino-dark font-medium text-sm leading-relaxed">
          {card.joke}
        </p>
      </div>
    </motion.div>
  );
}

// ── Draw Card Section ──────────────────────────────────────────────────────
function DrawCardSection() {
  const [message, setMessage] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  const drawCard = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setMessage(null);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * DRAW_MESSAGES.length);
      setMessage(DRAW_MESSAGES[idx]);
      setCardCount((c) => c + 1);
      setIsFlipping(false);
    }, 400);
  }, [isFlipping]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-playfair text-3xl md:text-4xl text-gold animate-shimmer mb-4"
        >
          🎴 Draw Your Fortune
        </motion.h2>
        <p className="text-foreground/70 mb-8">
          Every poker player deserves a birthday reading. Will your cards be
          kind?
        </p>

        <Button
          onClick={drawCard}
          disabled={isFlipping}
          data-ocid="draw.primary_button"
          className="bg-gold text-casino-dark hover:bg-gold-bright font-bold text-lg px-10 py-6 rounded-xl shadow-gold animate-pulse-glow border-2 border-gold/50 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isFlipping ? "🔄 Shuffling..." : "🃏 Draw a Card"}
        </Button>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={cardCount}
              initial={{ opacity: 0, scale: 0.6, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              className="mt-8 card-felt rounded-2xl p-8 mx-auto max-w-lg"
              data-ocid="draw.success_state"
            >
              <p className="text-casino-dark font-bold text-lg leading-relaxed">
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen relative">
      <ConfettiLayer count={50} />

      {/* ── HERO ── */}
      <header className="relative pt-12 pb-8 px-4 overflow-hidden">
        {/* Background felt texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.2 0.06 160 / 0.3) 2px, oklch(0.2 0.06 160 / 0.3) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, oklch(0.2 0.06 160 / 0.3) 2px, oklch(0.2 0.06 160 / 0.3) 4px)
            `,
          }}
        />

        {/* Floating suits background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {SUITS.map((suit, i) => (
            <div
              key={suit}
              className="absolute opacity-5 font-black select-none"
              style={{
                fontSize: "180px",
                left: `${[5, 25, 65, 82][i]}%`,
                top: `${[10, 50, 20, 60][i]}%`,
                color:
                  SUIT_COLORS[suit] === "red"
                    ? "oklch(0.5 0.22 25)"
                    : "oklch(0.85 0.14 78)",
                transform: `rotate(${[-15, 10, -8, 20][i]}deg)`,
              }}
            >
              {suit}
            </div>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Top decorative line */}
          <div className="flex items-center gap-4 justify-center mb-8">
            <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-xl tracking-widest">♠ ♥ ♦ ♣</span>
            <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="text-center mb-4"
          >
            <p className="font-playfair text-gold/70 text-lg md:text-xl tracking-[0.3em] uppercase mb-2">
              The Casino Royale Presents
            </p>
            <h1 className="font-playfair font-bold text-gold animate-shimmer leading-tight">
              <span className="block text-5xl md:text-7xl lg:text-8xl">
                HAPPY
              </span>
              <span
                className="block text-6xl md:text-8xl lg:text-9xl"
                style={{
                  textShadow:
                    "0 0 40px oklch(0.75 0.12 75 / 0.6), 0 4px 8px oklch(0.1 0.04 160 / 0.9)",
                }}
              >
                BIRTHDAY!
              </span>
            </h1>
          </motion.div>

          {/* Photo + Subtitle */}
          <div className="flex flex-col lg:flex-row items-center gap-10 mt-10">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="relative flex-shrink-0"
            >
              {/* Outer gold frame */}
              <div
                className="rounded-2xl p-1 shadow-gold-lg"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.85 0.14 78), oklch(0.62 0.1 75), oklch(0.85 0.14 78))",
                  filter: "drop-shadow(0 0 20px oklch(0.75 0.12 75 / 0.5))",
                }}
              >
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="/assets/ivan-019d45d5-dc82-727b-b2fe-12d9de67d0f5.jpg"
                    alt="The Birthday Legend"
                    className="w-64 md:w-80 object-cover block"
                    style={{ maxHeight: "360px", objectFit: "cover" }}
                  />
                </div>
              </div>
              {/* Caption badge */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-felt-red text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg"
                style={{
                  boxShadow: "0 2px 12px oklch(0.42 0.18 25 / 0.7)",
                }}
              >
                ♠ THE LEGEND ♠
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex-1 text-center lg:text-left"
            >
              <h2 className="font-playfair text-gold-bright text-3xl md:text-4xl font-bold mb-4">
                All In on Another Year! 🎂
              </h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                To the man who raises in life like he raises at the poker table
                — boldly, recklessly, and somehow always getting away with it.
                Another year around the sun, another year of making it look
                easier than it is.
              </p>
              <p className="text-foreground/60 text-base italic">
                "In poker and in life, the cards you're dealt matter less than
                how you play your hand. You, my friend, play yours like an
                absolute madman — and we love you for it."
              </p>
              <div className="mt-6 flex gap-4 justify-center lg:justify-start">
                {["♠", "♥", "♦", "♣"].map((s, i) => (
                  <motion.span
                    key={s}
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, i % 2 === 0 ? 10 : -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="text-3xl"
                    style={{
                      color:
                        s === "♥" || s === "♦"
                          ? "oklch(0.55 0.22 25)"
                          : "oklch(0.85 0.14 78)",
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── GOLD DIVIDER ── */}
      <div className="relative py-6 overflow-hidden">
        <div
          className="h-px mx-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.12 75), oklch(0.85 0.14 78), oklch(0.75 0.12 75), transparent)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-playfair text-gold text-sm tracking-[0.5em] uppercase px-6"
            style={{
              background: "oklch(0.18 0.06 160)",
            }}
          >
            ✦ The Roast ✦
          </span>
        </div>
      </div>

      {/* ── JOKES SECTION ── */}
      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-4xl md:text-5xl text-gold animate-shimmer mb-3">
              The Birthday Hand
            </h2>
            <p className="text-foreground/60 text-lg">
              Six cards. All jokers. Just like the birthday boy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOKES.map((card, i) => (
              <JokeCard key={card.label} card={card} index={i} />
            ))}
          </div>
        </div>
      </main>

      {/* ── GOLD DIVIDER ── */}
      <div className="relative py-6 overflow-hidden">
        <div
          className="h-px mx-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.12 75), oklch(0.85 0.14 78), oklch(0.75 0.12 75), transparent)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-playfair text-gold text-sm tracking-[0.5em] uppercase px-6"
            style={{
              background: "oklch(0.18 0.06 160)",
            }}
          >
            ✦ Your Fortune ✦
          </span>
        </div>
      </div>

      {/* ── DRAW CARD ── */}
      <DrawCardSection />

      {/* ── FOOTER ── */}
      <footer
        className="py-10 px-4 mt-8"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.06 160), oklch(0.11 0.04 160))",
          borderTop: "1px solid oklch(0.75 0.12 75 / 0.2)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            {SUITS.map((s) => (
              <span
                key={s}
                className="text-3xl opacity-50"
                style={{
                  color:
                    SUIT_COLORS[s] === "red"
                      ? "oklch(0.5 0.22 25)"
                      : "oklch(0.75 0.12 78)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <p className="font-playfair text-gold text-xl mb-2">
            May the odds always be in your favor.
          </p>
          <p className="text-foreground/40 text-sm mb-6">
            And may your hands be full, your chips plentiful, and your birthdays
            forever undercounted.
          </p>
          <div
            className="h-px mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.12 75 / 0.3), transparent)",
            }}
          />
          <p className="text-foreground/30 text-xs">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gold/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
