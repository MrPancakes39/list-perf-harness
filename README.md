# Legend vs TanStack List Benchmark

This repository is a React + TypeScript benchmark harness for comparing large-list rendering performance between Legend List and TanStack Virtual under identical dataset and UI conditions, with room to add more libraries over time.

This is my first time building a benchmark, so parts of the setup or methodology may be imperfect. I used GPT-5.3-Codex to help put this project together.

## Benchmark Setup

### Libraries Tested

| Library          | Version       |
| ---------------- | ------------- |
| Legend List      | 3.0.0-beta.33 |
| TanStack Virtual | ^3.13.18      |

### Browsers Tested

| Browser  | Version | Notes                   |
| -------- | ------- | ----------------------- |
| Helium   | 0.7.6.1 | Chromium 143.0.7499.146 |
| Firefox  | 147.0.4 | Gecko                   |
| Epiphany | 46.5    | WebKit                  |

OS: Pop!\_OS 24.04 COSMIC (kernel 6.18.7-76061807-generic, arch x86_64)

### Metrics Tracked

- Item counts tested: 10K, 25K, 50K, 100K, 1M
- React Profiler metrics
- First render time (ms)
- Scroll frames per second (FPS)
- Memory usage (MB)

## Findings

These findings are more anecdotal and experimental than strictly scientific. I combined how the UI felt during manual interaction with the recorded metrics, since I'm not fully sure how to formalize visual UI testing in this benchmark.

> Disclaimer: the numbers discussed below are from my machine, and I generally use Helium as the reference browser for the numeric comparisons.

Item count range used in findings: 10K to 1M items.

### React Profiler Metrics

- For both libraries (Legend List and TanStack Virtual), the Profiler behavior was consistent in all tested browsers: one mount commit, then update commits while scrolling.

### First Render Time

- TanStack Virtual looked O(1)-like in practice: first render time stayed around 10-30ms from 10K to 100K items, then increased at 1M items to about 75ms.
- Legend List first render time increased with item count and looked O(n)-like in practice.
- The following function approximates the first render time for Legend List:

```ts
const render = (count: number) => Math.floor((1.7 * count) / 1000 / 10) * 10;
```

| Item Count | TanStack Virtual FRT (ms) | Legend List FRT (ms)                   |
| ---------- | ------------------------- | -------------------------------------- |
| 10K        | ~10-30                    | ~10                                    |
| 25K        | ~10-30                    | ~40                                    |
| 50K        | ~10-30                    | ~80                                    |
| 100K       | ~10-30                    | ~170                                   |
| 1M         | ~75                       | ~1700 to ~3000, depending on situation |

**Note:** I know the 1M-row case is a bit absurd for many real-world UIs, but it is still interesting to test as a stress case.

### Scroll Frames Per Second

- Scroll FPS was pretty similar between both libraries across most item counts.
- Legend List seemed to keep FPS a bit higher at higher item counts.**\***
- Firefox scrolling was surprisingly smoother than Helium in practice, with no white / empty items reached, especially with Legend List.

### Memory Usage

- Memory usage showed no meaningful difference between Legend List and TanStack Virtual in my tests.
