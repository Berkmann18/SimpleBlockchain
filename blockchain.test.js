const Blockchain = require('./blockchain'), Block = require('./block'), SHA256 = require('crypto-js/sha256');
const diff = 2, sha256Of2 = SHA256(diff);

test('Blockchain created', () => {
  let pl = 'Lorem', chain = new Blockchain(), first = new Block('Genesis Block', 0, Date.now() - 1, '0'), genesis = chain.getBlock(0);
  first.mineBlock(4);
  expect(chain.chain).toBeDefined();
  expect(chain.difficulty).toBeDefined();
  expect(genesis).toEqual({});
  expect(genesis.equals(first)).toBeFalsy();
  expect(chain.getBlock(-1).equals(genesis)).toBeTruthy();
  let second = new Block(first.data, 0, genesis.timestamp, sha256Of2);
  second.mineBlock(2);
  expect(genesis.equals(second)).toBeTruthy();
  expect(chain.getNextIndex()).toBe(1);
  expect(chain.isValid()).toBeTruthy();
});

test('Adding stuff', () => {
  let pl = 'Lorem', chain = new Blockchain();
  chain.add('Ipsum');
  expect(chain.size()).toBe(2);
  expect(chain.isValid()).toBeTruthy();
  chain.addBlock(new Block('Dolore'));
  
});

test('Attack', () => {
  let pl = 'Lorem', chain = new Blockchain();
  chain.addMultiple(['Ipsum', 'Dolore']);
  chain.chain = false;
  expect(chain.chain).not.toBeFalsy();

  let h0 = new Block('Nowt', 0, Date.now(), sha256Of2);
  h0.mineBlock(diff);
  let h1 = new Block('Hello', 1, Date.now(), h0.hash);
  h1.mineBlock(diff);
  let h2 = new Block('World', 2, Date.now(), h1.hash);
  h2.mineBlock(diff);
  let atk = [h0, h1, h2];

  chain.chain.forEach((block, idx) => atk[idx]);
  for (let i = 0; i < chain.size(); ++i) {
    console.log(chain.chain[i].toString(), '\n', atk[i].toString(), '\n\n');
    expect(chain.chain[i].equals(atk[i])).toBeFalsy();
  }
});