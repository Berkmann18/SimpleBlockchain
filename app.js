const express = require('express'), app = express(), Blockchain = require('./blockchain'), uuid = require('uuid'), bodyParser = require('body-parser');
let chains = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/chain/init', (req, res) => {
  const chainId = uuid();
  chains[chainId] = new Blockchain();
  res.send(chainId);
});

app.get('/chain/:chainid/isvalid', (req, res) => {
  const chainId = req.params.chainid;
  const blockchain = chains[chainId];
  res.send(blockchain.isValid());
});

app.get('/chain/:chainid', (req, res) => {
  const chainId = req.params.chainid;
  const blockchain = chains[chainId];
  res.json(blockchain.chain);
});

app.post('/chain/:chainid/block', (req, res) => {
  const data = req.body,  chainId = req.params.chainid, timestamp = Date.now();
  const blockchain = chains[chainId], index = blockchain.size();
  blockchain.add(data, index, timestamp);
  return res.json(blockchain.chain);
});

app.listen(3e3);