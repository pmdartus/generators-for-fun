function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (let i of range(5, 10)) {
  console.log(i);
}
