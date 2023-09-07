import { performance } from "node:perf_hooks";

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  const sorted = values.sort((a, b) => a - b);
  const midIndex = Math.floor(sorted.length / 2);

  if (midIndex % 2 === 0) {
    return (sorted[midIndex - 1] + sorted[midIndex - 1]) / 2;
  } else {
    return sorted[midIndex];
  }
}

function computeStats(values) {
  return {
    mean: mean(values),
    median: median(values),
  };
}

function benchmarkTest(fn) {
  return new Promise((resolve, reject) => {
    const start = performance.now();

    function done() {
      const duration = performance.now() - start;
      resolve(duration);
    }

    const res = fn();

    if (res instanceof Promise) {
      res.then(done, reject);
    } else {
      done();
    }
  });
}

export function benchmark(tests) {
  return {
    async run(config) {
      const iterations = config?.iterations ?? 10;

      const results = {};

      for (const test of tests) {
        const [name, fn] = test;
        const durations = [];

        console.log(`Running "${name}"`);
        for (let i = 0; i < iterations; i++) {
          const duration = await benchmarkTest(fn);
          durations.push(duration);
        }

        const stats = computeStats(durations);
        results[name] = {
          durations,
          stats,
        };

        let output = `Results "${name}"`;
        output += `- median: ${stats.median.toFixed(2)}ms`;
        output += `- mean: ${stats.mean.toFixed(2)}ms`;
        console.log(output);
      }

      return results;
    },
  };
}
