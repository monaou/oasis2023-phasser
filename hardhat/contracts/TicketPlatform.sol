// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.17;

import "./libraries/TicketPlatformLib.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TicketPlatform is ReentrancyGuard {
    using TicketPlatformLib for TicketPlatformLib.TicketInfo;

    address private _admin;
    IERC20 private _token;
    uint256 private _currentTicketId = 0;

    mapping(address => mapping(uint256 => uint256)) private _userTickets;
    mapping(address => mapping(uint256 => uint256)) private _usedTickets;
    mapping(uint256 => TicketPlatformLib.TicketInfo) private _ticketInfos;

    event TicketPurchased(
        address indexed user,
        uint256 ticketType,
        uint256 ticketNum
    );

    event TicketInfoAdded(
        uint256 ticketId,
        string ticketName,
        string ticketImageURL,
        string ticketDescription,
        uint256 ticketType,
        uint256 ticketPrice,
        uint256 ticketMaxNum,
        bool isTicketRange
    );

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Not the admin");
        _;
    }

    constructor(address tokenAddress) {
        _admin = msg.sender;
        _token = IERC20(tokenAddress);
    }

    function setTicketPrice(
        string memory ticketName,
        string memory ticketImageURL,
        string memory ticketDescription,
        uint256 ticketType,
        uint256 ticketPrice,
        uint256 ticketMaxNum,
        bool isTicketRange
    ) external onlyAdmin {
        _currentTicketId++;
        TicketPlatformLib.TicketInfo memory newTicketInfo = TicketPlatformLib
            .TicketInfo({
                ticketName: ticketName,
                ticketImageURL: ticketImageURL,
                ticketDescription: ticketDescription,
                ticketType: ticketType,
                ticketPrice: ticketPrice,
                ticketMaxNum: ticketMaxNum,
                isTicketRange: isTicketRange
            });
        _ticketInfos[_currentTicketId] = newTicketInfo;

        emit TicketInfoAdded(
            _currentTicketId,
            ticketName,
            ticketImageURL,
            ticketDescription,
            ticketType,
            ticketPrice,
            ticketMaxNum,
            isTicketRange
        );
    }

    function purchaseTicket(
        uint256 buyTicketId,
        uint256 buyTicketNum
    ) external nonReentrant {
        require(buyTicketId <= _currentTicketId, "Invalid ticket type");
        TicketPlatformLib.TicketInfo memory ticketInfo = _ticketInfos[
            buyTicketId
        ];

        if (ticketInfo.isTicketRange) {
            uint256 userTicket = getUserTicket(msg.sender, buyTicketId);
            require(
                userTicket + buyTicketNum <= ticketInfo.ticketMaxNum,
                "Exceeding max number of tickets"
            );
        }

        uint256 totalCost = ticketInfo.ticketPrice * buyTicketNum;
        require(
            _token.transferFrom(msg.sender, address(this), totalCost),
            "Transfer failed"
        );

        _userTickets[msg.sender][buyTicketId] += buyTicketNum;

        emit TicketPurchased(msg.sender, buyTicketId, buyTicketNum);
    }

    function burnTicket(
        address addr,
        uint256 burnTicketId,
        uint256 burnTicketNum
    ) external onlyAdmin returns (bool) {
        require(burnTicketId <= _currentTicketId, "Invalid ticket type");

        uint256 userTicketNum = getUserTicket(addr, burnTicketId);
        uint256 usedTicketNum = getUsedTicket(addr, burnTicketId);
        require(
            userTicketNum >= usedTicketNum + burnTicketNum,
            "Already used max number of tickets"
        );

        setUsedTicket(addr, burnTicketId, usedTicketNum + burnTicketNum);
        return true;
    }

    function getUserTicket(
        address addr,
        uint256 ticketId
    ) public view returns (uint256) {
        return _userTickets[addr][ticketId];
    }

    function getUsedTicket(
        address addr,
        uint256 ticketId
    ) public view returns (uint256) {
        return _usedTickets[addr][ticketId];
    }

    function setUsedTicket(
        address addr,
        uint256 ticketId,
        uint256 ticketNum
    ) internal onlyAdmin {
        _usedTickets[addr][ticketId] += ticketNum;
    }

    function getDetails()
        external
        view
        returns (TicketPlatformLib.TicketInfo[] memory)
    {
        TicketPlatformLib.TicketInfo[]
            memory ticketsArray = new TicketPlatformLib.TicketInfo[](
                _currentTicketId
            );

        for (uint256 i = 1; i <= _currentTicketId; i++) {
            ticketsArray[i - 1] = _ticketInfos[i];
        }

        return ticketsArray;
    }
}
