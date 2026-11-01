import { useEffect, useRef, useState } from "react";

const happyEmojis = ["😄", "✨", "🥳", "💛", "🎉", "💗", "💖", "💕", "💞"];
const burstOffsets = [-60, 12, 60, -36, 36, -12];

type JoyEmoji = {
  id: number;
  glyph: string;
  offsetX: number;
  offsetY: number;
  drift: number;
  rotation: number;
  size: number;
  delay: number;
  duration: number;
  rise: number;
};

export function useJoyMachine() {
  const [emojis, setEmojis] = useState<JoyEmoji[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      activeTimers.forEach(clearTimeout);
      activeTimers.clear();
    };
  }, []);

  function releaseJoy() {
    const burst = burstOffsets.map((offsetX, index) => ({
      id: nextId.current++,
      glyph: happyEmojis[Math.floor(Math.random() * happyEmojis.length)],
      offsetX: offsetX + Math.random() * 16 - 8,
      offsetY: Math.random() * 20 - 10,
      drift: Math.random() * 48 - 24,
      rotation: Math.random() * 48 - 24,
      size: 20 + Math.random() * 8,
      delay: index * 100 + Math.random() * 80,
      duration: 1400 + Math.random() * 800,
      rise: 180 + Math.random() * 60,
    }));
    const burstIds = new Set(burst.map((emoji) => emoji.id));
    const lifetime = Math.max(
      ...burst.map((emoji) => emoji.delay + emoji.duration),
    );

    setEmojis((current) => [...current, ...burst]);

    const timer = setTimeout(() => {
      setEmojis((current) =>
        current.filter((emoji) => !burstIds.has(emoji.id)),
      );
      timers.current.delete(timer);
    }, lifetime);

    timers.current.add(timer);
  }

  return { emojis, releaseJoy };
}
