import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {IDRegistryABI, contractAddress} from './constants';

function EditPage() {
  const [name, setName] = useState('');
  const [entry, setEntry] = useState('');
  const [incentive, setIncentive] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [size_x, setSizeX] = useState('');
  const [size_y, setSizeY] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [stages, setStages] = useState([]);
  const [stage_names, setStageNames] = useState([]);

  const handleAdd = () => {
    setData(prevData => [...prevData, { x, y, size_x, size_y, type }]);
    setX('');
    setY('');
    setSizeX('');
    setSizeY('');
    setType('');
  };

  const handleSaveAllData = async () => {
    if (!provider) {
      console.log("No provider is set");
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, IDRegistryABI, signer);
    const _stageID = Math.floor(Math.random() * 1000000);
  
    // Convert the JSON string from textarea to an array of objects
    const dataStr = JSON.stringify(data);
    const extraDataArr = JSON.parse(dataStr).map(item => [
      Number(item.x),
      Number(item.y),
      Number(item.size_x),
      Number(item.size_y),
      item.type
    ]);
  
    try {
      const tx = await contract.setAllData(_stageID, account, name, Number(entry), Number(incentive), extraDataArr);
      await tx.wait();
      console.log('Data has been saved successfully', { name, data });
    } catch (err) {
      console.error("An error occurred while saving the data", err);
    }
  };
  
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID"
          }
        }
      }
    }
  });

  // Handle connecting to the wallet
  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    setProvider(new ethers.providers.Web3Provider(provider));
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setAccount('');
  };

  // Fetch the wallet address once the provider is available
  useEffect(() => {
    if (provider) {
        provider.listAccounts().then(accounts => setAccount(accounts[0]));
    }
}, [provider]);

  const showStages = async () => {
    if (!provider) {
      console.log("No provider is set");
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, IDRegistryABI, signer);
    console.log(contract)
    try {
      const accountStages = await contract.getAccountStages(account);
      const accountNames = await contract.getAccountNames(account);
      
      console.log('Account stages:', accountStages);
      console.log('Account names:', accountNames);
      setStages(accountStages);
      setStageNames(accountNames);
    } catch (err) {
      console.error("An error occurred while fetching stages", err);
    }
};


  // Connect to the wallet when the Connect button is clicked
  const handleConnectWallet = () => {
    connectWallet();
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ marginRight: "20px" }}>
        <h1>Edit Page</h1>

        <input type="text" value={x} onChange={e => setX(e.target.value)} placeholder="X" />
        <input type="text" value={y} onChange={e => setY(e.target.value)} placeholder="Y" /><br />
        <input type="text" value={size_x} onChange={e => setSizeX(e.target.value)} placeholder="Size X" />
        <input type="text" value={size_y} onChange={e => setSizeY(e.target.value)} placeholder="Size Y" /><br />
        <label htmlFor="type">Type: </label>
          <select id="type" value={type} onChange={handleTypeChange}>
            <option value="">--Please choose an option--</option>
            <option value="obstacle">Obstacle</option>
            <option value="enemy">Enemy_a</option>
            <option value="enemy_b">Enemy_b</option>
            <option value="enemy_boss">Enemy_Boss</option>
            <option value="goal">Goal</option>
            <option value="coin">Coin</option>
            <option value="stone">Stone</option>
          </select>
        
        <button onClick={handleAdd}>Add</button>

        <div style={{ marginTop: "20px" }}>
              {account ? (
            <>
              <button onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
              <p>Connected to: {account}</p>
            </>
          ) : (
            <button onClick={handleConnectWallet}>
              Connect Wallet
            </button>
          )}<br />
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" /><br />
          <input type="text" value={entry} onChange={e => setEntry(e.target.value)} placeholder="Entry" /><br />
          <input type="text" value={incentive} onChange={e => setIncentive(e.target.value)} placeholder="Incentive" /><br />
          <button onClick={handleSaveAllData} disabled={!account}>
            Save
          </button>
          <button onClick={showStages} disabled={!account}>
            Show Stages
          </button>
              {/* Display the stages */}
          <div>
          <h2>Stages:</h2>
            {stages.map((stageId, index) => (
              <p key={stageId.toString()}>
                Stage ID: {stageId.toString()}, Stage Name: {stage_names[index]}
              </p>
            ))}
          </div>
        </div>
      </div>

      <textarea value={JSON.stringify(data, null, 2)} readOnly style={{ height: '600px', width: '400px' }} />
    </div>
  );
}

export default EditPage;
