import { useEffect, useRef, useState } from "react";

export default function useScrollToBottom(
  callback: Function,
  shouldScrollToBottom?: boolean,
  chatId?: string
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledManually, setHasScrolledManually] = useState(false);

  useEffect(() => {
    if (lastMessageRef.current && shouldScrollToBottom && !hasScrolledManually) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [shouldScrollToBottom, chatId, hasScrolledManually]);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = ref;
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 50;

      if (!isScrolledToBottom) {
        setHasScrolledManually(true);
      }

      callback(!isScrolledToBottom);
    };

    ref.addEventListener("scroll", handleScroll);

    return () => ref.removeEventListener("scroll", handleScroll);
  }, [containerRef, callback]);

  useEffect(() => {
    if (shouldScrollToBottom && !hasScrolledManually && containerRef.current) {
      const ref = containerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = ref;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;

      if (!isAtBottom && !hasScrolledManually) {
        ref.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [shouldScrollToBottom, hasScrolledManually]);

  const resetManualScroll = () => {
    setHasScrolledManually(false);
  };

  return { containerRef, lastMessageRef, resetManualScroll };
}
