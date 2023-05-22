// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    event Minted(TokenItem tokenData);

    Counters.Counter private _tokenIdCounter;

    uint8 public MAX_SUPPLY = 100;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    struct TokenItem {
        uint id;
        address owner;
        string uri;
    }

    function safeMint(address to, string memory uri) public {
        require(totalSupply() < MAX_SUPPLY, "Maximum Supply Limit Reached");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit Minted(TokenItem(tokenId, msg.sender, uri));
    }

    function getAllTokenData() public view returns (TokenItem[] memory) {
        uint totalSupplyOfTokens = totalSupply();
        TokenItem[] memory tokenUrls = new TokenItem[](totalSupplyOfTokens);
        for (uint i = 0; i < totalSupplyOfTokens; i++) {
            tokenUrls[i] = TokenItem(i, ownerOf(i), tokenURI(i));
        }
        return tokenUrls;
    }

    function increaseMaxSupply(uint8 n) external onlyOwner {
        MAX_SUPPLY += n;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
