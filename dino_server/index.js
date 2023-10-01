require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Here we add the bodyParser middleware
app.use(bodyParser.json());

// オプションを設定してCORSミドルウェアを有効にする
const corsOptions = {
  origin: 'http://localhost:1234',  // クライアントのオリジン
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const startGameHandler = require('./components/startGame');
const recordGameHandler = require('./components/recordGame');
const clearGameHandler = require('./components/clearGame');
const failedGameHandler = require('./components/failedGame');
const {
  wallet,
  provider,
  connectedWallet,
  contractAddress,
  abi,
  contract,
} = require('./sharedResources/sharedResources');

// HOST と PORT を定義するか、または sharedResources.js からインポート
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

app.post('/start-game', startGameHandler);
app.post('/record-game', recordGameHandler);
app.post('/clear-game', clearGameHandler);
app.post('/failed-game', failedGameHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
