// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CyclickToken.sol";

/**
 * @title CarbonCredits
 * @dev Marketplace for trading carbon credits earned from cycling
 */
contract CarbonCredits is Ownable {
    // Reference to the CyclickToken contract
    CyclickToken public cyclickToken;
    
    // Carbon credit structure
    struct CarbonCredit {
        address owner;
        uint256 amount; // in grams
        uint256 price; // in tokens per gram
        bool forSale;
        uint256 timestamp;
    }
    
    // Mapping of credit ID to CarbonCredit
    mapping(bytes32 => CarbonCredit) public credits;
    
    // Mapping of owner to their credit IDs
    mapping(address => bytes32[]) public ownerCredits;
    
    // Total carbon credits in the system (in grams)
    uint256 public totalCarbonCredits;
    
    // Conversion rate: tokens per gram of carbon offset
    uint256 public conversionRate = 1 * 10**18; // 1 token per gram
    
    // Events
    event CarbonCreditCreated(
        bytes32 indexed creditId,
        address indexed owner,
        uint256 amount
    );
    
    event CarbonCreditListed(
        bytes32 indexed creditId,
        address indexed owner,
        uint256 price
    );
    
    event CarbonCreditPurchased(
        bytes32 indexed creditId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 price
    );
    
    event CarbonCreditDonated(
        bytes32 indexed creditId,
        address indexed donor,
        uint256 amount
    );
    
    event ConversionRateUpdated(uint256 newRate);
    
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
     * @dev Convert tokens to carbon credits
     * @param amount Amount of tokens to convert
     * @return creditId Unique identifier for the carbon credit
     */
    function convertToCarbonCredit(uint256 amount) external returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        
        // Calculate carbon credits (grams)
        uint256 carbonAmount = (amount * 10**18) / conversionRate;
        
        // Burn tokens
        cyclickToken.transferFrom(msg.sender, address(this), amount);
        cyclickToken.burn(amount);
        
        // Create carbon credit
        bytes32 creditId = keccak256(
            abi.encodePacked(msg.sender, block.timestamp, block.number, amount)
        );
        
        credits[creditId] = CarbonCredit({
            owner: msg.sender,
            amount: carbonAmount,
            price: 0,
            forSale: false,
            timestamp: block.timestamp
        });
        
        ownerCredits[msg.sender].push(creditId);
        totalCarbonCredits += carbonAmount;
        
        emit CarbonCreditCreated(creditId, msg.sender, carbonAmount);
        
        return creditId;
    }
    
    /**
     * @dev List a carbon credit for sale
     * @param creditId Unique identifier for the carbon credit
     * @param price Price in tokens per gram
     */
    function listForSale(bytes32 creditId, uint256 price) external {
        CarbonCredit storage credit = credits[creditId];
        require(credit.owner == msg.sender, "Not the owner");
        require(credit.amount > 0, "Credit does not exist");
        require(!credit.forSale, "Already for sale");
        require(price > 0, "Invalid price");
        
        credit.price = price;
        credit.forSale = true;
        
        emit CarbonCreditListed(creditId, msg.sender, price);
    }
    
    /**
     * @dev Purchase a carbon credit
     * @param creditId Unique identifier for the carbon credit
     */
    function purchaseCarbonCredit(bytes32 creditId) external {
        CarbonCredit storage credit = credits[creditId];
        require(credit.forSale, "Not for sale");
        require(credit.owner != msg.sender, "Cannot buy your own credit");
        
        uint256 totalPrice = (credit.amount * credit.price) / 10**18;
        
        // Transfer tokens from buyer to seller
        cyclickToken.transferFrom(msg.sender, credit.owner, totalPrice);
        
        // Transfer ownership
        address previousOwner = credit.owner;
        credit.owner = msg.sender;
        credit.forSale = false;
        credit.price = 0;
        
        // Update owner credits
        ownerCredits[msg.sender].push(creditId);
        
        emit CarbonCreditPurchased(
            creditId,
            msg.sender,
            previousOwner,
            credit.amount,
            totalPrice
        );
    }
    
    /**
     * @dev Donate a carbon credit (removes it from circulation)
     * @param creditId Unique identifier for the carbon credit
     */
    function donateCarbonCredit(bytes32 creditId) external {
        CarbonCredit storage credit = credits[creditId];
        require(credit.owner == msg.sender, "Not the owner");
        require(credit.amount > 0, "Credit does not exist");
        
        uint256 amount = credit.amount;
        totalCarbonCredits -= amount;
        
        // Remove credit
        delete credits[creditId];
        
        emit CarbonCreditDonated(creditId, msg.sender, amount);
    }
    
    /**
     * @dev Get carbon credit details
     * @param creditId Unique identifier for the carbon credit
     * @return CarbonCredit struct
     */
    function getCarbonCredit(bytes32 creditId) external view returns (CarbonCredit memory) {
        return credits[creditId];
    }
    
    /**
     * @dev Get all credits owned by an address
     * @param owner Address of the owner
     * @return Array of credit IDs
     */
    function getOwnerCredits(address owner) external view returns (bytes32[] memory) {
        return ownerCredits[owner];
    }
    
    /**
     * @dev Update conversion rate (only owner)
     * @param _conversionRate New conversion rate (tokens per gram)
     */
    function updateConversionRate(uint256 _conversionRate) external onlyOwner {
        require(_conversionRate > 0, "Invalid rate");
        conversionRate = _conversionRate;
        emit ConversionRateUpdated(_conversionRate);
    }
}




