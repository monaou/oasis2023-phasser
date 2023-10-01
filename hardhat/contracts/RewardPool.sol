// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./StageContract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardPool {
    using ExtraDataLib for ExtraDataLib.ExtraData;
    address private owner;
    IERC20 public oasToken;
    mapping(uint256 => uint256) public pendingRewards;
    mapping(address => uint256) public ditributeStageRewards;
    mapping(address => uint256) public ditributeClearRewards;
    StageContract public stageContract;
    address public admin;
    uint256 public feePercentage = 5;

    enum GameState {
        NotStarted,
        Started,
        Cleared,
        Failed
    }
    mapping(uint256 => uint256) private gameInstanceMaxId;
    mapping(uint256 => mapping(uint256 => GameState)) private gameStates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function.");
        _;
    }
    // Event definition
    event StakeEntreeFeeEvent(
        ExtraDataLib.ExtraData[] extraDataArr,
        uint256 gameInstanceId
    );

    constructor(
        address _nftContractAddress,
        address _adminAddress,
        address _oasAddress
    ) {
        owner = msg.sender;
        stageContract = StageContract(_nftContractAddress);
        admin = _adminAddress;
        oasToken = IERC20(_oasAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function stakeReward(
        string memory _name,
        uint _entryFee,
        uint _incentive,
        ExtraDataLib.ExtraData[] memory _extraDataArr
    ) external {
        uint256 tokenId = stageContract.mintStage(
            msg.sender,
            _name,
            _entryFee,
            _incentive,
            _extraDataArr
        );

        require(stageContract.ownerOf(tokenId) == msg.sender, "Not the owner");

        uint256 fee = (_incentive * feePercentage) / 100;
        uint256 stakingAmount = _incentive - fee;

        // Transfer OAS for the fee to the admin
        require(
            oasToken.transferFrom(msg.sender, admin, fee),
            "OAS transfer failed in stakeReward"
        );
        // Transfer stakingAmount to this contract
        require(
            oasToken.transferFrom(msg.sender, address(this), stakingAmount),
            "OAS transfer failed in stakeReward"
        );

        gameInstanceMaxId[tokenId] = 0;
        pendingRewards[tokenId] += stakingAmount;
    }

    function stakeEntreeFee(uint256 tokenId) external onlyAdmin {
        (
            address addr,
            string memory name,
            uint entryFee,
            uint incentive,
            ExtraDataLib.ExtraData[] memory extraDataArr
        ) = stageContract.getStageDetails(tokenId);

        uint256 fee = (entryFee * feePercentage) / 100;
        uint256 stakingAmount = (entryFee - fee);
        uint256 createrAmount = (stakingAmount) / 2;
        uint256 stageAmount = (stakingAmount) - createrAmount;

        // Transfer OAS for the fee to the admin
        require(
            oasToken.transferFrom(msg.sender, admin, fee),
            "OAS transfer failed in stakeEntreeFee"
        );
        // Transfer OAS for the fee to the admin
        require(
            oasToken.transferFrom(msg.sender, addr, createrAmount),
            "OAS transfer failed in stakeEntreeFee"
        );
        // Transfer stakingAmount to this contract
        require(
            oasToken.transferFrom(msg.sender, address(this), stageAmount),
            "OAS transfer failed in stakeEntreeFee"
        );

        // Generating a unique game instance ID
        uint256 currentId = gameInstanceMaxId[tokenId];
        gameStates[tokenId][currentId] = GameState.Started;
        gameInstanceMaxId[tokenId]++;

        ditributeStageRewards[addr] += createrAmount;
        pendingRewards[tokenId] += stageAmount;

        emit StakeEntreeFeeEvent(extraDataArr, currentId);
    }

    function setStageClear(
        uint256 tokenId,
        uint256 gameInstanceId
    ) external onlyAdmin {
        require(
            gameStates[tokenId][gameInstanceId] == GameState.Started,
            "Game is not in a valid state to clear"
        );
        gameStates[tokenId][gameInstanceId] = GameState.Cleared;

        ditributeClearRewards[msg.sender] = pendingRewards[tokenId];
        pendingRewards[tokenId] = 0;
    }

    function setStageFailed(
        uint256 tokenId,
        uint256 gameInstanceId
    ) external onlyAdmin {
        require(
            gameStates[tokenId][gameInstanceId] == GameState.Started,
            "Game is not in a valid state to clear"
        );
        gameStates[tokenId][gameInstanceId] = GameState.Failed;
    }

    function claimClearReward() external {
        uint256 rewardAmount = ditributeClearRewards[msg.sender];
        require(rewardAmount > 0, "No reward available");

        // Prevent double claiming by resetting the reward for this tokenId for this user.
        ditributeClearRewards[msg.sender] = 0;

        // Instead of using Ether's transfer, use OAS's transfer method to send the reward.
        require(
            oasToken.transfer(msg.sender, rewardAmount),
            "OAS transfer failed in claimClearReward"
        );
    }

    function claimStageReward() external {
        uint256 rewardAmount = ditributeStageRewards[msg.sender];
        require(rewardAmount > 0, "No reward available");

        // Prevent double claiming by resetting the reward for this tokenId for this user.
        ditributeStageRewards[msg.sender] = 0;

        // Instead of using Ether's transfer, use OAS's transfer method to send the reward.
        require(
            oasToken.transfer(msg.sender, rewardAmount),
            "OAS transfer failed in claimStageReward"
        );
    }
}
