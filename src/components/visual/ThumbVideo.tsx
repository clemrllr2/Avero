"use client";

import { useEffect, useRef } from "react";

/**
 * Vidéo courte et muette en fond de vignette (public/videos/…) : image d'aperçu immédiate, lecture en boucle
 * seulement quand la vignette est visible, et jamais si l'utilisateur a demandé moins d'animations.
 */
export function ThumbVideo({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    // Même condition que les animations GSAP (MOTION_OK) : sinon l'image d'aperçu reste affichée.
    if (!video || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      preload="metadata"
      poster={`/videos/${name}.webp`}
      className="absolute inset-0 -z-10 size-full object-cover"
    >
      <source src={`/videos/${name}.webm`} type="video/webm" />
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
