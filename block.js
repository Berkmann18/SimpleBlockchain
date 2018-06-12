const SHA256 = require('crypto-js/sha256');

/**
 * Blockchain block.
 * @version 0.1
 * @property {*} Block._data Data
 * @property {number} Block._index Index of the block in a _chain
 * @property {number} Block._timestamp Timestamp associated to the block
 * @property {string} Block._prevHash Previous block's hash
 * @property {string} Block._hash Current block's hash
 * @deprecated
 */
class Block {
  /**
   * @description Block _chain block.
   * @param {*} data Data contained in the block
   * @param {number} [index=0] Index
   * @param {number} [timestamp=Date.now()] Timestamp associated to the block
   * @param {string} [prevHash=''] Hash of the previous block
   */
  constructor(data, index = 0, timestamp = Date.now(), prevHash = '') {
    /** @private */
    this._index = index;
    /** @private */
    this._data = data;
    /** @private */
    this._timestamp = timestamp;
    /** @protected */
    this._prevHash = prevHash;
    /** @protected */
    this._hash = '';
    this.updateHash();
  }

  /**
   * @description Calculate the hash.
   */
  calculateHash() {
    return SHA256(this._index + this._timestamp + JSON.stringify(this._data) + this._prevHash).toString()
  }

  /**
   * @description Update the hash of the block.
   */
  updateHash() {
    this._hash = this.calculateHash();
  }

  /**
   * @description Get the block's index.
   * @return {number} Index
   */
  get index() {
    return this._index;
  }

  /**
   * @description Get the block's payload.
   * @return {*} Data
   */
  get data() {
    return this._data;
  }

  /**
   * @description Get the timestamp associated to the block.
   * @return {number} Timestamp
   */
  get timestamp() {
    return this._timestamp;
  }

  /**
   * @description Get the previous hash.
   * @return {string} Previous hash
   */
  get prevHash() {
    return this._prevHash;
  }

  /**
   * @description Get the block's hash.
   * @return {*} Hash
   */
  get hash() {
    return this._hash;
  }

  toString() {
    return `Block(index=${this.index}, data=${JSON.stringify(this.data)}, timestamp=${this.timestamp}, prevHash=${this.prevHash}, hash=${this.hash})`;
  }

  /**
   * @description Check if two blocks are equal.
   * @param {Block} block Block
   * @return {boolean} Equality
   */
  equals(block) {
    return this.index === block.index && this.hash === block.hash
  }
}

module.exports = Block;