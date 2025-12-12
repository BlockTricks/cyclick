// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CyclickToken
 * @dev ERC-20 token for rewarding cyclists on the Cyclick platform
 */
contract CyclickToken is ERC20, ERC20Burnable, Ownable {
    // Maximum supply of tokens
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    // Address of the RideVerifier contract that can mint tokens
    address public rideVerifier;
    
    // Events
    event RideVerifierUpdated(address indexed oldVerifier, address indexed newVerifier);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    /**
     * @dev Constructor that mints initial supply to the deployer
     */
    constructor(address initialOwner) ERC20("Cyclick Token", "CYC") Ownable(initialOwner) {
        // Mint 10% of max supply to the owner for initial distribution
        uint256 initialSupply = (MAX_SUPPLY * 10) / 100;
        _mint(initialOwner, initialSupply);
    }
    
    /**
     * @dev Set the RideVerifier contract address
     * @param _rideVerifier Address of the RideVerifier contract
     */
    function setRideVerifier(address _rideVerifier) external onlyOwner {
        require(_rideVerifier != address(0), "Invalid address");
        address oldVerifier = rideVerifier;
        rideVerifier = _rideVerifier;
        emit RideVerifierUpdated(oldVerifier, _rideVerifier);
    }
    
    /**
     * @dev Mint tokens to a user (only callable by RideVerifier)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (e.g., "ride_reward", "challenge_prize")
     */
    function mint(address to, uint256 amount, string memory reason) external {
        require(msg.sender == rideVerifier, "Only RideVerifier can mint");
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Batch mint tokens to multiple users
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to mint
     * @param reason Reason for minting
     */
    function batchMint(
        address[] memory recipients,
        uint256[] memory amounts,
        string memory reason
    ) external {
        require(msg.sender == rideVerifier, "Only RideVerifier can mint");
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i], reason);
        }
    }
}




