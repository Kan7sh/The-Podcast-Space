"use client";

import { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  audioStream: MediaStream | null | undefined;
  colors?: string[];
  height?: number;
}

export default function AudioVisualizer({
  audioStream,
  colors = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
  height = 40,
}: AudioVisualizerProps) {
  const [frequencies, setFrequencies] = useState<number[]>([0, 0, 0, 0, 0]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioStream) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32; // Smaller FFT size for fewer frequency bins

    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Simplify to 5 frequency ranges
      const simplifiedFrequencies = [
        Math.max(dataArrayRef.current[0], 10), // Ensure minimum height
        Math.max(dataArrayRef.current[2], 10),
        Math.max(dataArrayRef.current[4], 10),
        Math.max(dataArrayRef.current[6], 10),
        Math.max(dataArrayRef.current[8], 10),
      ];

      setFrequencies(simplifiedFrequencies);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream]);

  return (
    <div
      className="flex items-end gap-1 w-full"
      style={{ height: `${height}px` }}
    >
      {frequencies.map((freq, index) => (
        <div
          key={index}
          className="w-2 transition-all duration-75 ease-out rounded-sm"
          style={{
            height: `${Math.min(freq, height)}px`,
            backgroundColor: colors[index % colors.length],
          }}
        />
      ))}
    </div>
  );
}
