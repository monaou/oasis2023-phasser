// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.17;

import "./libraries/ExtraDataLib.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract StageContract is ERC721Enumerable {
    using ExtraDataLib for ExtraDataLib.ExtraData;

    struct Data {
        address addr;
        string name;
        uint entryFee;
        uint incentive;
        ExtraDataLib.ExtraData[] extraDataArr;
    }

    mapping(uint => Data) public dataMap;
    uint private _currentTokenId = 0;

    constructor() ERC721("DinoMarkerStage", "DMS") {}

    function mintStage(
        address to,
        address _addr,
        string memory _name,
        uint _entryFee,
        uint _incentive,
        ExtraDataLib.ExtraData[] memory _extraDataArr
    ) public returns (uint) {
        _currentTokenId++;
        _mint(to, _currentTokenId);

        Data storage data = dataMap[_currentTokenId];
        data.addr = _addr;
        data.name = _name;
        data.entryFee = _entryFee;
        data.incentive = _incentive;

        for (uint i = 0; i < _extraDataArr.length; i++) {
            data.extraDataArr.push(_extraDataArr[i]);
        }

        return _currentTokenId;
    }

    function getAllStages() public view returns (uint[] memory) {
        uint totalStages = totalSupply();

        uint[] memory stageIds = new uint[](totalStages);

        for (uint i = 0; i < totalStages; i++) {
            stageIds[i] = tokenByIndex(i);
        }

        return stageIds;
    }

    function getStagesByOwner() public view returns (uint[] memory) {
        uint totalStages = balanceOf(msg.sender);

        uint[] memory stageIds = new uint[](totalStages);

        for (uint i = 0; i < totalStages; i++) {
            stageIds[i] = tokenOfOwnerByIndex(msg.sender, i);
        }

        return stageIds;
    }

    function getStageDetails(
        uint _stageID
    )
        public
        view
        returns (
            address,
            string memory,
            uint,
            uint,
            ExtraDataLib.ExtraData[] memory
        )
    {
        Data storage data = dataMap[_stageID];
        return (
            data.addr,
            data.name,
            data.entryFee,
            data.incentive,
            data.extraDataArr
        );
    }
}
