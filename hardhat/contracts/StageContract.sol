// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.17;

import "./libraries/ExtraDataLib.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title StageContract
 * @dev A contract to manage stages on the Ethereum blockchain using ERC721 tokens.
 */
contract StageContract is ERC721Enumerable {
    // Address that has special privileges to mint stages and perform other admin actions.
    address private _admin;
    address private _entryContractAddress;

    // Mapping from stage ID to its data.
    mapping(uint => ExtraDataLib.StageData) private _stageDataMap;

    // A counter to generate unique IDs for the stages.
    uint256 private _currentStageId = 0;

    /**
     * @dev Initializes the contract by setting the admin and providing names for ERC721 tokens.
     */
    constructor() ERC721("DinoMarkerStage", "DMS") {
        _admin = msg.sender;
    }

    /**
     * @dev Modifier to make a function callable only by the admin.
     */
    modifier onlyAdmin() {
        require(msg.sender == _admin, "Only admin can call this function.");
        _;
    }

    modifier onlyEntryContract() {
        require(msg.sender == _entryContractAddress, "Not the approved caller");
        _;
    }

    /**
     * @dev Mint a new stage and store its data.
     * @param addr Address to mint the stage to.
     * @param name Name of the stage.
     * @param imageURL URL of the image representing the stage.
     * @param description Description of the stage.
     * @param needTicketId ID of the ticket required to access the stage.
     * @param needTicketNum Number of tickets required to access the stage.
     * @param rewardTicketId ID of the ticket rewarded upon completing the stage.
     * @param rewardTicketNum Number of tickets rewarded upon completing the stage.
     * @param extraDataArr Additional data for the stage.
     */
    function mintStage(
        address addr,
        string memory name,
        string memory imageURL,
        string memory description,
        uint256 needTicketId,
        uint256 needTicketNum,
        uint256 rewardTicketId,
        uint256 rewardTicketNum,
        ExtraDataLib.ExtraData[] memory extraDataArr
    ) external onlyEntryContract returns (uint256) {
        _currentStageId++;

        // Minting a new ERC721 token (a stage) to the specified address.
        _mint(addr, _currentStageId);

        // Storing the stage data in the mapping.
        ExtraDataLib.StageData storage stageData = _stageDataMap[
            _currentStageId
        ];
        stageData.name = name;
        stageData.imageURL = imageURL;
        stageData.description = description;
        stageData.needTicketId = needTicketId;
        stageData.needTicketNum = needTicketNum;
        stageData.rewardTicketId = rewardTicketId;
        stageData.rewardTicketNum = rewardTicketNum;

        // Storing extra data in the stage data.
        for (uint i = 0; i < extraDataArr.length; i++) {
            stageData.extraDataArr.push(extraDataArr[i]);
        }

        return _currentStageId;
    }

    /**
     * @dev Retrieve all stage IDs in existence.
     * @return stageIds An array of all stage IDs.
     */
    function getAllStages() external view returns (uint256[] memory stageIds) {
        uint256 totalStages = totalSupply();
        stageIds = new uint256[](totalStages);

        for (uint i = 0; i < totalStages; i++) {
            stageIds[i] = tokenByIndex(i);
        }
    }

    /**
     * @dev Retrieve all stage IDs owned by the caller.
     * @return stageIds An array of stage IDs owned by the caller.
     */
    function getStagesByOwner()
        external
        view
        returns (uint256[] memory stageIds)
    {
        uint256 totalStages = balanceOf(msg.sender);
        stageIds = new uint256[](totalStages);

        for (uint i = 0; i < totalStages; i++) {
            stageIds[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
    }

    /**
     * @dev Retrieve the details of a specific stage.
     * @param stageID The ID of the stage to retrieve details for.
     * @return stageData A `StageData` structure with the details of the stage.
     */
    function getStageDetails(
        uint256 stageID
    ) external view returns (ExtraDataLib.StageData memory stageData) {
        stageData = _stageDataMap[stageID];
    }

    function setEntryContractAddress(address newCaller) external onlyAdmin {
        _entryContractAddress = newCaller;
    }
}
