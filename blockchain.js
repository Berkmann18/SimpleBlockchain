const {Block, Transaction} = require('./block'), SHA256 = require('crypto-js/sha256');
const BANK = 'null';

/* @todo Add wallets and PKE to sign transactions */

/** @private */
let prvProps = new WeakMap();

/**
 * @description Blockchain.
 * @property {Block[]} Blockchain.chain Chain of blocks
 * @property {number} Blockchain.difficulty Number of 0's at the beginning of hashes
 * @property {number} Blockchain.miningReward Amount of coins a miner gets as a reward
 */
class Blockchain {
  /**
   * @description Creates a blockchain
   * @param {number} [difficulty=5] Difficulty of the hashes
   * @param {Block} [genesisBlock=Blockchain.createGenesisBlock(difficulty)] Genesis block
   * @param {number} [reward=100] Mining reward
   * @param {string} [currencySymbol='j$'] Currency symbol
   */
  constructor(difficulty = 5, genesisBlock = Blockchain.createGenesisBlock(difficulty), reward = 100, currencySymbol = 'j$') {
    genesisBlock.mineBlock(difficulty);
    prvProps.set(this, {chain: [genesisBlock], difficulty, pendingTransactions: [], miningReward: reward, currencySymbol});
  }
  /**
   * @description Create the first (genesis) block.
   * @param {number} difficulty Difficulty of the hash
   * @return {Block} Genesis block
   */
  static createGenesisBlock(difficulty) {
    return new Block([], Date.now(), SHA256(difficulty));
  }

  /**
   * @description Add a new block.
   *  @param {*} transactions Data contained in the block
   * @param {number} [timestamp=Date.now()] Timestamp associated to the block
   */
  _add(transactions, timestamp=Date.now()) {
    let newBlock = new Block(transactions, timestamp, this.getBlock(-1).hash);
    newBlock.mineBlock(prvProps.get(this).difficulty);
    prvProps.get(this).chain.push(newBlock);
  }

  /**
   * @description Add a transaction to the list of pending ones.
   * @param {Transaction} transaction New transaction
   * @throws {Error} Undeliverable transaction (negative amount or not enough funds)
   */
  addTransaction(transaction) {
    //Validation here
    if (transaction.amount < 0) throw `Negative transactions aren\'t doable (from ${transaction.from} to ${transaction.to})`; //throw new Error('Negative transactions aren\'t doable');
    let senderBalance = this.getBalanceOfAddress(transaction.from);
    if (transaction.from !== BANK && senderBalance < transaction.amount) throw `The transaction requires more coins than the sender (${transaction.from}) has (${transaction.amount}${this.currencySymbol} off ${senderBalance}${this.currencySymbol})`;//throw new Error(`The transaction requires more coins than the sender has (${transaction.amount} ${this.currencySymbol} off ${senderBalance} ${this.currencySymbol})`);
    prvProps.get(this).pendingTransactions.push(transaction);
  }

  /**
   * @description Mine a new block and send the reward to the miner.
   * @param {string} miningRewardAddr Address of the miner who gained a mining reward
   */
  minePendingTransaction(miningRewardAddr) {
    //Create a new block with all pending transactions and mine it and add the newly mined block to the chain
    this._add(prvProps.get(this).pendingTransactions);

    //Reset the pending transactions and send the mining reward
    prvProps.get(this).pendingTransactions = [new Transaction('null', miningRewardAddr, this.miningReward)];
  }


  /**
   * @description Get the blockchain.
   * @return {Block[]} Chain
   */
  get chain() {
    return prvProps.get(this).chain;
  }

  /**
   * @description Get the hash difficulty.
   * @return {number} Difficulty
   */
  get difficulty() {
    return prvProps.get(this).difficulty;
  }

  /**
   * @description Get the mining reward.
   * @return {number} Reward
   */
  get miningReward() {
    return prvProps.get(this).miningReward;
  }

  /**
   * @description Get the currency symbol.
   * @return {string} Symbol
   */
  get currencySymbol() {
    return prvProps.get(this).currencySymbol
  }

  /**
   * @description Size of the chain.
   * @return {number} Size
   */
  size() {
    return prvProps.get(this).chain.length;
  }

  /**
   * @description Get a specific block.
   * @param {number} index Index
   * @return {*}
   */
  getBlock(index) {
    let sz = this.size();
    if (index > sz) throw new Error('Index out of bounds');
    else return (index < 0) ? prvProps.get(this).chain[sz + index] : prvProps.get(this).chain[index];
  }

  /**
   * @description Validates the chain.
   * @return {boolean} Validity
   */
  isValid() {
    let chain = this.chain;
    for (let i = 1; i < chain.length; ++i){
      const currentBlock = chain[i], prevBlock = chain[i - 1], pad = '0'.repeat(this.difficulty);
      let incorrectPadding = (!currentBlock.hash.startsWith(pad) || !prevBlock.hash.startsWith(pad));
      if (incorrectPadding || currentBlock.hash !== currentBlock.calculateHash() || currentBlock.prevHash !== prevBlock.hash) return false;
    }
    return true;
  }

  toString() {
    return `Blockchain(chain=[${this.chain.map(block => block.toString())}], pendingTransactions=${prvProps.get(this).pendingTransactions}, difficulty=${this.difficulty}, miningReward=${this.miningReward})`;
  }

  /**
   * @description Check the balance of an address.
   * @param {string} addr Address
   * @return {number} Balance
   */
  getBalanceOfAddress(addr) {
    let balance = 0;

    //Loop over each block and each transaction inside the block
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        //If the given address is the sender -> reduce the balance
        if (trans.from === addr) balance -= trans.amount;
        //If the given address is the receiver -> increase the balance
        if (trans.to === addr) balance += trans.amount;
      }
    }
    return balance;
  }

  /**
   * @description Welcome users with a given amount of coins as a starting balance.
   * @param {string[]} users List of users
   * @param {number} [amount=100] Starting balance
   */
  welcome(users, amount = 100) {
    users.forEach(usr => this.addTransaction(new Transaction(BANK, usr, amount)));
    this.minePendingTransaction(BANK);
  }
}

module.exports = Blockchain;