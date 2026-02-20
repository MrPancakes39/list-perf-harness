import type { ProfilerOnRenderCallback } from "react";

export type ListLibrary = "tanstack" | "legend";

export interface MemorySnapshot {
  supported: boolean;
  usedJSHeapSize: number | null;
  totalJSHeapSize: number | null;
  jsHeapSizeLimit: number | null;
}

export interface BenchmarkMetrics {
  commitCount: number;
  mountCount: number;
  updateCount: number;
  totalActualDuration: number;
  totalBaseDuration: number;
  maxActualDuration: number;
  lastActualDuration: number;
  firstRenderMs: number | null;
  fpsSampleCount: number;
  fpsAverage: number | null;
  fpsMin: number | null;
  fpsMax: number | null;
  memory: MemorySnapshot;
}

interface ProfilerSample {
  phase: Parameters<ProfilerOnRenderCallback>[1];
  actualDuration: number;
  baseDuration: number;
}

declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

export function createMemorySnapshot(): MemorySnapshot {
  if (!performance.memory) {
    return {
      supported: false,
      usedJSHeapSize: null,
      totalJSHeapSize: null,
      jsHeapSizeLimit: null,
    };
  }

  return {
    supported: true,
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
  };
}

export function createEmptyMetrics(): BenchmarkMetrics {
  return {
    commitCount: 0,
    mountCount: 0,
    updateCount: 0,
    totalActualDuration: 0,
    totalBaseDuration: 0,
    maxActualDuration: 0,
    lastActualDuration: 0,
    firstRenderMs: null,
    fpsSampleCount: 0,
    fpsAverage: null,
    fpsMin: null,
    fpsMax: null,
    memory: createMemorySnapshot(),
  };
}

export function applyProfilerSample(
  metrics: BenchmarkMetrics,
  sample: ProfilerSample
): BenchmarkMetrics {
  return {
    ...metrics,
    commitCount: metrics.commitCount + 1,
    mountCount: metrics.mountCount + (sample.phase === "mount" ? 1 : 0),
    updateCount: metrics.updateCount + (sample.phase === "update" ? 1 : 0),
    totalActualDuration: metrics.totalActualDuration + sample.actualDuration,
    totalBaseDuration: metrics.totalBaseDuration + sample.baseDuration,
    maxActualDuration: Math.max(metrics.maxActualDuration, sample.actualDuration),
    lastActualDuration: sample.actualDuration,
  };
}

export function applyFirstRenderMs(
  metrics: BenchmarkMetrics,
  ms: number
): BenchmarkMetrics {
  return {
    ...metrics,
    firstRenderMs: ms,
  };
}

export function applyFpsSample(
  metrics: BenchmarkMetrics,
  sampleFps: number
): BenchmarkMetrics {
  const fps = Number.isFinite(sampleFps) ? sampleFps : 0;
  const nextCount = metrics.fpsSampleCount + 1;
  const prevAvg = metrics.fpsAverage ?? 0;
  const nextAvg = (prevAvg * metrics.fpsSampleCount + fps) / nextCount;

  return {
    ...metrics,
    fpsSampleCount: nextCount,
    fpsAverage: nextAvg,
    fpsMin: metrics.fpsMin === null ? fps : Math.min(metrics.fpsMin, fps),
    fpsMax: metrics.fpsMax === null ? fps : Math.max(metrics.fpsMax, fps),
  };
}

export function applyMemorySnapshot(
  metrics: BenchmarkMetrics,
  snapshot: MemorySnapshot
): BenchmarkMetrics {
  return {
    ...metrics,
    memory: snapshot,
  };
}
