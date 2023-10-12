// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.17;

import "./StageContract.sol";
import "./TicketPlatform.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RewardPool is ReentrancyGuard {
    using ExtraDataLib for ExtraDataLib.ExtraData;
    using ExtraDataLib for ExtraDataLib.StageData;
    using TicketPlatformLib for TicketPlatformLib.TicketInfo;

    // Contract that manages stages
    StageContract private _stageContract;
    // Contract managing tickets
    TicketPlatform private _ticketContract;

    // Admin address which has special permissions
    address private _admin;
    // Stablecoin used in the platform (assumed)
    IERC20 private _token;
    // Percentage of fee taken by the platform
    uint256 private _feePercentage = 5;

    // Stores rewards yet to be claimed per stage
    mapping(uint256 => uint256) private _pendingRewards;
    // Rewards to be distributed for stage clearance, mapped by address
    mapping(address => uint256) private _ditributeStageRewards;
    // Rewards to be distributed for clear actions, mapped by address
    mapping(address => uint256) private _ditributeClearRewards;

    // Possible states of a game instance
    enum GameState {
        NotStarted,
        Started,
        Cleared,
        Failed
    }
    // Max instance ID per stage to manage concurrent games
    mapping(uint256 => uint256) private _maxGameInstanceId;
    // Keeps track of the state of each game instance
    mapping(uint256 => mapping(uint256 => GameState)) private _gameStates;

    // Modifier to restrict function access to admin only
    modifier onlyAdmin() {
        require(msg.sender == _admin, "Only admin can call this function.");
        _;
    }
    // Event emitted when entry fee is staked
    event StakeEntreeFeeEvent(
        ExtraDataLib.ExtraData[] extraDataArr,
        uint256 gameInstanceId
    );

    // Constructor initializes contract addresses and admin
    constructor(
        address stageContractAddress,
        address ticketContractAddress,
        address tokenAddress
    ) {
        _admin = msg.sender;
        _stageContract = StageContract(stageContractAddress);
        _ticketContract = TicketPlatform(ticketContractAddress);
        _token = IERC20(tokenAddress);
    }

    // Function to stake rewards for a stage, callable by admin
    function stakeReward(
        address userAddress,
        uint256 stageId
    ) external onlyAdmin nonReentrant {
        require(
            _stageContract.ownerOf(stageId) == userAddress,
            "Not the owner"
        );
        ExtraDataLib.StageData memory stageData = _stageContract
            .getStageDetails(stageId);
        TicketPlatformLib.TicketInfo[] memory ticketInfo = _ticketContract
            .getDetails();

        uint256 incentive = ticketInfo[stageData.rewardTicketId].ticketPrice *
            stageData.rewardTicketNum;

        uint256 fee = (incentive * _feePercentage) / 100;
        uint256 stakingAmount = incentive - fee;

        require(
            _token.transferFrom(address(_ticketContract), _admin, fee),
            "OAS transfer failed in stakeReward"
        );
        require(
            _token.transferFrom(
                address(_ticketContract),
                address(this),
                stakingAmount
            ),
            "OAS transfer failed in stakeReward"
        );

        _maxGameInstanceId[stageId] = 0;
        _pendingRewards[stageId] += stakingAmount;
    }

    // Function to stake entry fee for participating, callable by admin
    function stakeEntreeFee(
        address userAddress,
        uint256 stageId
    ) external onlyAdmin nonReentrant {
        ExtraDataLib.StageData memory stageData = _stageContract
            .getStageDetails(stageId);
        TicketPlatformLib.TicketInfo[] memory ticketInfo = _ticketContract
            .getDetails();
        uint256 entryFee = ticketInfo[stageData.needTicketId].ticketPrice *
            stageData.needTicketNum;

        uint256 fee = (entryFee * _feePercentage) / 100;
        uint256 stakingAmount = entryFee - fee;
        uint256 createrAmount = stakingAmount / 2;
        uint256 stageAmount = stakingAmount - createrAmount;

        require(
            _token.transferFrom(address(_ticketContract), _admin, fee),
            "OAS transfer failed in stakeEntreeFee"
        );
        require(
            _token.transferFrom(
                address(_ticketContract),
                _stageContract.ownerOf(stageId),
                createrAmount
            ),
            "OAS transfer failed in stakeEntreeFee"
        );
        require(
            _token.transferFrom(
                address(_ticketContract),
                address(this),
                stageAmount
            ),
            "OAS transfer failed in stakeEntreeFee"
        );

        uint256 currentGameInstanceId = _maxGameInstanceId[stageId];
        _gameStates[stageId][currentGameInstanceId] = GameState.Started;
        _maxGameInstanceId[stageId]++;

        _ditributeStageRewards[userAddress] += createrAmount;
        _pendingRewards[stageId] += stageAmount;

        emit StakeEntreeFeeEvent(stageData.extraDataArr, currentGameInstanceId);
    }

    // Function to set a game instance as cleared, callable by admin
    function setStageClear(
        uint256 stageId,
        uint256 gameInstanceId
    ) external onlyAdmin {
        require(
            _gameStates[stageId][gameInstanceId] == GameState.Started,
            "Game is not in a valid state to clear"
        );
        _gameStates[stageId][gameInstanceId] = GameState.Cleared;

        _ditributeClearRewards[msg.sender] = _pendingRewards[stageId];
        _pendingRewards[stageId] = 0;
    }

    // Function to set a game instance as failed, callable by admin
    function setStageFailed(
        uint256 stageId,
        uint256 gameInstanceId
    ) external onlyAdmin {
        require(
            _gameStates[stageId][gameInstanceId] == GameState.Started,
            "Game is not in a valid state to clear"
        );
        _gameStates[stageId][gameInstanceId] = GameState.Failed;
    }

    // Function for users to claim rewards after a clear
    function claimClearReward() external nonReentrant {
        uint256 rewardAmount = _ditributeClearRewards[msg.sender];
        require(rewardAmount > 0, "No reward available");

        _ditributeClearRewards[msg.sender] = 0;

        require(
            _token.transfer(msg.sender, rewardAmount),
            "OAS transfer failed in claimClearReward"
        );
    }

    // Function for users to claim rewards for a stage
    function claimStageReward() external nonReentrant {
        uint256 rewardAmount = _ditributeStageRewards[msg.sender];
        require(rewardAmount > 0, "No reward available");

        _ditributeStageRewards[msg.sender] = 0;

        require(
            _token.transfer(msg.sender, rewardAmount),
            "OAS transfer failed in claimStageReward"
        );
    }
}
