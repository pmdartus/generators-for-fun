function* getReportStatement() {
  const user = yield fetchUser();
  const transactions = yield fetchTransactions(user.id);
  const balance = yield computeBalance(transactions);

  return createReport(user, transactions, balance);
}

function* generateReport() {
  const report = yield* getReportStatement();
  const pdf = yield renderToPdf(report);
  return pdf;
}

const delay = (name, time, factory) => () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log(`${name}: waited ${time}ms`);
      resolve(factory());
    }, time)
  );
};

const createReport = (user, transactions, balance) => ({
  user,
  transactions,
  balance,
});

const fetchUser = delay("fetchUser", 1000, () => ({
  id: 123,
}));
const fetchTransactions = delay("fetchTransactions", 2000, () => [
  { id: 1, amount: 100 },
  { id: 2, amount: 200 },
]);
const computeBalance = delay("computeBalance", 500, () => 300);
const renderToPdf = delay("renderToPdf", 1000, () => "PDF");

function spawn(iter) {
  const cancel = () => {
    iter.return();
  };

  const result = new Promise((resolve, reject) => {
    async function step(value, isError) {
      const { value: next, done } = iter.next(value);

      if (done) {
        return resolve(value);
      }

      if (next instanceof Promise) {
        const resolved = await next;
        step(resolved);
      } else {
        step(next);
      }
    }

    step();
  });

  return { result, cancel };
}

const { result, cancel } = spawn(generateReport());
result.then((res) => console.log(`Finished with`, res));

setTimeout(() => {
  cancel();
}, 2000);
