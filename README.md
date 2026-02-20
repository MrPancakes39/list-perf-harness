# Legend vs TanStack List Benchmark

This repository is a React + TypeScript benchmark harness for comparing large-list rendering performance between Legend List and TanStack Virtual under identical dataset and UI conditions, with room to add more libraries over time.

This is my first time building a benchmark, so parts of the setup or methodology may be imperfect. I used GPT-5.3-Codex to help put this project together.

## Libraries Tested

| Library          | Version       |
| ---------------- | ------------- |
| Legend List      | 3.0.0-beta.33 |
| TanStack Virtual | ^3.13.18      |

## Browsers Tested

| Browser  | Version | Notes                   |
| -------- | ------- | ----------------------- |
| Helium   | 0.7.6.1 | Chromium 143.0.7499.146 |
| Firefox  | 147.0.4 | Gecko                   |
| Epiphany | 46.5    | WebKit                  |

OS: Pop!_OS 24.04 COSMIC (kernel 6.18.7-76061807-generic, arch x86_64)

## Metrics Tracked

- FRT (First Render Time): ms
- FPS (Frames Per Second): scroll performance
- MEM (Memory): MB
- RPT (React Profiler Timings): render timings
