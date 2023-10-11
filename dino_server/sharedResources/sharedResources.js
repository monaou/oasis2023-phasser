// sharedResources.js

const ethers = require('ethers');
const RewardPool = require('../../src/shared_json/RewardPool.json');
const TicketPlatform = require('../../src/shared_json/TicketPlatform.json');

// あなたのプライベートキーとプロバイダのURLを設定します
const privateKey = process.env.PRIVATE_KEY;
const providerUrl = 'https://rpc.sandverse.oasys.games';

// ウォレットとプロバイダを作成します
const wallet = new ethers.Wallet(privateKey);
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const connectedWallet = wallet.connect(provider);

// スマートコントラクトのアドレスとABIを設定します
const contractAddress = RewardPool.address;
const abi = RewardPool.abi;
const contractInterface = new ethers.utils.Interface(abi);

// コントラクトインスタンスを作成します
const contract = new ethers.Contract(contractAddress, abi, connectedWallet);

// Memory storage for game instance IDs and start flags
gameInstanceFlags = []
module.exports = {
    ethers,
    contractInterface,
    wallet,
    provider,
    connectedWallet,
    contractAddress,
    abi,
    contract,
    gameInstanceFlags,
    TicketPlatform,
};
