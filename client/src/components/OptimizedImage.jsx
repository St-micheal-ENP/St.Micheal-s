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

  const showFallback = errored || !src;

  const FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Crect width='400' height='300' fill='url(%23grad)' fill-opacity='0.05'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23cbd5e1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2394a3b8;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' font-size='48' fill='%2394a3b8'%3E%F0%9F%96%BC%EF%B8%8F%3C/text%3E%3Ctext x='50%25' y='65%25' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='600' fill='%2394a3b8'%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E";

  return (
    <img
      src={showFallback ? FALLBACK : src}
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
