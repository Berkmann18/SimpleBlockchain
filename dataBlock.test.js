const Block = require('./dataBlock'), SHA256 = require('crypto-js/sha256');

test('Block created', () => {
  let pl = 'Lorem', ts = Date.now(), block = new Block(pl), hash = SHA256(ts + JSON.stringify(pl) + 0).toString();
  expect(block).toBeDefined();
  expect(block.data).toBe(pl);
  expect(block.index).toBe(0);
  expect(block.timestamp).toBe(ts);
  expect(block.prevHash).toBe('');
  expect(block.hash).toBe(hash);
  block.updateHash();
  expect(block.hash).toBe(hash);
  expect(typeof block.toString()).toBe('string');
  let other = new Block(pl, 0, ts, '');
  expect(block.equals(other)).toBeTruthy();
});