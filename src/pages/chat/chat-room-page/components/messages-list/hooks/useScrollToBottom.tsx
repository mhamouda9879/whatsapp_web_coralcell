import { useEffect, useRef } from "react";

export default function useScrollToBottom(
  callback: Function,
  shouldScrollToBottom?: boolean,
  chatId?: string
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current && shouldScrollToBottom) {

      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [shouldScrollToBottom, chatId]);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = ref;
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 50;

      callback(!isScrolledToBottom);
    };

    ref.addEventListener("scroll", handleScroll);

    return () => ref.removeEventListener("scroll", handleScroll);
  }, [containerRef, callback]);

  return { containerRef, lastMessageRef };
}
