import { Profiler, type ProfilerOnRenderCallback, useState } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { LegendBenchmarkList } from "./benchmark/LegendBenchmarkList";
import { TanStackBenchmarkList } from "./benchmark/TanStackBenchmarkList";
import {
  type BenchmarkMetrics,
  type ListLibrary,
  applyFirstRenderMs,
  applyFpsSample,
  applyMemorySnapshot,
  applyProfilerSample,
  createEmptyMetrics,
  createMemorySnapshot,
} from "./benchmark/metrics";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  DEFAULT_BENCHMARK_SEED,
  generateEmployees,
  resetGeneratorSeed,
} from "./generate-data";

const ITEM_COUNT_OPTIONS = [10000, 25000, 50000, 100000, 1000000];
const LIST_LIBRARY_OPTIONS = ["tanstack", "legend"] as const;
const LIST_HEIGHT = 560;
const DEFAULT_ITEM_COUNT = 10000;

function createMetricsState(): Record<ListLibrary, BenchmarkMetrics> {
  return {
    tanstack: createEmptyMetrics(),
    legend: createEmptyMetrics(),
  };
}

function formatMs(value: number | null) {
  if (value === null) {
    return "n/a";
  }

  return `${value.toFixed(2)}ms`;
}

function formatFps(value: number | null) {
  if (value === null) {
    return "n/a";
  }

  return value.toFixed(1);
}

function formatMB(value: number | null) {
  if (value === null) {
    return "n/a";
  }

  return `${(value / 1024 / 1024).toFixed(2)}MB`;
}

function App() {
  const [activeLibrary, setActiveLibrary] = useQueryState(
    "library",
    parseAsStringLiteral(LIST_LIBRARY_OPTIONS).withDefault("tanstack")
  );
  const [seed, setSeed] = useState(DEFAULT_BENCHMARK_SEED);
  const [seedInput, setSeedInput] = useState(String(DEFAULT_BENCHMARK_SEED));
  const [itemCount, setItemCount] = useState(DEFAULT_ITEM_COUNT);
  const [datasetVersion, setDatasetVersion] = useState(0);
  const [employees, setEmployees] = useState(() =>
    generateEmployees(DEFAULT_ITEM_COUNT, { seed: DEFAULT_BENCHMARK_SEED })
  );
  const [metricsByLibrary, setMetricsByLibrary] = useState(createMetricsState);

  const resetMetrics = () => {
    setMetricsByLibrary(createMetricsState());
  };

  const regenerateDataset = (nextCount: number, nextSeed: number) => {
    resetGeneratorSeed(nextSeed);
    setEmployees(generateEmployees(nextCount, { seed: nextSeed }));
    setDatasetVersion((version) => version + 1);
    resetMetrics();
  };

  const updateLibraryMetrics = (
    library: ListLibrary,
    updater: (current: BenchmarkMetrics) => BenchmarkMetrics
  ) => {
    setMetricsByLibrary((previous) => {
      return {
        ...previous,
        [library]: updater(previous[library]),
      };
    });
  };

  const applySeed = () => {
    const parsedSeed = Number(seedInput);

    if (!Number.isFinite(parsedSeed)) {
      return;
    }

    setSeed(parsedSeed);
    regenerateDataset(itemCount, parsedSeed);
  };

  const randomizeSeed = () => {
    const nextSeed = Math.floor(Math.random() * 1_000_000_000);
    setSeed(nextSeed);
    setSeedInput(String(nextSeed));
    regenerateDataset(itemCount, nextSeed);
  };

  const snapshotMemoryForActiveLibrary = () => {
    updateLibraryMetrics(activeLibrary, (current) => {
      return applyMemorySnapshot(current, createMemorySnapshot());
    });
  };

  const onTabValueChange = (value: string) => {
    if (value === "tanstack" || value === "legend") {
      void setActiveLibrary(value);
    }
  };

  const onProfilerRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration
  ) => {
    if (id !== "tanstack" && id !== "legend") {
      return;
    }

    updateLibraryMetrics(id, (current) => {
      return applyProfilerSample(current, {
        phase,
        actualDuration,
        baseDuration,
      });
    });
  };

  const onFirstRenderMs = (library: ListLibrary, ms: number) => {
    updateLibraryMetrics(library, (current) => {
      return applyMemorySnapshot(
        applyFirstRenderMs(current, ms),
        createMemorySnapshot()
      );
    });
  };

  const onScrollFps = (library: ListLibrary, fps: number) => {
    updateLibraryMetrics(library, (current) => applyFpsSample(current, fps));
  };

  const activeMetrics = metricsByLibrary[activeLibrary];
  const listKey = `${activeLibrary}-${datasetVersion}`;

  return (
    <main className="mx-auto flex w-full max-w-[1700px] flex-col gap-4 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Virtual List Benchmark
        </h1>
        <p className="text-sm text-muted-foreground">
          Compare TanStack Virtual and Legend List using the same dataset and
          row renderer.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Item count:</span>
          {ITEM_COUNT_OPTIONS.map((count) => {
            const isActive = count === itemCount;

            return (
              <Button
                key={count}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setItemCount(count);
                  regenerateDataset(count, seed);
                }}
              >
                {count.toLocaleString()}
              </Button>
            );
          })}

          <div className="ml-2 flex items-center gap-2">
            <label htmlFor="seed-input" className="text-sm font-medium">
              Seed
            </label>
            <input
              id="seed-input"
              type="number"
              className="h-8 w-36 rounded-md border border-border bg-background px-2 text-sm"
              value={seedInput}
              onChange={(event) => setSeedInput(event.target.value)}
            />
            <Button variant="outline" size="sm" onClick={applySeed}>
              Apply seed
            </Button>
            <Button variant="outline" size="sm" onClick={randomizeSeed}>
              Random seed
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => regenerateDataset(itemCount, seed)}
          >
            Regenerate data
          </Button>
          <Button variant="outline" size="sm" onClick={resetMetrics}>
            Reset metrics
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={snapshotMemoryForActiveLibrary}
          >
            Snapshot memory
          </Button>
        </div>
      </section>

      <Tabs value={activeLibrary} onValueChange={onTabValueChange}>
        <TabsList>
          <TabsTrigger value="tanstack">TanStack Virtual</TabsTrigger>
          <TabsTrigger value="legend">Legend List</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Commits</div>
          <div className="text-xl font-semibold">{activeMetrics.commitCount}</div>
          <div className="text-xs text-muted-foreground">
            mount: {activeMetrics.mountCount} / update: {activeMetrics.updateCount}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">First render</div>
          <div className="text-xl font-semibold">
            {formatMs(activeMetrics.firstRenderMs)}
          </div>
          <div className="text-xs text-muted-foreground">
            last commit: {formatMs(activeMetrics.lastActualDuration)}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Scroll FPS</div>
          <div className="text-xl font-semibold">
            {formatFps(activeMetrics.fpsAverage)}
          </div>
          <div className="text-xs text-muted-foreground">
            min {formatFps(activeMetrics.fpsMin)} / max{" "}
            {formatFps(activeMetrics.fpsMax)} ({activeMetrics.fpsSampleCount}{" "}
            samples)
          </div>
        </article>

        <article className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Memory</div>
          <div className="text-xl font-semibold">
            {activeMetrics.memory.supported
              ? formatMB(activeMetrics.memory.usedJSHeapSize)
              : "unsupported"}
          </div>
          <div className="text-xs text-muted-foreground">
            total {formatMB(activeMetrics.memory.totalJSHeapSize)} / limit{" "}
            {formatMB(activeMetrics.memory.jsHeapSizeLimit)}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-border bg-background p-2">
        {activeLibrary === "tanstack" ? (
          <Profiler id="tanstack" onRender={onProfilerRender} key={listKey}>
            <TanStackBenchmarkList
              employees={employees}
              height={LIST_HEIGHT}
              onFirstRenderMs={(ms) => onFirstRenderMs("tanstack", ms)}
              onScrollFps={(fps) => onScrollFps("tanstack", fps)}
            />
          </Profiler>
        ) : (
          <Profiler id="legend" onRender={onProfilerRender} key={listKey}>
            <LegendBenchmarkList
              employees={employees}
              height={LIST_HEIGHT}
              onFirstRenderMs={(ms) => onFirstRenderMs("legend", ms)}
              onScrollFps={(fps) => onScrollFps("legend", fps)}
            />
          </Profiler>
        )}
      </section>

      <section className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Fair comparison tips:</strong> keep
        viewport size and item count fixed, click reset metrics before each run,
        and compare both libraries under the same seed.
      </section>
    </main>
  );
}

export default App;
