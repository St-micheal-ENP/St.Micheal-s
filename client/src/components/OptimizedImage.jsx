import React, { useState } from 'react';

/**
 * OptimizedImage — drop-in replacement for <img>
 *
 * Features:
 *  - Native lazy loading (loading="lazy") — browser defers off-screen images
 *  - Responsive max-width so images never overflow their container
 *  - Fade-in animation once loaded (no layout shift)
 *  - Graceful error fallback (broken-image placeholder)
 *  - decoding="async" — image decode happens off the main thread
 *
 * Props:
 *  src        — image URL (required)
 *  alt        — alt text (required for accessibility)
 *  className  — extra CSS class to pass through
 *  style      — extra inline style
 *  eager      — set to true for above-the-fold / LCP images (disables lazy loading)
 *  ...rest    — any other <img> attributes (width, height, onClick, etc.)
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  eager = false,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50' y='54' text-anchor='middle' font-size='28' fill='%23cbd5e1'%3E%F0%9F%96%BC%EF%B8%8F%3C/text%3E%3C/svg%3E";

  return (
    <img
      src={errored ? FALLBACK : src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className={className}
      style={{
        maxWidth: '100%',
        display: 'block',
        opacity: loaded || errored ? 1 : 0,
        transition: 'opacity 0.35s ease',
        ...style,
      }}
      {...rest}
    />
  );
};

export default OptimizedImage;
