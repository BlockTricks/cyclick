// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RideVerifier.sol";

/**
 * @title NFTBadges
 * @dev NFT contract for minting achievement badges for cyclists
 */
contract NFTBadges is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    // Reference to the RideVerifier contract
    RideVerifier public rideVerifier;
    
    // Counter for token IDs
    Counters.Counter private _tokenIdCounter;
    
    // Badge types
    enum BadgeType {
        FIRST_RIDE,        // First ride completed
        DISTANCE_100KM,    // 100 km total distance
        DISTANCE_500KM,    // 500 km total distance
        DISTANCE_1000KM,   // 1000 km total distance
        DISTANCE_5000KM,   // 5000 km total distance
        RIDES_10,          // 10 rides completed
        RIDES_50,          // 50 rides completed
        RIDES_100,         // 100 rides completed
        CARBON_HERO        // Special carbon offset achievement
    }
    
    // Mapping of badge type to milestone value
    mapping(BadgeType => uint256) public badgeMilestones;
    
    // Mapping of user to badge type to whether they've earned it
    mapping(address => mapping(BadgeType => bool)) public earnedBadges;
    
    // Mapping of token ID to badge type
    mapping(uint256 => BadgeType) public tokenBadgeType;
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    // Events
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        BadgeType badgeType
    );
    
    event RideVerifierUpdated(address indexed oldVerifier, address indexed newVerifier);
    event BaseURIUpdated(string newBaseURI);
    
    /**
     * @dev Constructor
     * @param _rideVerifier Address of the RideVerifier contract
     * @param initialOwner Address of the contract owner
     */
    constructor(
        address _rideVerifier,
        address initialOwner
    ) ERC721("Cyclick Badges", "CYCB") Ownable(initialOwner) {
        require(_rideVerifier != address(0), "Invalid verifier address");
        rideVerifier = RideVerifier(_rideVerifier);
        
        // Set milestone values
        badgeMilestones[BadgeType.DISTANCE_100KM] = 100000; // 100 km in meters
        badgeMilestones[BadgeType.DISTANCE_500KM] = 500000; // 500 km in meters
        badgeMilestones[BadgeType.DISTANCE_1000KM] = 1000000; // 1000 km in meters
        badgeMilestones[BadgeType.DISTANCE_5000KM] = 5000000; // 5000 km in meters
        badgeMilestones[BadgeType.RIDES_10] = 10;
        badgeMilestones[BadgeType.RIDES_50] = 50;
        badgeMilestones[BadgeType.RIDES_100] = 100;
    }
    
    /**
     * @dev Check and mint eligible badges for a rider
     * @param rider Address of the rider
     */
    function checkAndMintBadges(address rider) external {
        require(msg.sender == address(rideVerifier) || msg.sender == owner(), "Unauthorized");
        
        (uint256 ridesCount, uint256 totalDist, ) = rideVerifier.getRiderStats(rider);
        
        // Check distance-based badges
        _checkAndMint(rider, BadgeType.DISTANCE_100KM, totalDist);
        _checkAndMint(rider, BadgeType.DISTANCE_500KM, totalDist);
        _checkAndMint(rider, BadgeType.DISTANCE_1000KM, totalDist);
        _checkAndMint(rider, BadgeType.DISTANCE_5000KM, totalDist);
        
        // Check ride count badges
        _checkAndMint(rider, BadgeType.RIDES_10, ridesCount);
        _checkAndMint(rider, BadgeType.RIDES_50, ridesCount);
        _checkAndMint(rider, BadgeType.RIDES_100, ridesCount);
        
        // Check first ride badge
        if (ridesCount >= 1 && !earnedBadges[rider][BadgeType.FIRST_RIDE]) {
            _mintBadge(rider, BadgeType.FIRST_RIDE);
        }
    }
    
    /**
     * @dev Internal function to check milestone and mint badge
     */
    function _checkAndMint(
        address rider,
        BadgeType badgeType,
        uint256 currentValue
    ) internal {
        if (
            currentValue >= badgeMilestones[badgeType] &&
            !earnedBadges[rider][badgeType]
        ) {
            _mintBadge(rider, badgeType);
        }
    }
    
    /**
     * @dev Internal function to mint a badge
     */
    function _mintBadge(address to, BadgeType badgeType) internal {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        tokenBadgeType[tokenId] = badgeType;
        earnedBadges[to][badgeType] = true;
        
        // Set token URI based on badge type
        string memory tokenURI = string(
            abi.encodePacked(_baseTokenURI, _badgeTypeToString(badgeType), ".json")
        );
        _setTokenURI(tokenId, tokenURI);
        
        emit BadgeMinted(to, tokenId, badgeType);
    }
    
    /**
     * @dev Set the RideVerifier contract address
     * @param _rideVerifier Address of the RideVerifier contract
     */
    function setRideVerifier(address _rideVerifier) external onlyOwner {
        require(_rideVerifier != address(0), "Invalid address");
        address oldVerifier = address(rideVerifier);
        rideVerifier = RideVerifier(_rideVerifier);
        emit RideVerifierUpdated(oldVerifier, _rideVerifier);
    }
    
    /**
     * @dev Set the base URI for token metadata
     * @param baseURI Base URI string
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }
    
    /**
     * @dev Get badge type name as string
     */
    function _badgeTypeToString(BadgeType badgeType) internal pure returns (string memory) {
        if (badgeType == BadgeType.FIRST_RIDE) return "first-ride";
        if (badgeType == BadgeType.DISTANCE_100KM) return "distance-100km";
        if (badgeType == BadgeType.DISTANCE_500KM) return "distance-500km";
        if (badgeType == BadgeType.DISTANCE_1000KM) return "distance-1000km";
        if (badgeType == BadgeType.DISTANCE_5000KM) return "distance-5000km";
        if (badgeType == BadgeType.RIDES_10) return "rides-10";
        if (badgeType == BadgeType.RIDES_50) return "rides-50";
        if (badgeType == BadgeType.RIDES_100) return "rides-100";
        if (badgeType == BadgeType.CARBON_HERO) return "carbon-hero";
        return "unknown";
    }
    
    /**
     * @dev Get all badges owned by an address
     * @param owner Address of the owner
     * @return Array of token IDs
     */
    function getOwnerBadges(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory badges = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (_ownerOf(i) == owner) {
                badges[index] = i;
                index++;
            }
        }
        
        return badges;
    }
    
    /**
     * @dev Override base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}

