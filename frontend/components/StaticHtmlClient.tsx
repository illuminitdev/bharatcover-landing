'use client';

import { useEffect, useRef } from 'react';

type StaticHtmlClientProps = {
  html: string;
};

export default function StaticHtmlClient({ html }: StaticHtmlClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = html;

    // Recreate script nodes so inline and external scripts execute in the browser.
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      const parent = oldScript.parentNode;
      if (parent) {
        parent.replaceChild(newScript, oldScript);
      } else if (container.isConnected) {
        // Fallback for scripts detached by earlier script side-effects.
        container.appendChild(newScript);
      }
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [html]);

  return <div ref={containerRef} suppressHydrationWarning />;
}
