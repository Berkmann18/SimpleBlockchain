const Block = require('./block'), SHA256 = require('crypto-js/sha256');

/** @private */
let prvProps = new WeakMap();

/**
 * @description Blockchain.
 * @property {Block[]} Blockchain._chain Chain of blocks
 * @property {number} Blockchain._difficulty Number of 0's at the beginning of hashes
 */
class Blockchain {
  constructor(difficulty = 2, genesisBlock = Blockchain.createGenesisBlock(difficulty)) {
    genesisBlock.mineBlock(difficulty);
    prvProps.set(this, {chain: [genesisBlock], difficulty});
  }
  /**
   * @description Create the first (genesis) block.
   * @param {number} difficulty Difficulty of the hash
   * @return {Block} Genesis block
   */
  static createGenesisBlock(difficulty) {
    return new Block('Genesis Block', 0, Date.now(), SHA256(difficulty));
  }

  /**
   * @description Add a new block based on one.
   * @param {Block} block New block.
   */
  addBlock(block) {
    this.add(block.data, block.index, block.timestamp)
  }

  /**
   * @description Add a new block.
   *  @param {*} data Data contained in the block
   * @param {number} [index=this.getNextIndex()] Index
   * @param {number} [timestamp=Date.now()] Timestamp associated to the block
   */
  add(data, index=this.getNextIndex(), timestamp=Date.now()) {
    let newBlock = new Block(data, index, timestamp, this.getBlock(-1).hash);
    newBlock.mineBlock(prvProps.get(this).difficulty);
    prvProps.get(this).chain.push(newBlock);
  }

  /**
   * @description Add multiple data into individual blocks.
   * @param {array} data Array of data.
   */
  addMultiple(data) {
    data.forEach(d => this.add(d));
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
   * @description Get the index that the next block should have.
   * @return {number} Next index
   */
  getNextIndex() {
    return this.getBlock(-1).index + 1;
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
    return `Blockchain(chain=[${this.chain.map(block => block.toString())}], difficulty=${prvProps.get(this).difficulty})`;
  }
}

module.exports = Blockchain;