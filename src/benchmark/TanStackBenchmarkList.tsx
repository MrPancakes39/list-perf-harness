import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EmployeeItem } from "../EmployeeItem";
import type { Employee } from "../generate-data";
import { useScrollFpsSampler } from "./useScrollFpsSampler";

interface TanStackBenchmarkListProps {
  employees: Employee[];
  height: number;
  onFirstRenderMs: (ms: number) => void;
  onScrollFps: (fps: number) => void;
}

export function TanStackBenchmarkList({
  employees,
  height,
  onFirstRenderMs,
  onScrollFps,
}: TanStackBenchmarkListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const renderStartRef = useRef(performance.now());
  const onScroll = useScrollFpsSampler({ onSample: onScrollFps });

  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 58,
    overscan: 8,
  });

  useEffect(() => {
    onFirstRenderMs(performance.now() - renderStartRef.current);
  }, [onFirstRenderMs]);

  return (
    <div
      ref={scrollContainerRef}
      className="rounded-lg border border-border bg-background"
      style={{ height, overflow: "auto" }}
      onScroll={onScroll}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const employee = employees[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                left: 0,
                position: "absolute",
                top: 0,
                transform: `translateY(${virtualItem.start}px)`,
                width: "100%",
              }}
            >
              <div className="px-4">
                <EmployeeItem employee={employee} rowNumber={virtualItem.index + 1} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
