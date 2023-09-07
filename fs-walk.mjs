import fs from "node:fs";
import { performance } from "node:perf_hooks";

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

function* syncGenWalkIterWithTypes(dirname) {
  const queue = [dirname];
  let current;
  while ((current = queue.shift())) {
    const dirents = fs.readdirSync(current, { withFileTypes: true });
    for (const dirent of dirents) {
      const path = `${current}/${dirent.name}`;

      let isDirectory = dirent.isDirectory();
      if (!isDirectory && dirent.isSymbolicLink()) {
        isDirectory = fs.statSync(path).isDirectory();
      }

      if (isDirectory) {
        queue.unshift(path);
      } else {
        yield path;
      }
    }
  }
}

function* syncGenWalk(dirname) {
  const files = fs.readdirSync(dirname);
  for (const file of files) {
    const path = `${dirname}/${file}`;
    const stat = fs.statSync(path);

    if (stat.isDirectory()) {
      yield* syncGenWalk(path);
    } else {
      yield path;
    }
  }
}

async function* asyncGenWalk(dirname) {
  const files = await fs.promises.readdir(dirname);
  for (const file of files) {
    const path = `${dirname}/${file}`;

    const stat = await fs.promises.stat(path);
    if (stat.isDirectory()) {
      yield* asyncGenWalk(path);
    } else {
      yield path;
    }
  }
}

async function* asyncGenWalkIter(dirname) {
  const queue = [dirname];
  let current;
  while ((current = queue.shift())) {
    const files = await fs.promises.readdir(current);
    for (const file of files) {
      const path = `${current}/${file}`;

      const stat = await fs.promises.stat(path);
      if (stat.isDirectory()) {
        queue.unshift(path);
      } else {
        yield path;
      }
    }
  }
}

const DIRNAME = "/Users/p.dartus/code/github/salesforce/lwc";

async function benchmark(name, fn) {
  const start = performance.now();
  const res = await fn();
  const end = performance.now();

  console.log(name, end - start, res);
}

await benchmark("Sync generator", () => {
  let counter = 0;
  for (const path of syncGenWalk(DIRNAME)) {
    counter++;
  }
  return counter;
});

await benchmark("Sync generator iter", () => {
  let counter = 0;
  for (const path of syncGenWalkIter(DIRNAME)) {
    counter++;
  }
  return counter;
});

await benchmark("Sync generator iter with types", () => {
  let counter = 0;
  for (const path of syncGenWalkIterWithTypes(DIRNAME)) {
    counter++;
  }
  return counter;
});


await benchmark("Async generator", async () => {
  let counter = 0;
  for await (const path of asyncGenWalk(DIRNAME)) {
    counter++;
  }
  return counter;
});

await benchmark("Async generator iter", async () => {
  let counter = 0;
  for await (const path of asyncGenWalkIter(DIRNAME)) {
    counter++;
  }
  return counter;
});
