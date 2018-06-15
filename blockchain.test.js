const Blockchain = require('./blockchain'), {Block, Transaction} = require('./block'), SHA256 = require('crypto-js/sha256');
const diff = 3, sha256Of2 = SHA256(diff);

test('Blockchain created', () => {
  let trans = [new Transaction('Lorem', 'localhost', 10)], empty = [new Transaction('', '')], chain = new Blockchain(diff), first = new Block(empty, Date.now() - 1, '0'),
    genesis = chain.getBlock(0);
  first.mineBlock(diff);
  expect(chain.chain).toBeDefined();
  expect(chain.difficulty).toBeDefined();
  expect(genesis).toEqual({});
  expect(genesis.equals(first)).toBeFalsy();
  expect(chain.getBlock(-1).equals(genesis)).toBeTruthy();
  let second = new Block(empty, genesis.timestamp, sha256Of2);
  second.mineBlock(diff);
  expect(genesis.equals(second)).toBeFalsy();
  expect(chain.isValid()).toBeTruthy();
});


test('Adding stuff', () => {
  let jCoin = new Blockchain(), start = 150;
  jCoin.welcome(['Lorem', 'Ipsum', 'Dolore', 'Sit'], start);
  jCoin.addTransaction(new Transaction('Lorem', 'Ipsum', 123));
  expect(jCoin.size()).toBe(2);
  console.log(jCoin.toString());
  jCoin.minePendingTransaction('Lorem');
  expect(jCoin.size()).toBe(3);
  expect(jCoin.isValid()).toBeTruthy();
  // try {
  //   jCoin.addTransaction(new Transaction('Dolore', 'Sit', 246)); //This should fail due to being more than what he has
  // } catch (err) {
  //   console.log('Caught error:', err);
  // }
  // expect(jCoin.addTransaction(new Transaction('Dolore', 'Sit', 246))).toEqual({error: 'The transaction requires more coins than the sender (Dolore) has (246j$ off 150j$)'});

  console.log(jCoin.toString());
  expect(jCoin.getBalanceOfAddress('local')).toEqual(0);
  expect(jCoin.getBalanceOfAddress('Lorem')).toEqual(start - 123);
  expect(jCoin.getBalanceOfAddress('Ipsum')).toEqual(start + 123);
  expect(jCoin.getBalanceOfAddress('Dolore')).toEqual(start);
  expect(jCoin.getBalanceOfAddress('Sit')).toEqual(start);
  jCoin.minePendingTransaction('Lorem');
  console.log(jCoin.toString());
  expect(jCoin.getBalanceOfAddress('Dolore')).toEqual(start);
  expect(jCoin.getBalanceOfAddress('Sit')).toEqual(start);
  ['Lorem', 'Ipsum', 'Dolore', 'Sit'].forEach(n => console.log(`${n} has ${jCoin.getBalanceOfAddress(n)}${jCoin.currencySymbol}`));
  // expect(jCoin.addTransaction(new Transaction('Lorem', 'Sit', -12))).toEqual({error: 'Negative transactions aren\'t doable (from Lorem to Sit)'});
  jCoin.minePendingTransaction('Dolore');
  console.log(jCoin.toString());
    ['Lorem', 'Ipsum', 'Dolore', 'Sit'].forEach(n => console.log(`${n} has ${jCoin.getBalanceOfAddress(n)}${jCoin.currencySymbol}`));
});

test('Attack', () => {
  let pl = 'Lorem', chain = new Blockchain();
  ['Ipsum', 'Dolore'].forEach(from => chain.addTransaction(new Transaction(from, pl, Math.random() * 100 | 0)));
  chain.chain = false;
  expect(chain.chain).not.toBeFalsy();

  let h0 = new Block([new Transaction(pl, 'Nowt', 2)], Date.now(), sha256Of2);
  h0.mineBlock(diff);
  let h1 = new Block([new Transaction(pl, 'Hello', 4)], Date.now(), h0.hash);
  h1.mineBlock(diff);
  let h2 = new Block([new Transaction(pl, 'World', 8)], Date.now(), h1.hash);
  h2.mineBlock(diff);
  let atk = [h0, h1, h2];

  chain.chain.forEach((block, idx) => atk[idx]);
  for (let i = 0; i < chain.size(); ++i) {
    console.log(chain.chain[i].toString(), '\n', atk[i].toString(), '\n\n');
    expect(chain.chain[i].equals(atk[i])).toBeFalsy();
  }
});