// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.17;

library TicketPlatformLib {
    struct TicketInfo {
        string ticketName; // A human-readable name for this ticket type.
        string ticketImageURL; // A image url for this ticket type.
        string ticketDescription; // A ticket description for this ticket type.
        uint256 ticketType; // 0 is for creaters, 1 is for players.
        uint256 ticketPrice; // Price per ticket of this type.
        uint256 ticketMaxNum; // Maximum number of these tickets that can be bought per user (if isTicketRange is true).
        bool isTicketRange; // Indicates whether there is a restricted range/limit for purchasing this ticket type.
    }
}
