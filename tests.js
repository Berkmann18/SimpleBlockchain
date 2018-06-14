const Blockchain = require('./blockchain'), Block = require('./block');

let chain = new Blockchain();
chain.addBlock(new Block({amount: 10}, 1, Date.now()));
chain.addBlock(new Block({amount: -15}, 2, Date.now()));

let valid = chain.isValid(), seeChain = () => console.log('chain=', chain.chain.map(block => block.toString() + '  ' + (block.data.amount || block.data)));

seeChain();
console.log(`Is the chain valid? ${valid}\n`);

//Attacker Trying to manipulate the _chain to gain advantage
console.log('Changing the 3rd block.');
chain.chain[2].data = {amount: 20};

console.log('Changed?', chain.chain[2].data.amount === 20);
seeChain();
valid = chain.isValid();
console.log(`Is the chain valid? ${valid}\n`);

console.log('Changing the genesis block');
chain.chain[0].data = {data: 'H4ck3d!'};

console.log('Changed?', chain.chain[0].data.data === 'H4ck3d!');
seeChain();
valid = chain.isValid();
console.log('Is the chain valid?', valid);