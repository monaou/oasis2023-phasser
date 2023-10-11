// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TicketPlatform
 * @dev A contract to facilitate ticket sales and management on the Ethereum blockchain.
 *
 * Tickets can be purchased using a specified ERC20 token. Each type of ticket is represented with a unique `ticketType`.
 * Ticket purchasing information and available ticket types with their respective details are emitted as events.
 */
contract TicketPlatform {
    // Represents a purchased ticket.
    struct Ticket {
        uint256 ticketNum; // Number of tickets purchased by a user of a specific type.
        uint256 ticketType; // Represents the type/ID of the ticket.
    }

    // Represents information about a particular type of ticket available for purchase.
    struct TicketInfo {
        uint256 ticketMaxNum; // Maximum number of these tickets that can be bought per user (if isTicketRange is true).
        uint256 ticketPrice; // Price per ticket of this type.
        bool isTicketRange; // Indicates whether there is a restricted range/limit for purchasing this ticket type.
        uint256 ticketType; // An ID to uniquely identify this type of ticket.
        string ticketName; // A human-readable name for this ticket type.
        string ticketImageURL; // A image url for this ticket type.
        string ticketDescription; // A ticket description for this ticket type.
    }

    // Admin is the address with permissions to set ticket details.
    address private admin;

    // The ERC20 token used for purchasing tickets.
    IERC20 private token;

    // A nested mapping from user addresses to ticket types to Tickets.
    // Keeps track of how many tickets of each type each user has purchased.
    mapping(address => mapping(uint256 => Ticket)) private userTickets;

    // An array to store info for each type of ticket available for purchase.
    TicketInfo[] public ticketInfos;

    // Emitted when a user purchases a ticket.
    event TicketPurchased(
        address indexed user,
        uint256 ticketType,
        uint256 ticketNum
    );

    // Emitted when new ticket info/type is added.
    event TicketInfoPurchased(
        uint256 ticketType,
        uint256 ticketPrice,
        bool isTicketRange,
        uint256 ticketMaxNum,
        string ticketName,
        string ticketImageURL,
        string ticketDescription
    );

    // Ensures only the admin can call a function.
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    /**
     * @dev Sets the admin to the account that deploys the contract and specifies the ERC20 token to use for purchases.
     * @param _tokenAddress The address of the ERC20 token contract.
     */
    constructor(address _tokenAddress) {
        admin = msg.sender;
        token = IERC20(_tokenAddress);
    }

    /**
     * @dev Adds a new type of ticket available for purchase.
     * @param _ticketMaxNum Maximum number of this type of tickets that can be bought per user.
     * @param _ticketPrice Price per ticket for this type.
     * @param _isTicketRange Whether there is a purchase limit for this type of ticket.
     * @param _ticketName A name for this type of ticket.
     * @param _ticketImageURL A image url for this ticket type.
     * @param _ticketDescription A ticket description of this ticket.
     *
     * Emits a {TicketInfoPurchased} event.
     */
    function setTicketPrice(
        uint256 _ticketMaxNum,
        uint256 _ticketPrice,
        bool _isTicketRange,
        string memory _ticketName,
        string memory _ticketImageURL,
        string memory _ticketDescription
    ) external onlyAdmin {
        uint256 newTicketType = ticketInfos.length; // Using length as a new unique ID
        TicketInfo memory newTicketInfo = TicketInfo({
            ticketMaxNum: _ticketMaxNum,
            ticketPrice: _ticketPrice,
            isTicketRange: _isTicketRange,
            ticketType: newTicketType,
            ticketName: _ticketName,
            ticketImageURL: _ticketImageURL,
            ticketDescription: _ticketDescription
        });
        ticketInfos.push(newTicketInfo);
        emit TicketInfoPurchased(
            newTicketType,
            _ticketPrice,
            _isTicketRange,
            _ticketMaxNum,
            _ticketName,
            _ticketImageURL,
            _ticketDescription
        );
    }

    /**
     * @dev Allows a user to purchase a specific type and number of tickets.
     * @param _buyTicketType The ID/type of ticket the user wants to purchase.
     * @param _buyTicketNum The number of tickets the user wants to purchase.
     *
     * Requirements:
     * - `_buyTicketType` must be a valid ticket type.
     * - If `isTicketRange` is true, user must not exceed the maximum number of tickets allowed.
     * - User must have sufficient tokens to pay for tickets.
     *
     * Emits a {TicketPurchased} event.
     */
    function purchaseTicket(
        uint256 _buyTicketType,
        uint256 _buyTicketNum
    ) external {
        require(_buyTicketType < ticketInfos.length, "Invalid ticket type");

        TicketInfo memory ticketInfo = ticketInfos[_buyTicketType];

        // Check total tickets if it's range restricted
        if (ticketInfo.isTicketRange) {
            Ticket memory userTicket = getUserTicket(
                msg.sender,
                _buyTicketType
            );
            require(
                userTicket.ticketNum + _buyTicketNum <= ticketInfo.ticketMaxNum,
                "Exceeding max number of tickets"
            );
        }

        // Transfer tokens
        uint256 totalCost = ticketInfo.ticketPrice * _buyTicketNum;
        require(
            token.transferFrom(msg.sender, address(this), totalCost),
            "Transfer failed"
        );

        // Update or add ticket
        Ticket storage userTicketToUpdate = userTickets[msg.sender][
            _buyTicketType
        ];
        userTicketToUpdate.ticketType = _buyTicketType;
        userTicketToUpdate.ticketNum += _buyTicketNum;

        emit TicketPurchased(msg.sender, _buyTicketType, _buyTicketNum);
    }

    /**
     * @dev Returns the ticket data for a specific user and ticket type.
     * @param userAddress The address of the user to retrieve ticket data for.
     * @param _ticketType The type/ID of ticket to retrieve data for.
     * @return The Ticket struct for the specified user and ticket type.
     */
    function getUserTicket(
        address userAddress,
        uint256 _ticketType
    ) public view returns (Ticket memory) {
        return userTickets[userAddress][_ticketType];
    }

    /**
     * @dev Returns all available ticket types and their details.
     * @return An array of TicketInfo structs, each representing a different ticket type.
     */
    function getDetails() external view returns (TicketInfo[] memory) {
        return ticketInfos;
    }
}
