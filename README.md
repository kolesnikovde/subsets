# subsets

`groupBy` with comparison function.

### Installation

    $ npm i subsets

### Usage

```js
var subsets = require('subsets');

var checks = 0;

var sets = subsets([ 1, 10, 4, 25, 26, 6 ], function(a, b) {
  checks++;
  return Math.abs(a - b) <= 3;
});

console.log(sets);
// [[1, 4, 6], [10], [25, 26]]

console.log(checks);
// 12
```

### License

MIT
