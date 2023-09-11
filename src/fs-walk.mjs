import fs from "node:fs";
import { Bench } from "tinybench";

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

async function* asyncGenWalkIterWithTypes(dirname) {
  const queue = [dirname];
  let current;
  while ((current = queue.shift())) {
    const dirents = await fs.promises.readdir(current, { withFileTypes: true });
    for (const dirent of dirents) {
      const path = `${current}/${dirent.name}`;

      let isDirectory = dirent.isDirectory();
      if (!isDirectory && dirent.isSymbolicLink()) {
        isDirectory = (await fs.promises.stat(path)).isDirectory();
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

const bench = new Bench();

bench.addEventListener("cycle", (evt) => {
  console.log(`Running test for ${evt.task.name}...`);
});

bench
  .add("Sync generator (recursive)", () => {
    for (const _ of syncGenWalk(DIRNAME)) {
    }
  })
  .add("Sync generator (iterative)", () => {
    for (const _ of syncGenWalkIter(DIRNAME)) {
    }
  })
  .add("Sync generator (iterative with types)", () => {
    for (const _ of syncGenWalkIterWithTypes(DIRNAME)) {
    }
  })
  .add("Async generator (recursive)", async () => {
    for await (const _ of asyncGenWalk(DIRNAME)) {
    }
  })
  .add("Async generator (iterative)", async () => {
    for await (const _ of asyncGenWalkIter(DIRNAME)) {
    }
  })
  .add("Async generator (iterative with types)", async () => {
    for await (const _ of asyncGenWalkIterWithTypes(DIRNAME)) {}
  });

await bench.run();

console.table(
  bench.tasks.map((task) => {
    const { name, result } = task;
    return {
      Name: name,
      "Mean (ms)": result.mean.toFixed(2),
      "Standard Deviation (ms)": result.sd.toFixed(2),
    };
  })
);
