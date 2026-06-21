'use client';

import { useEffect, useState } from 'react';

export default function GlowFollow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden mix-blend-screen hidden md:block"
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full opacity-15 blur-[120px] transition-all duration-300 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(23,75,255,1) 0%, rgba(99,37,217,1) 50%, rgba(34,211,238,0) 100%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
