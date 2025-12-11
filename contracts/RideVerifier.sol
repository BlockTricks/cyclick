// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CyclickToken.sol";

/**
 * @title RideVerifier
 * @dev Contract for verifying rides and distributing rewards
 */
contract RideVerifier is Ownable {
    // Reference to the CyclickToken contract
    CyclickToken public cyclickToken;
    
    // Reward rates (tokens per km)
    uint256 public baseRewardPerKm = 10 * 10**18; // 10 tokens per km
    uint256 public carbonBonusPerKm = 2 * 10**18; // 2 tokens per km for carbon offset
    
    // Minimum ride distance to qualify for rewards (in meters)
    uint256 public minRideDistance = 1000; // 1 km
    
    // Maximum ride distance per ride (in meters) to prevent abuse
    uint256 public maxRideDistance = 100000; // 100 km
    
    // Ride data structure
    struct Ride {
        address rider;
        uint256 distance; // in meters
        uint256 duration; // in seconds
        uint256 timestamp;
        uint256 carbonOffset; // in grams
        bool verified;
        uint256 rewardAmount;
    }
    
    // Mapping of ride ID to Ride
    mapping(bytes32 => Ride) public rides;
    
    // Mapping of rider address to total rides
    mapping(address => uint256) public totalRides;
    
    // Mapping of rider address to total distance (in meters)
    mapping(address => uint256) public totalDistance;
    
    // Mapping of rider address to total rewards earned
    mapping(address => uint256) public totalRewards;
    
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
    
    event RewardRatesUpdated(uint256 baseReward, uint256 carbonBonus);
    event MinMaxDistanceUpdated(uint256 minDistance, uint256 maxDistance);
    
    /**
     * @dev Constructor
     * @param _cyclickToken Address of the CyclickToken contract
     * @param initialOwner Address of the contract owner
     */
    constructor(address _cyclickToken, address initialOwner) Ownable(initialOwner) {
        require(_cyclickToken != address(0), "Invalid token address");
        cyclickToken = CyclickToken(_cyclickToken);
    }
    
    /**
     * @dev Submit a ride for verification
     * @param rideId Unique identifier for the ride
     * @param distance Distance in meters
     * @param duration Duration in seconds
     * @param carbonOffset Carbon offset in grams
     */
    function submitRide(
        bytes32 rideId,
        uint256 distance,
        uint256 duration,
        uint256 carbonOffset
    ) external {
        require(rides[rideId].rider == address(0), "Ride already exists");
        require(distance >= minRideDistance, "Distance too short");
        require(distance <= maxRideDistance, "Distance too long");
        require(duration > 0, "Invalid duration");
        
        rides[rideId] = Ride({
            rider: msg.sender,
            distance: distance,
            duration: duration,
            timestamp: block.timestamp,
            carbonOffset: carbonOffset,
            verified: false,
            rewardAmount: 0
        });
        
        emit RideSubmitted(rideId, msg.sender, distance, duration, carbonOffset);
    }
    
    /**
     * @dev Verify and reward a ride
     * @param rideId Unique identifier for the ride
     */
    function verifyRide(bytes32 rideId) external {
        Ride storage ride = rides[rideId];
        require(ride.rider != address(0), "Ride does not exist");
        require(!ride.verified, "Ride already verified");
        
        // Calculate reward
        uint256 distanceInKm = ride.distance / 1000; // Convert meters to km
        uint256 baseReward = distanceInKm * baseRewardPerKm;
        uint256 carbonReward = distanceInKm * carbonBonusPerKm;
        uint256 totalReward = baseReward + carbonReward;
        
        // Update ride data
        ride.verified = true;
        ride.rewardAmount = totalReward;
        
        // Update rider statistics
        totalRides[ride.rider]++;
        totalDistance[ride.rider] += ride.distance;
        totalRewards[ride.rider] += totalReward;
        
        // Mint tokens to the rider
        cyclickToken.mint(ride.rider, totalReward, "ride_reward");
        
        emit RideVerified(rideId, ride.rider, totalReward);
    }
    
    /**
     * @dev Batch verify multiple rides
     * @param rideIds Array of ride IDs to verify
     */
    function batchVerifyRides(bytes32[] memory rideIds) external {
        for (uint256 i = 0; i < rideIds.length; i++) {
            verifyRide(rideIds[i]);
        }
    }
    
    /**
     * @dev Get ride details
     * @param rideId Unique identifier for the ride
     * @return Ride struct
     */
    function getRide(bytes32 rideId) external view returns (Ride memory) {
        return rides[rideId];
    }
    
    /**
     * @dev Get rider statistics
     * @param rider Address of the rider
     * @return ridesCount Total number of rides
     * @return totalDist Total distance in meters
     * @return totalRew Total rewards earned
     */
    function getRiderStats(address rider) external view returns (
        uint256 ridesCount,
        uint256 totalDist,
        uint256 totalRew
    ) {
        return (totalRides[rider], totalDistance[rider], totalRewards[rider]);
    }
    
    /**
     * @dev Update reward rates (only owner)
     * @param _baseRewardPerKm New base reward per km
     * @param _carbonBonusPerKm New carbon bonus per km
     */
    function updateRewardRates(
        uint256 _baseRewardPerKm,
        uint256 _carbonBonusPerKm
    ) external onlyOwner {
        baseRewardPerKm = _baseRewardPerKm;
        carbonBonusPerKm = _carbonBonusPerKm;
        emit RewardRatesUpdated(_baseRewardPerKm, _carbonBonusPerKm);
    }
    
    /**
     * @dev Update minimum and maximum ride distances (only owner)
     * @param _minDistance New minimum distance in meters
     * @param _maxDistance New maximum distance in meters
     */
    function updateMinMaxDistance(
        uint256 _minDistance,
        uint256 _maxDistance
    ) external onlyOwner {
        require(_minDistance < _maxDistance, "Invalid distance range");
        minRideDistance = _minDistance;
        maxRideDistance = _maxDistance;
        emit MinMaxDistanceUpdated(_minDistance, _maxDistance);
    }
    
    /**
     * @dev Calculate reward for a given distance
     * @param distance Distance in meters
     * @return Total reward amount
     */
    function calculateReward(uint256 distance) external view returns (uint256) {
        if (distance < minRideDistance || distance > maxRideDistance) {
            return 0;
        }
        uint256 distanceInKm = distance / 1000;
        return (distanceInKm * baseRewardPerKm) + (distanceInKm * carbonBonusPerKm);
    }
}

