'use strict';
const SHA256 = require('crypto-js/sha256');

/** @private */
let prvProps = new WeakMap();

/**
 * Blockchain block.
 * @version 1.0
 * @property {*} Block._data Data
 * @property {number} Block._index Index of the block in a _chain
 * @property {number} Block._timestamp Timestamp associated to the block
 * @property {string} Block._prevHash Previous block's hash
 * @property {string} Block._hash Current block's hash
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
    prvProps.set(this, {data, index, timestamp, prevHashs});
    this.updateHash();
  }

  /**
   * @description Calculate the hash.
   */
  calculateHash() {
    return SHA256(prvProps.get(this).index + prvProps.get(this).timestamp + JSON.stringify(prvProps.get(this).data) + prvProps.get(this).prevHash).toString()
  }

  /**
   * @description Update the hash of the block.
   */
  updateHash() {
    prvProps.get(this).hash = this.calculateHash();
  }

  /**
   * @description Get the block's index.
   * @return {number} Index
   */
  get index() {
    return prvProps.get(this).index;
  }

  /**
   * @description Get the block's payload.
   * @return {*} Data
   */
  get data() {
    return prvProps.get(this).data;
  }

  /**
   * @description Get the timestamp associated to the block.
   * @return {number} Timestamp
   */
  get timestamp() {
    return prvProps.get(this).timestamp;
  }

  /**
   * @description Get the previous hash.
   * @return {string} Previous hash
   */
  get prevHash() {
    return prvProps.get(this).prevHash;
  }

  /**
   * @description Get the block's hash.
   * @return {*} Hash
   */
  get hash() {
    return prvProps.get(this).hash;
  }

  toString() {
    return `Block(index=${this.index}, data=${this.data}, timestamp=${this.timestamp}, prevHash=${this.prevHash}, hash=${this.hash})`;
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