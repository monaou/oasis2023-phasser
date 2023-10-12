// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.17;

library ExtraDataLib {
    struct ExtraData {
        uint x;
        uint y;
        string _type;
    }

    struct StageData {
        string name;
        string imageURL;
        string description;
        uint256 needTicketId;
        uint256 needTicketNum;
        uint256 rewardTicketId;
        uint256 rewardTicketNum;
        ExtraData[] extraDataArr;
    }
}
