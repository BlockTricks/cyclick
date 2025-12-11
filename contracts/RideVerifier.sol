// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CyclickToken.sol";

/**
 * @title RideVerifier
 * @dev Verifies cycling rides and distributes token rewards
 */
contract RideVerifier is Ownable {
    CyclickToken public token;
    
    // Reward rates (tokens per unit)
    uint256 public rewardPerKm = 10 * 10**18; // 10 tokens per km
    uint256 public rewardPerMinute = 1 * 10**18; // 1 token per minute
    uint256 public carbonOffsetMultiplier = 2 * 10**18; // 2x multiplier for carbon offset
    
    // Minimum ride requirements
    uint256 public minDistance = 1; // 1 km minimum
    uint256 public minDuration = 5; // 5 minutes minimum
    
    // Ride data structure
    struct Ride {
        address rider;
        uint256 distance; // in meters (will be converted to km)
        uint256 duration; // in seconds (will be converted to minutes)
        uint256 carbonOffset; // in grams CO2 saved
        uint256 timestamp;
        bool verified;
        uint256 rewardAmount;
    }
    
    // Mapping of ride IDs to rides
    mapping(bytes32 => Ride) public rides;
    
    // Mapping of rider to total rides
    mapping(address => uint256) public totalRides;
    
    // Mapping of rider to total distance
    mapping(address => uint256) public totalDistance;
    
    // Events
    event RideSubmitted(
        bytes32 indexed rideId,
        address indexed rider,
        uint256 distance,
        uint256 duration,
        uint256 carbonOffset
    );
    event RideVerified(
        bytes32 indexed rideId,
        address indexed rider,
        uint256 rewardAmount
    );
    event RideRejected(bytes32 indexed rideId, address indexed rider, string reason);
    event RewardRatesUpdated(
        uint256 rewardPerKm,
        uint256 rewardPerMinute,
        uint256 carbonOffsetMultiplier
    );
    
    /**
     * @dev Constructor
     * @param _token Address of the CyclickToken contract
     * @param initialOwner Address of the contract owner
     */
    constructor(address _token, address initialOwner) Ownable(initialOwner) {
        require(_token != address(0), "Invalid token address");
        token = CyclickToken(_token);
    }
    
    /**
     * @dev Submit a ride for verification
     * @param distance Distance in meters
     * @param duration Duration in seconds
     * @param carbonOffset Carbon offset in grams CO2
     * @param nonce Unique nonce to prevent duplicate submissions
     * @return rideId Unique identifier for the ride
     */
    function submitRide(
        uint256 distance,
        uint256 duration,
        uint256 carbonOffset,
        uint256 nonce
    ) external returns (bytes32) {
        require(distance >= minDistance * 1000, "Distance too short"); // Convert km to meters
        require(duration >= minDuration * 60, "Duration too short"); // Convert minutes to seconds
        
        bytes32 rideId = keccak256(
            abi.encodePacked(msg.sender, distance, duration, carbonOffset, nonce, block.timestamp)
        );
        
        require(rides[rideId].rider == address(0), "Ride already exists");
        
        rides[rideId] = Ride({
            rider: msg.sender,
            distance: distance,
            duration: duration,
            carbonOffset: carbonOffset,
            timestamp: block.timestamp,
            verified: false,
            rewardAmount: 0
        });
        
        emit RideSubmitted(rideId, msg.sender, distance, duration, carbonOffset);
        
        // Auto-verify and reward (in production, you might want manual verification)
        _verifyRide(rideId);
        
        return rideId;
    }
    
    /**
     * @dev Verify a ride and calculate rewards
     * @param rideId Unique identifier for the ride
     */
    function _verifyRide(bytes32 rideId) internal {
        Ride storage ride = rides[rideId];
        require(ride.rider != address(0), "Ride does not exist");
        require(!ride.verified, "Ride already verified");
        
        // Calculate reward
        uint256 distanceKm = ride.distance / 1000; // Convert meters to km
        uint256 durationMin = ride.duration / 60; // Convert seconds to minutes
        
        uint256 distanceReward = distanceKm * rewardPerKm;
        uint256 durationReward = durationMin * rewardPerMinute;
        uint256 carbonReward = (ride.carbonOffset / 1000) * carbonOffsetMultiplier; // Convert grams to kg
        
        uint256 totalReward = distanceReward + durationReward + carbonReward;
        
        ride.verified = true;
        ride.rewardAmount = totalReward;
        
        // Update rider statistics
        totalRides[ride.rider]++;
        totalDistance[ride.rider] += ride.distance;
        
        // Mint tokens to rider
        token.mint(ride.rider, totalReward, "ride_reward");
        
        emit RideVerified(rideId, ride.rider, totalReward);
    }
    
    /**
     * @dev Manually verify a ride (owner only)
     * @param rideId Unique identifier for the ride
     */
    function verifyRide(bytes32 rideId) external onlyOwner {
        Ride storage ride = rides[rideId];
        require(ride.rider != address(0), "Ride does not exist");
        require(!ride.verified, "Ride already verified");
        
        _verifyRide(rideId);
    }
    
    /**
     * @dev Reject a ride (owner only)
     * @param rideId Unique identifier for the ride
     * @param reason Reason for rejection
     */
    function rejectRide(bytes32 rideId, string memory reason) external onlyOwner {
        Ride storage ride = rides[rideId];
        require(ride.rider != address(0), "Ride does not exist");
        require(!ride.verified, "Ride already verified");
        
        emit RideRejected(rideId, ride.rider, reason);
    }
    
    /**
     * @dev Update reward rates (owner only)
     * @param _rewardPerKm New reward per km
     * @param _rewardPerMinute New reward per minute
     * @param _carbonOffsetMultiplier New carbon offset multiplier
     */
    function updateRewardRates(
        uint256 _rewardPerKm,
        uint256 _rewardPerMinute,
        uint256 _carbonOffsetMultiplier
    ) external onlyOwner {
        rewardPerKm = _rewardPerKm;
        rewardPerMinute = _rewardPerMinute;
        carbonOffsetMultiplier = _carbonOffsetMultiplier;
        
        emit RewardRatesUpdated(_rewardPerKm, _rewardPerMinute, _carbonOffsetMultiplier);
    }
    
    /**
     * @dev Update minimum ride requirements (owner only)
     * @param _minDistance Minimum distance in km
     * @param _minDuration Minimum duration in minutes
     */
    function updateMinimumRequirements(
        uint256 _minDistance,
        uint256 _minDuration
    ) external onlyOwner {
        minDistance = _minDistance;
        minDuration = _minDuration;
    }
    
    /**
     * @dev Get ride details
     * @param rideId Unique identifier for the ride
     * @return ride Ride struct
     */
    function getRide(bytes32 rideId) external view returns (Ride memory) {
        return rides[rideId];
    }
    
    /**
     * @dev Get rider statistics
     * @param rider Address of the rider
     * @return ridesCount Total number of rides
     * @return totalDist Total distance in meters
     */
    function getRiderStats(address rider) external view returns (uint256 ridesCount, uint256 totalDist) {
        return (totalRides[rider], totalDistance[rider]);
    }
}

