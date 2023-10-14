require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { updateDatabase, updateDatabaseWithTicketInfo, createTables } = require('./databaseSQL');


// HOST と PORT を定義するか、または sharedResources.js からインポート
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';
const CLIENT_POST = process.env.CLIENT_POST || 1234;

const corsOptions = {
  origin: `http://${CLIENT_HOST}:${CLIENT_POST}`,  // クライアントのオリジン
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();

// Here we add the bodyParser middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

const createStageHandler = require('./components/createStage');
const startGameHandler = require('./components/startGame');
const recordGameHandler = require('./components/recordGame');
const clearGameHandler = require('./components/clearGame');
const failedGameHandler = require('./components/failedGame');

app.post('/create-stage', createStageHandler);
app.post('/start-game', startGameHandler);
app.post('/record-game', recordGameHandler);
app.post('/clear-game', clearGameHandler);
app.post('/failed-game', failedGameHandler);

app.listen(CLIENT_POST, CLIENT_HOST, async () => {
  console.log(`Server is running on http://${CLIENT_HOST}:${CLIENT_POST}`);

  await createTables();
});

// const contractTicketPlatform = new ethers.Contract(TicketPlatform.address, TicketPlatform.abi, provider);

// contractTicketPlatform.on("TicketPurchased", async (user, ticketType, ticketNum, event) => {
//   console.log(`TicketPurchased purchased by ${user} of type ${ticketType} and num ${ticketNum}`);

//   // Here you could update your MySQL database. E.g.,
//   await updateDatabase(user, ticketType, ticketNum);
// });

// contractTicketPlatform.on("TicketInfoPurchased", async (ticketType, ticketPrice, isTicketRange, ticketMaxNum, ticketName, ticketImageURL, ticketDescription, event) => {
//   console.log(`TicketInfoPurchased: type ${ticketType}, price ${ticketPrice}, is range ${isTicketRange}, max num ${ticketMaxNum}, name ${ticketName}`);

//   // Here you could update your MySQL database. E.g.,
//   await updateDatabaseWithTicketInfo(ticketType, ticketPrice, isTicketRange, ticketMaxNum, ticketName);
// });
