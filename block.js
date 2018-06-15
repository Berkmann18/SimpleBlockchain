'use strict';
const SHA256 = require('crypto-js/sha256');

/** @private */
let prvProps = new WeakMap();

/**
 * Blockchain transactions block.
 * @property {array} Block.transactions Transactions
 * @property {number} Block.timestamp Timestamp associated to the block
 * @property {string} Block.prevHash Previous block's hash
 * @property {string} Block.hash Current block's hash
 * @property {number} Block.nonce Nonce associated to the block
 */
class Block {
  /**
   * @description Block chain block.
   * @param {Transaction[]} transactions Data contained in the block
   * @param {number} [timestamp=Date.now()] Timestamp associated to the block
   * @param {string} [prevHash=''] Hash of the previous block
   * @throws {TypeError} transactions isn't an array
   */
  constructor(transactions, timestamp = Date.now(), prevHash = '') {
    if (!Array.isArray(transactions)) throw new TypeError(`${transactions} isn't of type Transaction[]`);
    /** @private */
    prvProps.set(this, {transactions, timestamp, prevHash, hash: '', nonce: 0});
    this.updateHash();
  }

  /**
   * @description Calculate the hash.
   */
  calculateHash() {
    return SHA256(prvProps.get(this).timestamp + JSON.stringify(prvProps.get(this).transactions) + prvProps.get(this).prevHash + prvProps.get(this).nonce).toString()
  }

  /**
   * @description Update the hash of the block.
   */
  updateHash() {
    prvProps.get(this).hash = this.calculateHash();
  }

  /**
   * @description Get the block's transactions.
   * @return {*} Transaction
   */
  get transactions() {
    return prvProps.get(this).transactions;
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
    return `Block(transactions=[${this.transactions.map(trans => trans.toString())}], timestamp=${this.timestamp}, prevHash=${this.prevHash}, hash=${this.hash})`;
  }

  /**
   * @description Check if two blocks are equal.
   * @param {Block} block Block
   * @return {boolean} Equality
   */
  equals(block) {
    return this.hash === block.hash
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
  }
}

/**
 * @description Mining transaction.
 * @property {string} Transaction.from Origin address (sender)
 * @property {string} Transaction.to Destination address (receiver)
 * @property {number} Transaction.amount Amount
 */
class Transaction {
  /**
   * @param {string} from Address of the sender
   * @param {string} to Address of the receiver
   * @param {number} [amount=0] Amount of coins
   */
  constructor(from, to, amount = 0) {
    prvProps.set(this, {from, to, amount});
  }

  /**
   * @description Get the address the transaction comes from.
   * @return {string} Origin
   */
  get from() {
    return prvProps.get(this).from;
  }

  /**
   * @description Get the address the transaction goes to.
   * @return {string} Destination
   */
  get to() {
    return prvProps.get(this).to;
  }

  /**
   * @description Get the transaction' amount.
   * @return {number} Coins
   */
  get amount() {
    return prvProps.get(this).amount;
  }

  toString() {
    return `Transaction(from=${this.from}, to=${this.to}, amount=${this.amount})`;
  }
}

module.exports = {Block, Transaction};