import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "./Market.css"
import ObjectContract from "../shared_json/ObjectContract.json";
import { ERC20_ABI } from '../shared_json/Erc20_abi';
import currency from '../shared_json/currency.json';

function Market({ address, provider }) {
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [maxTotalSupply, setMaxTotalSupply] = useState(0);

    const contract = new ethers.Contract(ObjectContract.address, ObjectContract.abi, provider);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedPrice, fetchedDescription, fetchedUrl, fetchedMaxTotalSupply] = await contract.getDetails();

                setPrice((fetchedPrice / 1000000).toString());
                setDescription(fetchedDescription);
                setUrl("https://ipfs.io/ipfs/" + fetchedUrl);
                setMaxTotalSupply(fetchedMaxTotalSupply);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

        fetchData();
    }, []);

    const handleMint = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.error("No web3 provider detected");
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const incentiveValue = (Number(price) * 1000000).toString();
        const oasContract = new ethers.Contract(currency.sandverse, ERC20_ABI, signer);  // NOTE: ERC20トークンのABIにはapproveメソッドが含まれている必要があります
        try {
            const tx = await oasContract.approve(ObjectContract.address, ethers.utils.parseUnits(incentiveValue, 6));  // USDCは小数点以下6桁なので、6を指定
            await tx.wait();
            console.log("Allowance set successfully");
        } catch (err) {
            console.error("An error occurred while setting the allowance", err);
        }

        const pay_contract = new ethers.Contract(ObjectContract.address, ObjectContract.abi, signer);
        try {
            const tx = await pay_contract.mintNFT();
            await tx.wait();
            console.log('Successfully minted NFT!');
        } catch (error) {
            console.error("Error minting NFT: ", error);
        }
    }

    return (
        <div className="home-container">
            <div className="card">
                <h2 className="card-title">First Collaboration!! tomooneNFT.<br />*This is a hack demo.</h2>
                <img src={url} alt="NFT" onError={(e) => console.error("Image loading error:", e)} style={{ width: '60%', marginBottom: '10px' }} />
                <div>
                    <strong>Description:</strong> {description}
                </div>
                <div>
                    <strong>Price:</strong> {price} MTK
                </div>
                <button onClick={handleMint}>Pay and Mint NFT</button>
            </div>
        </div>
    );
}

export default Market;
