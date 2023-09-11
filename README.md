Generators implements the iterator protocol in JavaScript. 
It's a mix between an iterator and a function. 
Execution is paused until `.next()` is invoked. 

It looks a lot like an `async` function, reads like a function that execute synchronously. But requires the invoker to request the next value to advance into the execution. 

Observable or EventEmitter ==> Push new values to consumers.
Iterator or Generator ==> Consumer pull new values. 

`Array.from` is same performance that `for ... of` in the benchmark.

