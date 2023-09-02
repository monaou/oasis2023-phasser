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

            <div className="updates-section">
                <h2>Updates</h2>
                <p>Latest news and updates about our game.</p>
                {/* 他のアップデートの詳細もこちらに */}
            </div>

            <div className="game-features-section">
                <h2>Game Features</h2>
                <p>Discover unique features of our game.</p>
                {/* ゲームの特徴に関する他の詳細もこちらに */}
            </div>

            <div className="feature-cards">

                <div className="feature-card">
                    <Link to="/tasks" className="feature-title-link">
                        <h2>Play</h2>
                    </Link>
                    <p>Jump into the game and experience the thrill of Dino Marker!</p>
                </div>

                <div className="feature-card">
                    <Link to="/labeling-reward" className="feature-title-link">
                        <h2>Player Rewards</h2>
                    </Link>
                    <p>Earn rewards by playing and achieving milestones in the game.</p>
                </div>

                <div className="feature-card">
                    <Link to="/you-tasks" className="feature-title-link">
                        <h2>Create</h2>
                    </Link>
                    <p>Let your creativity shine by designing your own levels and challenges.</p>
                </div>

                <div className="feature-card">
                    <Link to="/labeling-nft" className="feature-title-link">
                        <h2>Creater Reward</h2>
                    </Link>
                    <p>Get rewarded for your amazing game designs and contributions.</p>
                </div>

            </div>

            <div className="partners-section">
                <h2>Our Partners</h2>
                <p>We're proud to be partnered with...</p>
                {/* パートナーに関する他の詳細もこちらに */}
            </div>

        </div>
    );
}

export default Home;
