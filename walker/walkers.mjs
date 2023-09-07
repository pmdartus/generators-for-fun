import fs from 'node:fs';
import { benchmark } from './benchmark.mjs';

function* syncGenWalkIter(dirname) {
  const queue = [dirname];
  let current;
  while ((current = queue.shift())) {
    const files = fs.readdirSync(current);
    for (const file of files) {
      const path = `${current}/${file}`;

      const stat = fs.statSync(path);
      if (stat.isDirectory()) {
        queue.unshift(path);
      } else {
        yield path;
      }
    }
  }
}

benchmark({
  'Generator sync': () =>
})