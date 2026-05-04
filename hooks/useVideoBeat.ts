"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drives 0–1 "beat" intensity from video audio when unmuted.
 * Audio must go through a GainNode: if the analyser were connected straight to
 * `destination`, Chrome would keep playing that path even when `video.muted` is true,
 * so the dock "mute" control would appear broken.
 */
export function useVideoBeat(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  unmuted: boolean,
  /** When the underlying `<video>` is remounted (e.g. new `src`), tear down Web Audio. */
  mediaKey?: string | null,
) {
  const [beat, setBeat] = useState(0.35);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rafRef = useRef(0);
  const fakeT = useRef(0);
  const lastMediaKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    let fakeId: ReturnType<typeof setInterval> | null = null;

    const stopFake = () => {
      if (fakeId != null) {
        clearInterval(fakeId);
        fakeId = null;
      }
    };

    const stopRaf = () => {
      cancelAnimationFrame(rafRef.current);
    };

    const fullTeardown = () => {
      stopRaf();
      stopFake();
      try {
        sourceRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        analyserRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        gainRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      sourceRef.current = null;
      analyserRef.current = null;
      gainRef.current = null;
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };

    const key = mediaKey ?? "";
    if (lastMediaKeyRef.current !== key) {
      fullTeardown();
      lastMediaKeyRef.current = key;
    }

    if (!unmuted) {
      if (gainRef.current && ctxRef.current) {
        const t = ctxRef.current.currentTime;
        gainRef.current.gain.setTargetAtTime(0, t, 0.015);
      }
      stopRaf();
      fakeId = setInterval(() => {
        fakeT.current += 0.08;
        setBeat(0.25 + Math.sin(fakeT.current) * 0.08);
      }, 80);
      return () => stopFake();
    }

    stopFake();

    if (!video) return;

    const runAnalyser = () => {
      const ctx = ctxRef.current;
      const analyser = analyserRef.current;
      if (!ctx || !analyser) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      if (ctx.state === "suspended") void ctx.resume();
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] ?? 0;
      const avg = sum / data.length / 255;
      setBeat(0.2 + Math.min(1, avg * 2.2));
      rafRef.current = requestAnimationFrame(runAnalyser);
    };

    try {
      if (!sourceRef.current) {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const src = ctx.createMediaElementSource(video);
        sourceRef.current = src;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const gain = ctx.createGain();
        gain.gain.value = 0;
        gainRef.current = gain;
        src.connect(analyser);
        analyser.connect(gain);
        gain.connect(ctx.destination);
      }

      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (ctx && gain) {
        const t = ctx.currentTime;
        gain.gain.setTargetAtTime(1, t, 0.02);
      }

      stopRaf();
      rafRef.current = requestAnimationFrame(runAnalyser);
    } catch {
      fullTeardown();
      fakeId = setInterval(() => {
        fakeT.current += 0.12;
        setBeat(0.3 + Math.abs(Math.sin(fakeT.current)) * 0.35);
      }, 50);
    }

    return () => {
      stopRaf();
      stopFake();
    };
  }, [unmuted, videoRef, mediaKey]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      try {
        sourceRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        analyserRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        gainRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      sourceRef.current = null;
      analyserRef.current = null;
      gainRef.current = null;
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return beat;
}
