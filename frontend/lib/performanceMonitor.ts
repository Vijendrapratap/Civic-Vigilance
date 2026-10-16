/**
 * Performance Monitor - Track API latency and app performance
 *
 * Helps identify bottlenecks and optimize user experience
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completedMetrics: PerformanceMetric[] = [];

  /**
   * Start timing an operation
   */
  start(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: Date.now(),
      metadata,
    });
    console.log(`[Performance] ⏱️ Started: ${name}`);
  }

  /**
   * End timing an operation
   */
  end(name: string): number {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`[Performance] ⚠️ No start time found for: ${name}`);
      return 0;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    this.completedMetrics.push(metric);
    this.metrics.delete(name);

    // Log with color coding based on duration
    const emoji = duration < 500 ? '✅' : duration < 2000 ? '⚠️' : '🔴';
    console.log(`[Performance] ${emoji} Completed: ${name} in ${duration}ms`);

    return duration;
  }

  /**
   * Measure a promise-based operation
   */
  async measure<T>(name: string, operation: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await operation();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    total: number;
    average: number;
    fastest: PerformanceMetric | null;
    slowest: PerformanceMetric | null;
    byOperation: Record<string, { count: number; totalTime: number; avgTime: number }>;
  } {
    const total = this.completedMetrics.length;

    if (total === 0) {
      return {
        total: 0,
        average: 0,
        fastest: null,
        slowest: null,
        byOperation: {},
      };
    }

    const totalTime = this.completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const average = totalTime / total;

    const sorted = [...this.completedMetrics].sort((a, b) => (a.duration || 0) - (b.duration || 0));
    const fastest = sorted[0];
    const slowest = sorted[sorted.length - 1];

    // Group by operation name
    const byOperation: Record<string, { count: number; totalTime: number; avgTime: number }> = {};
    this.completedMetrics.forEach(metric => {
      if (!byOperation[metric.name]) {
        byOperation[metric.name] = { count: 0, totalTime: 0, avgTime: 0 };
      }
      byOperation[metric.name].count++;
      byOperation[metric.name].totalTime += metric.duration || 0;
    });

    // Calculate averages
    Object.keys(byOperation).forEach(name => {
      byOperation[name].avgTime = byOperation[name].totalTime / byOperation[name].count;
    });

    return {
      total,
      average,
      fastest,
      slowest,
      byOperation,
    };
  }

  /**
   * Log performance summary
   */
  logSummary(): void {
    const summary = this.getSummary();

    console.log('\n📊 === Performance Summary ===');
    console.log(`Total operations: ${summary.total}`);
    console.log(`Average duration: ${summary.average.toFixed(0)}ms`);

    if (summary.fastest) {
      console.log(`⚡ Fastest: ${summary.fastest.name} (${summary.fastest.duration}ms)`);
    }

    if (summary.slowest) {
      console.log(`🐌 Slowest: ${summary.slowest.name} (${summary.slowest.duration}ms)`);
    }

    console.log('\nBy Operation:');
    Object.entries(summary.byOperation).forEach(([name, stats]) => {
      console.log(`  ${name}: ${stats.count}x, avg ${stats.avgTime.toFixed(0)}ms`);
    });

    console.log('=== End Summary ===\n');
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }

  /**
   * Get all completed metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.completedMetrics];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper functions for common operations
export const perf = {
  /**
   * Measure API call latency
   */
  async measureAPI<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    return performanceMonitor.measure(`API: ${name}`, apiCall);
  },

  /**
   * Measure photo upload
   */
  async measureUpload<T>(photoCount: number, uploadFn: () => Promise<T>): Promise<T> {
    return performanceMonitor.measure(`Upload ${photoCount} photos`, uploadFn);
  },

  /**
   * Measure image compression
   */
  async measureCompression<T>(compressFn: () => Promise<T>): Promise<T> {
    return performanceMonitor.measure('Image compression', compressFn);
  },

  /**
   * Measure database query
   */
  async measureQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    return performanceMonitor.measure(`Query: ${queryName}`, queryFn);
  },
};

export default performanceMonitor;
