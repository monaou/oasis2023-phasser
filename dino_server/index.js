require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { updateDatabase, updateDatabaseWithTicketInfo, createTables } = require('./databaseSQL');

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
  ethers,
  wallet,
  provider,
  connectedWallet,
  contractAddress,
  abi,
  contract,
  TicketPlatform,
} = require('./sharedResources/sharedResources');

// HOST と PORT を定義するか、または sharedResources.js からインポート
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

app.post('/start-game', startGameHandler);
app.post('/record-game', recordGameHandler);
app.post('/clear-game', clearGameHandler);
app.post('/failed-game', failedGameHandler);

const contractTicketPlatform = new ethers.Contract(TicketPlatform.address, TicketPlatform.abi, provider);

contractTicketPlatform.on("TicketPurchased", async (user, ticketType, ticketNum, event) => {
  console.log(`TicketPurchased purchased by ${user} of type ${ticketType} and num ${ticketNum}`);

  // Here you could update your MySQL database. E.g.,
  await updateDatabase(user, ticketType, ticketNum);
});

contractTicketPlatform.on("TicketInfoPurchased", async (ticketType, ticketPrice, isTicketRange, ticketMaxNum, ticketName, ticketImageURL, ticketDescription, event) => {
  console.log(`TicketInfoPurchased: type ${ticketType}, price ${ticketPrice}, is range ${isTicketRange}, max num ${ticketMaxNum}, name ${ticketName}`);

  // Here you could update your MySQL database. E.g.,
  await updateDatabaseWithTicketInfo(ticketType, ticketPrice, isTicketRange, ticketMaxNum, ticketName);
});


app.listen(PORT, HOST, async () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);

  await createTables();
});
