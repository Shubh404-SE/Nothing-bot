import type { Metrics } from "./metrics.interface.js";

export class NoopMetrics implements Metrics {
  increment(): void {
    // noop
  }

  histogram(): void {
    // noop
  }
}
