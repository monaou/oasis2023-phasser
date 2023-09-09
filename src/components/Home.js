// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <div className="info-card">
                <h2>dino marker demo</h2>
                <p>Supported Chain: <a href="https://scan.sandverse.oasys.games/" target="_blank" rel="noopener noreferrer">Sand Verse(chainId : 20197)</a></p>
                <p>Payments: <a href="https://docs.oasys.games/docs/verse-developer/handle-token/1-1-vft#deploy-the-smart-contract-using-remix-ide" target="_blank" rel="noopener noreferrer">
                    MTK(addres : 0xB0514D3292720365d178af5b46952b04cFF06345)</a>
                </p>
            </div>

            <div className="updates-section">
                <h2>Updates (9/4)</h2>
                <p>・Add home, reward, market pages and layout</p>
                <p>・Add payment contract</p>
                <p>・fix stage select</p>
                {/* 他のアップデートの詳細もこちらに */}
            </div>

            <div className="game-features-section">
                <h2>Game Features</h2>
                <p>・Decentralized Game Economy For Users</p>
                <p>・Utilize Creater and Other Chain NFTs</p>
                <p>・Web3 Technology and Scalability</p>
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
