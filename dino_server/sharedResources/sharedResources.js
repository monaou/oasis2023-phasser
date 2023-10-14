// sharedResources.js
const ethers = require('ethers');

// あなたのプライベートキーとプロバイダのURLを設定します
const privateKey = process.env.PRIVATE_KEY;
const providerUrl = 'https://rpc.sandverse.oasys.games';

// ウォレットとプロバイダを作成します
const wallet = new ethers.Wallet(privateKey);
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const connectedWallet = wallet.connect(provider);

const RewardPool = require('../../src/shared_json/RewardPool.json');
const Stage = require('../../src/shared_json/StageContract.json');
const TicketPlatform = require('../../src/shared_json/TicketPlatform.json');

// スマートコントラクトのアドレスとABIを設定します
const RewardPoolInterface = new ethers.utils.Interface(RewardPool.abi);
const StageInterface = new ethers.utils.Interface(Stage.abi);
const TicketPlatformInterface = new ethers.utils.Interface(TicketPlatform.abi);

// コントラクトインスタンスを作成します
const RewardPoolContract = new ethers.Contract(RewardPool.address, RewardPool.abi, connectedWallet);
const StageContract = new ethers.Contract(Stage.address, Stage.abi, connectedWallet);
const TicketPlatformContract = new ethers.Contract(TicketPlatform.address, TicketPlatform.abi, connectedWallet);

// Memory storage for game instance IDs and start flags
module.exports = {
    ethers,
    wallet,
    provider,
    connectedWallet,
    RewardPoolInterface,
    StageInterface,
    TicketPlatformInterface,
    RewardPoolContract,
    StageContract,
    TicketPlatformContract
};
