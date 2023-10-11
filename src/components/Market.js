import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "./Market.css"
import TicketPlatform from "../shared_json/TicketPlatform.json";
import { ERC20_ABI } from '../shared_json/Erc20_abi';
import currency from '../shared_json/currency.json';

function Market({ address, provider }) {
    const [ticketInfos, setTicketInfos] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);  // Add this state
    const [errorMessage, setErrorMessage] = useState(null);
    const contract = new ethers.Contract(TicketPlatform.address, TicketPlatform.abi, provider);

    useEffect(() => {
        const fetchTicketInfos = async () => {
            try {
                const fetchedTicketInfos = await contract.getDetails();
                // Mapping with additional user-specific ticket data
                const enrichedTicketInfos = await Promise.all(
                    fetchedTicketInfos.map(async (info) => {
                        const userTicket = await contract.getUserTicket(address, info.ticketType);
                        return {
                            maxNum: !info.isTicketRange ? "∞" : info.ticketMaxNum.toString(),
                            price: ethers.utils.formatEther(info.ticketPrice),
                            type: info.ticketType.toString(),
                            name: info.ticketName,
                            imageURL: info.ticketImageURL,
                            description: info.ticketDescription,
                            userOwned: userTicket.ticketNum.toString()  // Adding user-owned count
                        };
                    })
                );
                setTicketInfos(enrichedTicketInfos);
            } catch (error) {
                console.error("Error fetching ticket data: ", error);
                setErrorMessage("Failed to load ticket information. Please try again later.");
            }
        }

        fetchTicketInfos();
    }, [contract, address]);

    const handleMint = async (type, quantity, price) => {
        const { ethereum } = window;

        if (!ethereum) {
            console.error("No web3 provider detected");
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const incentiveValue = (Number(price * quantity) * 1000000000000).toString();
        const oasContract = new ethers.Contract(currency.sandverse, ERC20_ABI, signer);  // NOTE: ERC20トークンのABIにはapproveメソッドが含まれている必要があります
        try {
            const tx = await oasContract.approve(TicketPlatform.address, ethers.utils.parseUnits(incentiveValue, 6));  // USDCは小数点以下6桁なので、6を指定
            await tx.wait();
            console.log("Allowance set successfully");
        } catch (err) {
            console.error("An error occurred while setting the allowance", err);
        }

        const pay_contract = new ethers.Contract(TicketPlatform.address, TicketPlatform.abi, signer);
        try {
            const tx = await pay_contract.purchaseTicket(type, quantity);
            await tx.wait();
            console.log('Successfully minted NFT!');
        } catch (error) {
            console.error("Error minting NFT: ", error);
        }
    }


    const adjustQuantity = (adjustment) => {
        // Ensure the quantity does not go below 1 or above the maxNum
        setSelectedQuantity(selectedQuantity + adjustment)
    }

    return (
        <div className="home-container">
            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}
            {ticketInfos.map((ticket, index) => (
                <div className="card" key={index}>
                    <h2 className="card-title">{ticket.name}</h2>
                    <div>
                        <img src={ticket.imageURL} alt={ticket.name} />
                    </div>
                    <div>
                        <strong>Max Number:</strong> {ticket.maxNum}
                    </div>
                    <div>
                        <strong>Price:</strong> {ticket.price} MTK
                    </div>
                    <div>
                        <strong>Description:</strong> {ticket.description}
                    </div>
                    <div>
                        <strong>You own:</strong> {ticket.userOwned} {/* Displaying user-owned count */}
                    </div>
                    <div>
                        <strong>Quantity:</strong>
                        <button onClick={() => adjustQuantity(-1)}>-</button>
                        <input value={selectedQuantity}
                            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                        />
                        <button onClick={() => adjustQuantity(1)}>+</button>
                    </div>
                    <button onClick={() => handleMint(ticket.type, selectedQuantity, ticket.price)}>Pay Item</button>
                </div>
            ))}
        </div>
    );
}

export default Market;
