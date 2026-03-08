"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TARGET_TEXT = "blog.yanncotineau.dev";
const BLOG_WORD_LENGTH = 4;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

function getTypingDelay(): number {
  const baseDelay = 50 + Math.random() * 100;
  return Math.random() < 0.1 ? baseDelay + 100 + Math.random() * 150 : baseDelay;
}

export default function TypewriterLogo() {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);
  const scrambleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTypedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setCaretVisible((prev) => !prev), 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasTypedRef.current) return;
    hasTypedRef.current = true;

    let currentIndex = 0;
    const typeNextChar = () => {
      if (currentIndex < TARGET_TEXT.length) {
        setDisplayText(TARGET_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, getTypingDelay());
      } else {
        setIsTypingComplete(true);
      }
    };
    setTimeout(typeNextChar, 500);
  }, []);

  const handleClick = useCallback(() => {
    if (isScrambling || !isTypingComplete) return;
    setIsScrambling(true);

    if (scrambleTimeoutRef.current) clearTimeout(scrambleTimeoutRef.current);

    const revealed = new Array(TARGET_TEXT.length).fill(false);
    let revealedCount = 0;

    const updateScramble = () => {
      let result = "";
      for (let i = 0; i < TARGET_TEXT.length; i++) {
        result += revealed[i] ? TARGET_TEXT[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplayText(result);
    };

    const scrambleInterval = setInterval(updateScramble, 50);

    const revealChar = () => {
      if (revealedCount >= TARGET_TEXT.length) {
        clearInterval(scrambleInterval);
        setDisplayText(TARGET_TEXT);
        setIsScrambling(false);
        return;
      }

      let nextIndex = revealedCount;
      if (Math.random() < 0.3 && revealedCount < TARGET_TEXT.length - 2) {
        const offset = Math.floor(Math.random() * 2);
        for (let i = revealedCount; i < Math.min(revealedCount + offset + 1, TARGET_TEXT.length); i++) {
          if (!revealed[i]) { nextIndex = i; break; }
        }
      }

      revealed[nextIndex] = true;
      revealedCount = revealed.filter(Boolean).length;
      for (let i = 0; i < revealedCount; i++) revealed[i] = true;
      revealedCount = revealed.filter(Boolean).length;

      scrambleTimeoutRef.current = setTimeout(revealChar, 30 + Math.random() * 70);
    };

    setTimeout(revealChar, 200);

    return () => {
      clearInterval(scrambleInterval);
      if (scrambleTimeoutRef.current) clearTimeout(scrambleTimeoutRef.current);
    };
  }, [isScrambling, isTypingComplete]);

  const renderText = () => {
    if (displayText.length <= BLOG_WORD_LENGTH) {
      return <span className="text-emerald-500">{displayText}</span>;
    }
    return (
      <>
        <span className="text-emerald-500">{displayText.slice(0, BLOG_WORD_LENGTH)}</span>
        <span>{displayText.slice(BLOG_WORD_LENGTH)}</span>
      </>
    );
  };

  return (
    <button
      onClick={handleClick}
      className="text-base sm:text-lg font-semibold text-white hover:text-slate-200 transition-colors cursor-pointer select-none"
      aria-label="blog.yanncotineau.dev"
    >
      <span className="inline-flex items-baseline">
        <span>&gt;</span>
        <span className="ml-1">{renderText()}</span>
        <span 
          className={`inline-block ml-0.5 transition-opacity duration-300 ease-in-out ${
            caretVisible ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >_</span>
      </span>
    </button>
  );
}
