const Block = require('./block');

/**
 * @description Blockchain.
 * @property {Block[]} Blockchain._chain Chain of blocks
 */
class Blockchain {
  constructor(genesisBlock = Blockchain.createGenesisBlock()) {
    /** @private */
    this._chain = [genesisBlock]; //Initialize with a genesis block (first block)
  }

  /**
   * @description Create the first (genesis) block.
   * @return {Block}
   */
  static createGenesisBlock() {
    return new Block('Genesis Block', 0, Date.now(), '0');
  }

  /**
   * @description Add a new block based on one.
   * @param {Block} block New block.
   */
  addBlock(block) {
    /*block._prevHash = this.getLast().hash;
    block.updateHash();
    this._chain.push(block);*/
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
    this._chain.push(newBlock);
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
    return this._chain;
  }

  /**
   * @description Size of the chain.
   * @return {number} Size
   */
  size() {
    return this._chain.length;
  }

  /**
   * @description Get a specific block.
   * @param {number} index Index
   * @return {*}
   */
  getBlock(index) {
    let sz = this.size();
    if (index > sz) throw new Error('Index out of bounds');
    else return (index < 0) ? this._chain[sz + index] : this._chain[index];
  }

  /**
   * @description Get the index that the next block should have.
   * @return {number} Next index
   */
  getNextIndex() {
    return this.getBlock(-1).index + 1;
  }

  /**
   * @description Validates the _chain.
   * @return {boolean} Validity
   */
  isValid() {
    for (let i = 1; i < this._chain.length; ++i){
      const currentBlock = this._chain[i], prevBlock = this._chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash() || currentBlock.prevHash !== prevBlock.hash) return false;
    }
    return true;
  }

  toString() {
    return `Blockchain(chain=[${this.chain.map(block => block.toString())}])`;
  }
}

module.exports = Blockchain;