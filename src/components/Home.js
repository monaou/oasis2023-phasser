// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to dino marker</h1>
            <div className="info-card">
                <p>Supported Chain: <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer">MCH Chain</a></p>
                <p>Payments: <a href="https://usdcfaucet.com/" target="_blank" rel="noopener noreferrer">MCH</a></p>
            </div>

            <div className="feature-cards">
                <div className="feature-card">
                    <Link to="/tasks" className="feature-title-link">
                        <h2>Play</h2>
                    </Link>
                    <p></p>
                </div>

                <div className="feature-card">
                    <Link to="/labeling-reward" className="feature-title-link">
                        <h2>Play Rewards</h2>
                    </Link>
                    <p></p>
                </div>

                <div className="feature-card">
                    <Link to="/you-tasks" className="feature-title-link">
                        <h2>Create</h2>
                    </Link>
                    <p></p>
                </div>

                <div className="feature-card">
                    <Link to="/labeling-nft" className="feature-title-link">
                        <h2>Creater Reward</h2>
                    </Link>
                    <p></p>
                </div>
            </div>
        </div>
    );
}

export default Home;
