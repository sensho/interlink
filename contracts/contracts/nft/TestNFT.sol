// contracts/nft/TestNFT.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../coordinator/AugmintCoordinator.sol";

/// @title Test NFT contract.
/// @author SaratAngajala.
/// @notice ERC-721 implementation to test the cross-chain protocol.
contract TestNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private constant PRICE = 0.1 ether;
    address private COORDINATOR_ADDRESS;
    address private RECIEVER_ADDRESS;

    mapping(uint256 => address) private pendingRequests;

    constructor(address coordinatorAddress) ERC721("TestNFT", "TNFT") {
        COORDINATOR_ADDRESS = coordinatorAddress;
        RECIEVER_ADDRESS = msg.sender;
    }

    function purchaseWithNative() external payable {
        require(msg.value == PRICE, "Price is 0.1 ether");

        address reciever = msg.sender;

        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();

        _mint(reciever, tokenId);
    }

    function purchaseWithExternal(uint256 chainId) external returns (uint256 requestId) {
        address reciever = msg.sender;

        requestId = AugmintCoordinator(COORDINATOR_ADDRESS).initiateNativePaymentRequest(
            chainId, 
            RECIEVER_ADDRESS, 
            PRICE + (PRICE * 10 / 100), 
            address(this), 
            "fulfill(uint256,bool,bytes)"
        );

        pendingRequests[requestId] = reciever;
    }

    function fulfill(uint256 requestId, bool isSuccess, bytes calldata response) external {
        require(isSuccess, string(response));

        address reciever = pendingRequests[requestId];

        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();

        _mint(reciever, tokenId); 
    }
}
