export type MetricTags = Record<string, string | number | boolean>;

export interface Metrics {
  increment(name: string, tags?: MetricTags): void;
  histogram(name: string, value: number, tags?: MetricTags): void;
}
