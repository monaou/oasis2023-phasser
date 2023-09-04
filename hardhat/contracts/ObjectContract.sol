// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ObjectContract is ERC721Enumerable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address private owner;
    uint256 private price;
    string private description;
    string private url;
    uint256 private maxTotalSupply;
    address private acceptedTokenAddress; // ERC20 token address for payments

    constructor(
        uint256 _price,
        string memory _description,
        string memory _url,
        uint256 _maxTotalSupply,
        address _acceptedTokenAddress
    ) ERC721("ObjectContract", "MNFT") {
        owner = msg.sender;
        price = _price;
        description = _description;
        url = _url;
        maxTotalSupply = _maxTotalSupply;
        acceptedTokenAddress = _acceptedTokenAddress;
    }

    function mintNFT() external nonReentrant {
        require(totalSupply() < maxTotalSupply, "All tokens minted");

        // First, we ensure the payment
        IERC20 token = IERC20(acceptedTokenAddress);
        require(
            token.transferFrom(msg.sender, owner, price),
            "Transfer of ERC20 failed"
        );

        // If payment is successful, then we mint the NFT
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);
    }

    function getDetails()
        external
        view
        returns (uint256, string memory, string memory, uint256, address)
    {
        return (price, description, url, maxTotalSupply, acceptedTokenAddress);
    }
}
