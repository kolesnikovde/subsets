'use strict';

module.exports = function(items, fn) {
  var result = [],
      subset = [],
      nodes = connections(items, fn);

  function visit(node) {
    subset.push(node.item);
    node.connections.forEach(visit);
  }

  nodes.forEach(function(node) {
    if (node.connected) return;

    visit(node);
    result.push(subset);
    subset = [];
  });

  return result;
}

function connections(items, fn) {
  var nodes = items.map(function(item) {
    return { item: item, connections: [], connected: false };
  });

  for (var i = 0, len = items.length; i < len; i++) {
    var a = nodes[i];

    for (var j = i + 1; j < len; j++) {
      var b = nodes[j];

      if (!(a.connected && b.connected) && fn(a.item, b.item)) {
        if (b.connected) {
          b.connections.push(a);
          a.connected = true;
        } else {
          a.connections.push(b);
          b.connected = true;
        }
      }
    }
  }

  return nodes;
}
