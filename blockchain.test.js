const Blockchain = require('./blockchain'), Block = require('./block');

test('Blockchain created', () => {
  let pl = 'Lorem', chain = new Blockchain(), first = new Block('Genesis Block', 0, Date.now() - 1, '0');
  expect(chain.getBlock(0)).toEqual(first);
  expect(chain.getBlock(-1)).toEqual(first);
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
});