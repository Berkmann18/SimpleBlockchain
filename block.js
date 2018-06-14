'use strict';
const SHA256 = require('crypto-js/sha256');

/** @private */
let prvProps = new WeakMap();

/**
 * Blockchain block.
 * @version 1.0
 * @property {*} Block.data Data
 * @property {number} Block.index Index of the block in a chain
 * @property {number} Block.timestamp Timestamp associated to the block
 * @property {string} Block.prevHash Previous block's hash
 * @property {string} Block.hash Current block's hash
 * @property {number} Block.nonce Nonce associated to the block
 */
class Block {
  /**
   * @description Block chain block.
   * @param {*} data Data contained in the block
   * @param {number} [index=0] Index
   * @param {number} [timestamp=Date.now()] Timestamp associated to the block
   * @param {string} [prevHash=''] Hash of the previous block
   */
  constructor(data, index = 0, timestamp = Date.now(), prevHash = '') {
    /** @private */
    prvProps.set(this, {data, index, timestamp, prevHash, hash: '', nonce: 0});
    this.updateHash();
  }

  /**
   * @description Calculate the hash.
   */
  calculateHash() {
    return SHA256(prvProps.get(this).index + prvProps.get(this).timestamp + JSON.stringify(prvProps.get(this).data) + prvProps.get(this).prevHash + prvProps.get(this).nonce).toString()
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

  /**
   * @description Increment the nonce until a valid hash is obtained with enough 0's at the beginning (based on the difficulty).
   * @param {number} difficulty Difficulty of the hash
   */
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
      prvProps.get(this).nonce++;
      this.updateHash();
    }
    // console.log(`BLOCK MINED: ${this.hash}, nonce: ${prvProps.get(this).nonce}`);
  }
}

module.exports = Block;