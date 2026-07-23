import { useRef, useEffect } from "react";

export default function AutoScrollContainer({ children }) {
  const scrollRef = useRef(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scroll = () => {
      if (isHovering.current) return;
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
    };

    const id = setInterval(scroll, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
      className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2"
      style={{ scrollBehavior: "auto" }}
    >
      {children}
    </div>
  );
}
