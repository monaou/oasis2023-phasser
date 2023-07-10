import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

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

  const handleAdd = () => {
    setData(prevData => [...prevData, { x, y, size_x, size_y, type }]);
    setX('');
    setY('');
    setSizeX('');
    setSizeY('');
    setType('');
  };

  const handleSave = () => {
    // TODO: Add your logic to call the contract function with name and data as arguments
    console.log('Save', { name, data });
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
      provider.listAccounts().then(setAccount);
    }
  }, [provider]);

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
            <option value="enemy">Enemy</option>
            <option value="goal">Goal</option>
            <option value="coin">Coin</option>
            <option value="block">Block</option>
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
          <button onClick={handleSave} disabled={!account}>
            Save
          </button>
        </div>
      </div>

      <textarea value={JSON.stringify(data, null, 2)} readOnly style={{ height: '600px', width: '400px' }} />
    </div>
  );
}

export default EditPage;
