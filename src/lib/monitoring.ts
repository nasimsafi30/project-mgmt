import React from 'react';
interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  trackMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.push({ name, value, tags, timestamp: Date.now() });
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  trackPageLoad(): void {
    if (typeof window !== 'undefined') {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (nav) {
        this.trackMetric('page_load_time', nav.loadEventEnd - nav.fetchStart);
        this.trackMetric('dom_content_loaded', nav.domContentLoadedEventEnd - nav.fetchStart);
      }
    }
  }

  trackApiCall(endpoint: string, duration: number, status: number): void {
    this.trackMetric('api_response_time', duration, { endpoint, status: status.toString() });
  }

  trackRenderTime(componentName: string, duration: number): void {
    this.trackMetric('component_render_time', duration, { component: componentName });
  }

  trackUserAction(action: string, metadata?: Record<string, any>): void {
    this.trackMetric('user_action', 1, { action, ...metadata });
  }

  getSummary(): Record<string, { avg: number; max: number; min: number; count: number }> {
    const summary: Record<string, { avg: number; max: number; min: number; count: number }> = {};
    const grouped = this.metrics.reduce((acc, m) => {
      if (!acc[m.name]) acc[m.name] = [];
      acc[m.name].push(m.value);
      return acc;
    }, {} as Record<string, number[]>);

    for (const [name, values] of Object.entries(grouped)) {
      summary[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length,
      };
    }
    return summary;
  }

  clear(): void {
    this.metrics = [];
  }
}

export const monitor = new PerformanceMonitor();

export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function TrackedComponent(props: P) {
    const startTime = performance.now();
    React.useEffect(() => {
      monitor.trackRenderTime(componentName, performance.now() - startTime);
    });
    return React.createElement(WrappedComponent, props);
  };
}
