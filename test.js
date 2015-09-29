var assert = require('assert');
var subsets = require('./');

describe('subsets', function() {
  function pluckIds(group) {
    return group.map(function(e) { return e.id });
  }

  it('groups by commonality', function() {
    var sets = subsets([ 1, 10, 4, 25, 25, 26, 6 ], function(a, b) {
      return Math.abs(a - b) <= 3;
    });

    assert.deepEqual(sets, [[1, 4, 6], [10], [25, 25, 26]]);
  });

  describe('complex examples', function() {
    it('groups serial events in same category', function() {
      var events = [
        { id: 1, type: 'A', createdAt: new Date('2015-09-06 20:45') },
        { id: 2, type: 'B', createdAt: new Date('2015-09-06 20:46') },
        { id: 3, type: 'A', createdAt: new Date('2015-09-06 20:47') },
        { id: 4, type: 'B', createdAt: new Date('2015-09-06 20:48') },
        { id: 5, type: 'B', createdAt: new Date('2015-09-06 20:49') },
        { id: 6, type: 'A', createdAt: new Date('2015-09-06 20:50') },
        { id: 7, type: 'A', createdAt: new Date('2015-09-06 20:51') }
      ];

      var sets = subsets(events, function isSerial(a, b) {
        return a.type === b.type &&
               Math.abs(b.createdAt - a.createdAt) <= 2 * 60 * 1000;
      });

      assert.deepEqual(sets.map(pluckIds), [[1, 3], [2, 4, 5], [6, 7]]);
    });

    it('groups close vertices', function() {
      var vertices = [
        { id: 1, x: 2, y: 1 },
        { id: 5, x: 1, y: 3 },
        { id: 2, x: 4, y: 1 },
        { id: 3, x: 3, y: 2 },
        { id: 4, x: 4, y: 2 },
        { id: 6, x: 2, y: 3 }
      ];

      var sets = subsets(vertices, function isClose(v, u) {
        return Math.sqrt(Math.pow(v.x - u.x, 2) + Math.pow(v.y - u.y, 2)) <= 1;
      });

      assert.deepEqual(sets.map(pluckIds), [[1], [5, 6], [2, 4, 3]]);
    });
  });

  it('handles empty sets', function() {
    var sets = subsets([], function(a, b) {
      return a === b;
    });

    assert.deepEqual(sets, []);
  });

  describe('performance', function() {
    var sample = [10, 20, 30, 40, 50, 60];

    var O = function(n) { return n * (n - 1) / 2 };
    var o = function(n) { return n - 1 };

    it('worst case N * (N - 1) / 2', function() {
      var checksCount = 0;

      subsets(sample, function(a, b) {
        checksCount++;
        return false;
      });

      assert.equal(checksCount, O(sample.length));
    });

    it('best case N - 1', function() {
      var checksCount = 0;

      subsets(sample, function(a, b) {
        checksCount++;
        return true;
      });

      assert.equal(checksCount, o(sample.length));
    });
  });
});
