"use client";

import { frameTransitionName, ViewTransition } from "@/components/ui/ViewTransition";

/**
 * The receiving half of the morph: the case study's hero frame answers to the
 * same view-transition name as the project's stage on the index, so the browser
 * flies one element between the two pages rather than cutting.
 *
 * It matches the stage's 16/10 and 26px radius on purpose — those are what the
 * browser interpolates, and a mismatch is what makes a morph look like a glitch.
 */
export function CaseHero({
  id,
  poster,
  video,
  alt,
  surface,
  border,
}: {
  id: string;
  poster: string;
  video?: string;
  alt: string;
  surface: string;
  border: string;
}) {
  return (
    <ViewTransition name={frameTransitionName(id)} share="morph">
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 10",
          borderRadius: 26,
          overflow: "hidden",
          background: surface,
          border: `1px solid ${border}`,
          maxWidth: 1000,
          margin: "0 auto 80px",
        }}
      >
        {video ? (
          <video
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            aria-label={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element --
             these posters are local and fixed-size, and next/image's wrapper
             would put a layer between the morph and the element it flies. */
          <img
            src={poster}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
    </ViewTransition>
  );
}
