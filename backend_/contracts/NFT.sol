// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract NFT is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    uint public nonce = 0;
    uint public maxSupply;
    uint public mintPrice;
    uint private publicSaleBalance;
    string public baseURI;
    

    constructor(string memory name, string memory symbol, uint _maxSupply, string memory _baseURI_, uint _mintPrice)
        ERC721(name, symbol)
    {
        maxSupply = _maxSupply;
        baseURI = _baseURI_;
        mintPrice = _mintPrice;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public onlyOwner {
        require(nonce < maxSupply, "max supply exceeded");
        nonce++;
        _safeMint(to, nonce);
    }

    function publicMint() public payable {
        require(nonce < maxSupply, "max supply exceeded");
        require(msg.value >= mintPrice, "Not enough fee");
        nonce++;
        _safeMint(msg.sender, nonce);
        publicSaleBalance+=msg.value;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
        publicSaleBalance = 0;
    }

    function getPublicMintBalance() external view onlyOwner returns (uint){
        return publicSaleBalance;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
