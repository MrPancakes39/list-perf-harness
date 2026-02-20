import { useEffect, useRef } from "react";
import {
  LegendList,
  type LegendListRenderItemProps,
} from "@legendapp/list/react";
import { EmployeeItem } from "../EmployeeItem";
import type { Employee } from "../generate-data";
import { useScrollFpsSampler } from "./useScrollFpsSampler";

interface LegendBenchmarkListProps {
  employees: Employee[];
  height: number;
  onFirstRenderMs: (ms: number) => void;
  onScrollFps: (fps: number) => void;
}

export function LegendBenchmarkList({
  employees,
  height,
  onFirstRenderMs,
  onScrollFps,
}: LegendBenchmarkListProps) {
  const renderStartRef = useRef(performance.now());
  const onScroll = useScrollFpsSampler({ onSample: onScrollFps });

  useEffect(() => {
    onFirstRenderMs(performance.now() - renderStartRef.current);
  }, [onFirstRenderMs]);

  const renderItem = ({ item, index }: LegendListRenderItemProps<Employee>) => {
    return (
      <div className="px-4">
        <EmployeeItem employee={item} rowNumber={index + 1} />
      </div>
    );
  };

  return (
    <LegendList
      data={employees}
      renderItem={renderItem}
      keyExtractor={(employee) => String(employee.EmployeeID)}
      estimatedItemSize={58}
      recycleItems
      drawDistance={320}
      style={{ height, overflow: "auto" }}
      onScroll={onScroll}
    />
  );
}
