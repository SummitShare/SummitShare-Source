// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TicketPurchaseContract is ERC721Enumerable, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

     address public controller;

    function initializeController(address _controller) external {
        require(controller == address(0), "Controller already set");
        controller = _controller;
    }

    address public usdt;
    address public usdc;


    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _eventNames;
    mapping(string => uint256) private _eventPrices;

    event TicketPurchased(address indexed buyer, uint256 indexed tokenId, string eventName);
    event TransactionStatus(uint256 status, address indexed buyer, uint256 indexed tokenId);
    event TransactionFailed(address indexed buyer, string reason);

    constructor(address _usdt, address _usdc, address _controller) ERC721("EventTicket", "ETKT")  {
        usdt = _usdt;
        usdc = _usdc;
        controller = _controller;
    }

    modifier onlyController() {
        require(msg.sender == controller, "Only the controller can call this function.");
        _;
    }

     function uintToString(uint256 value) internal pure returns (string memory) {
    if (value == 0) {
        return "0";
    }
    uint256 tempValue = value;
    uint256 digits;
    while (tempValue != 0) {
        digits++;
        tempValue /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
        value /= 10;
    }
    return string(buffer);
}

    function setEventPrice(string memory eventName, uint256 price) public onlyOwner {
        _eventPrices[eventName] = price;
    }

    function getEventPrice(string memory eventName) public view returns (uint256) {
        return _eventPrices[eventName];
    }

    function fetchEventDetails(uint256 tokenId) public view returns (string memory fetchedEventName, string memory fetchedTokenURI, uint256 fetchedEventPrice) {
    fetchedEventName = _eventNames[tokenId];
    fetchedTokenURI = _tokenURIs[tokenId];
    fetchedEventPrice = _eventPrices[fetchedEventName];
    return (fetchedEventName, fetchedTokenURI, fetchedEventPrice);
}

    function purchaseTicket(string memory eventName, address token) public payable nonReentrant onlyController returns (uint256) {
        uint256 eventPrice = getEventPrice(eventName);
        require(token == usdt || token == usdc, "Invalid token");
        IERC20 paymentToken = IERC20(token);

        require(
            paymentToken.transferFrom(msg.sender, address(this), eventPrice),
            "Token transfer failed"
        );

        if (msg.value != eventPrice) {
            emit TransactionFailed(msg.sender, "Incorrect payment amount");
            return 0;  // Zero means failure in this context
        }

       

        uint256 tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId);
        _tokenIdCounter.increment();

        _tokenURIs[tokenId] = string(abi.encodePacked("https://example.com/", uintToString(tokenId)));
        _eventNames[tokenId] = eventName;

        emit TicketPurchased(msg.sender, tokenId, eventName);
        emit TransactionStatus(200, msg.sender, tokenId);  // Success

        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getEventName(uint256 tokenId) public view returns (string memory) {
        return _eventNames[tokenId];
    }
}
