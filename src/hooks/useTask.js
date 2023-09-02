// useNFTs.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import stageContract from '../shared_json/StageContract.json';
import { mode } from "./../constants/modeConstants";

export const useTasks = (address, mode_arg) => {
    const [nfts, setNFTs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const { ethereum } = window;

        if (!ethereum) {
            console.error("No web3 provider detected");
        }

        // Create a new instance of the web3 provider
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        if (!address) {
            setNFTs([]);
            setLoading(false);
            return;
        }

        const fetchNFTs = async () => {
            try {
                const contract = new ethers.Contract(stageContract.address, stageContract.abi, signer);
                let tokenIds = [];

                switch (mode_arg) {
                    case mode.ALL:
                        tokenIds = await contract.getAllStages();
                        break;

                    // case mode.REWARD:
                    //     tokenIds = await contract.getVotedAndEndedNFTs(signer.getAddress());
                    //     break;

                    // case mode.TASK:
                    //     tokenIds = await contract.getTokensByOwner();
                    //     break;

                    case mode.NFT:
                        tokenIds = await contract.getStagesByOwner();
                        break;
                }

                const fetchedNFTs = [];
                for (let tokenId of tokenIds) {
                    const tokenURI = await contract.getStageDetails(tokenId);

                    fetchedNFTs.push({
                        id: tokenId.toNumber(),
                        owner: tokenURI[0],
                        name: tokenURI[1],
                        entryFee: (tokenURI[2] / 1000000).toString(), // 画像のURIも追加
                        incentive: (tokenURI[3] / 1000000).toString(),
                        extraDataArr: tokenURI[4],
                    });
                }

                if (isMounted) {
                    setNFTs(fetchedNFTs);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching NFTs:", error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchNFTs();

        return () => {
            isMounted = false;
        };
    }, [address, mode_arg]);

    return [nfts, loading];
};
