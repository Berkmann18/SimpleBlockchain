const {Block, Transaction} = require('./block'), SHA256 = require('crypto-js/sha256');

test('Block created', () => {
  let trans = [new Transaction('local', 'xxx', 10)], ts = Date.now(), block = new Block(trans), hash = SHA256(ts + JSON.stringify(trans) + 0).toString();
  expect(block).toBeDefined();
  expect(block.transactions).toContain(trans[0]);
  expect(block.timestamp).toBe(ts);
  expect(block.prevHash).toBe('');
  expect(block.hash).toBe(hash);
  block.updateHash();
  expect(block.hash).toBe(hash);
  expect(typeof block.toString()).toBe('string');
  let other = new Block(trans, ts, '');
  expect(block.equals(other)).toBeTruthy();
});