import { useState, useEffect } from "react";

export default function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.dataset.animationId]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('[data-animation-id]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
}

export const getAnimationClasses = (index, isVisible, baseDelay = 0) => {
  const direction = index % 2 === 0 ? '-translate-x-8' : 'translate-x-8';
  const delay = `${baseDelay + (index * 100)}ms`;

  return {
    container: `transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${direction}`}`,
    style: { transitionDelay: delay }
  };
};
