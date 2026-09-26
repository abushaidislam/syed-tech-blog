"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src?: string;
  poster?: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  aspectRatio?: "16/9" | "1/1" | "4/3" | "auto";
  children?: React.ReactNode;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoPlayer({
  src,
  poster,
  caption,
  autoPlay = true,
  loop = true,
  muted: initialMuted = true,
  playsInline = true,
  aspectRatio = "auto",
  className = "",
  children,
  ...props
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  // Extract resolved src from children if not on props
  let resolvedSrc = src;
  if (!resolvedSrc && children) {
    if (React.isValidElement(children)) {
      const p = children.props as { src?: string };
      if (p.src) resolvedSrc = p.src;
    } else if (Array.isArray(children)) {
      for (const child of children) {
        if (React.isValidElement(child)) {
          const p = child.props as { src?: string };
          if (p.src) {
            resolvedSrc = p.src;
            break;
          }
        }
      }
    }
  }

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [clickIndicator, setClickIndicator] = useState<"play" | "pause" | null>(null);

  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      if (autoPlay) {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [autoPlay]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setClickIndicator("play");
    } else {
      video.pause();
      setIsPlaying(false);
      setClickIndicator("pause");
    }

    setTimeout(() => setClickIndicator(null), 600);
    resetHideTimer();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    resetHideTimer();
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      try {
        await container.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen request failed", err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Exit fullscreen failed", err);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const track = progressTrackRef.current;
    const video = videoRef.current;
    if (!track || !video || !duration) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
    resetHideTimer();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <figure className="not-prose my-8 w-full select-none">
      <div
        ref={containerRef}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => {
          if (isPlaying) setShowControls(false);
        }}
        onClick={togglePlay}
        className={`group relative w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] dark:border-neutral-800 ${className}`}
      >
        <video
          ref={videoRef}
          src={resolvedSrc}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline={playsInline}
          controls={false} // Dub style: Never show clunky native browser controls!
          preload="metadata"
          className="size-full max-h-[85vh] object-contain mx-auto block"
          {...props}
        >
          {children || (resolvedSrc ? <source src={resolvedSrc} type="video/mp4" /> : null)}
          Your browser does not support the video tag.
        </video>

        {/* Center Animated Play/Pause Feedback Ripple */}
        {clickIndicator && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-neutral-900/80 text-white backdrop-blur-md shadow-2xl animate-ping duration-300">
              {clickIndicator === "play" ? (
                <Play className="size-6 fill-current ml-1" />
              ) : (
                <Pause className="size-6 fill-current" />
              )}
            </div>
          </div>
        )}

        {/* Dub.co Signature Custom Bottom Control Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-x-3 bottom-3 z-20 flex items-center gap-3.5 rounded-xl border border-white/10 bg-neutral-900/85 px-4 py-2.5 text-white backdrop-blur-md shadow-xl transition-all duration-300 ${
            showControls || !isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/90 transition-all hover:bg-white/15 hover:text-white active:scale-90 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Time Display */}
          <span className="font-mono text-xs tracking-tight text-neutral-300 shrink-0 select-none">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Sleek Scrubber Track */}
          <div
            ref={progressTrackRef}
            onClick={handleSeek}
            className="group/track relative flex h-4 flex-1 items-center cursor-pointer"
          >
            <div className="relative h-1.5 w-full rounded-full bg-white/20 transition-all group-hover/track:h-2">
              {/* Progress Fill */}
              <div
                style={{ width: `${progressPercent}%` }}
                className="relative h-full rounded-full bg-white transition-[width] duration-75"
              >
                {/* Thumb on hover */}
                <div className="absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md opacity-0 transition-opacity group-hover/track:opacity-100" />
              </div>
            </div>
          </div>

          {/* Volume / Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/90 transition-all hover:bg-white/15 hover:text-white active:scale-90 cursor-pointer"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/90 transition-all hover:bg-white/15 hover:text-white active:scale-90 cursor-pointer"
          >
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </button>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-center text-xs text-neutral-500 font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
