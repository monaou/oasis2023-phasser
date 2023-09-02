import React, { useState } from "react";
import { ethers } from 'ethers';
import StageSelect from './components/StageSelect'
import PlayerRewad from './components/PlayerRewad'
import CrateStage from './components/CrateStage'
import CreaterReward from './components/CreaterReward'
import Home from './components/Home'

import { connectMetaMask, disconnectMetaMask } from "./components/wallet";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// CSSをインポート
import './App.css';

function App() {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [warning, setWarning] = useState(null);


  const handleConnectWallet = async () => {
    try {
      if (provider) {
        const connectedAddress = await connectMetaMask(provider);
        setAddress(connectedAddress.address);
        setChainId(connectedAddress.chainId);

        if (connectedAddress.chainId !== 20197) {
          setWarning("Warning: Please switch to Sand Verse (Chain ID: 20197).");
        } else {
          setWarning(null);
        }
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await disconnectMetaMask(provider);
      setAddress(null);
      setChainId(null);
      setWarning(null);
    } catch (error) {
      console.error("Error disconnecting from MetaMask:", error);
    }
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>
            dino marker
          </h1>
          <div className="wallet-info">
            {address
              ? <>
                <span>Address: {`${address.slice(0, 4)}...${address.slice(-4)}`}</span>
                <span>Chain: {chainId}</span>
                <button onClick={handleDisconnectWallet}>Disconnect</button>
              </>
              : <button onClick={handleConnectWallet}>Connect Wallet</button>
            }
          </div>
        </header>
        {warning && <div className="warning-message">{warning}</div>}
        <nav className="navbar">
          <Link className="nav-button" to="/">Home</Link>
          <Link className="nav-button" to="/play">Play</Link>
          <Link className="nav-button" to="/player-reward">Player Rewards</Link>
          <Link className="nav-button" to="/create">Create</Link>
          <Link className="nav-button" to="/creater-reward">Creater Rewards</Link>
        </nav>
        {/* address={address} provider={provider} */}
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/play"><StageSelect address={address} provider={provider} /></Route>
          <Route path="/player-reward"><PlayerRewad address={address} provider={provider} /></Route>
          <Route path="/create"><CrateStage address={address} provider={provider} /></Route>
          <Route path="/creater-reward"><CreaterReward address={address} provider={provider} /></Route>
        </Switch>
      </div>
      <div className="footer">
        <Link className="footer-link" to="/discord">Discord</Link>
        <Link className="footer-link" to="/document">Document</Link>
        <span className="footer-copyright">&copy; 2023 dino marker</span>
      </div>

    </Router>
  );
}

export default App;
