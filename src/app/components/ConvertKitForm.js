'use client';

import React, { useEffect, useRef } from 'react';

export default function ConvertKitForm() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        .formkit-field {
          width: 100% !important;
          max-width: 100% !important;
        }
      `;
      document.head.appendChild(style);

      const script = document.createElement('script');
      script.async = true;
      script.src = "https://alex-christou.kit.com/8f114ff23b/index.js";
      script.setAttribute('data-uid', '8f114ff23b');
      containerRef.current.appendChild(script);

      return () => {
        if (containerRef.current) {
          containerRef.current.removeChild(script);
        }
        document.head.removeChild(style);
      };
    }
  }, []);

  return <div ref={containerRef} />;
} 