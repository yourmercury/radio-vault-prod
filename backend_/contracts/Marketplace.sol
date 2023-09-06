// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    // Variables
    address payable public feeAccount; // the account that receives fees
    address private owner;
    uint256 public feePercent = 5; // the fee percentage on sales
    uint256 public itemCount;
    uint256 public itemSold;
    uint256 public totalSales;
    uint256 public gain;
    uint256 public bids;
    bool isListingPaused;
    bool isPurchasePaused;

    mapping(address => bool) admins;

    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        uint256 totalPrice;
        address payable seller;
        address payable buyer;
        bool sold;
        bool listed;
        uint256 bid;
        address payable bidder;
    }

    // itemId -> Item
    mapping(uint256 => Item) public items;

    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );
    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
    event New_Bid(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        uint256 bid,
        address indexed seller,
        address indexed bidder
    );

    modifier listingPaused() {
        require(!isListingPaused, "Listing is paused");
        _;
    }

    modifier purchasePaused() {
        require(!isPurchasePaused, "Purchase is paused");
        _;
    }

    constructor(address _owner, address[] memory _admins) {
        owner = _owner;
        feeAccount = payable(msg.sender);
        for (uint256 i = 0; i < _admins.length; i++) {
            admins[_admins[i]] = true;
        }
    }

    receive() external payable {}

    // Make item to offer on the marketplace
    function listItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant listingPaused {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            (_price * (100 + feePercent)) / 100,
            payable(msg.sender),
            payable(0x0),
            false,
            true,
            0,
            payable(0x0)
        );
        // emit Offered event
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    // @test arg=20 should return {seller: address}
    function purchaseItem(uint256 _itemId)
        external
        payable
        nonReentrant
        purchasePaused
    {
        uint256 _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(
            msg.value >= _totalPrice,
            "not enough ether to cover item price and market fee"
        );
        require(!item.sold, "item already sold");


        if(item.bidder != address(0x0)){
            item.bidder.transfer(item.bid);
            bids-=item.bid;
        }


        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        item.listed = false;
        item.bid = 0;
        item.bidder = payable(0x0);
        item.buyer = payable(msg.sender);
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        itemSold++;

        totalSales += _totalPrice;
        gain += (_totalPrice - item.price);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }

    // Function to remove an Item from the List
    function unListItem(uint256 _itemId) public nonReentrant {
        Item storage item = items[_itemId];
        require(msg.sender == item.seller, "Only seller can unlist Item");
        require(item.listed == true && !item.sold, "Item is not listed");
        items[_itemId].listed = false;
        IERC721 nft = item.nft;
        nft.transferFrom(address(this), item.seller, item.tokenId);
    }

    /// @notice Function to Make, Honor and remove a bid


    
    function placeBid(uint256 _itemId) public payable nonReentrant {
        Item storage item = items[_itemId];
        require(msg.value > 0, "fee not be zero");
        require(item.listed, "Item is not listed");
        require(msg.sender != item.seller, "Seller cannot make bid");
        require(msg.value > item.bid, "Less than present bid");

        if(item.bidder != item.bidder && item.bidder != address(0x0)){
            item.bidder.transfer(item.bid);
            bids-=item.bid;
        }

        item.bid = msg.value;
        item.bidder = payable(msg.sender);
        payable(address(this)).transfer(msg.value);
        bids += msg.value;

        emit New_Bid(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.bid,
            item.seller,
            item.bidder
        );
    }

    function honorBid(uint256 _itemId) external nonReentrant {
        Item storage item = items[_itemId];
        require(msg.sender == item.seller, "Only seller can honor a bid");
        require(item.listed == true && !item.sold, "Item is not listed");
        require(item.bid > 0, "No bid found");
        require(item.bidder != payable(0x0), "Must be a non-zero address");

        item.seller.transfer(item.bid - ((item.bid * feePercent) / 100));
        feeAccount.transfer((item.bid * feePercent) / 100);
        item.sold = true;
        item.listed = false;
        item.bid = 0;
        item.buyer = item.bidder;
        item.bidder = payable(0x0);
        itemSold++;

        totalSales += item.bid;
        gain += (item.bid - ((item.bid * feePercent) / 100));
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event

        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.bid,
            item.seller,
            item.bidder
        );
    }


    /// @notice Users should not be able to remove a bid. Bids can only be replaced by a higher bidder

    // function removeBid(uint256 _itemId) public nonReentrant {
    //     Item storage item = items[_itemId];
    //     require(item.buyer != msg.sender, "You already bought the item");
    //     require(item.bidder == msg.sender, "Only bidder can claim");

    //     payable(msg.sender).transfer(item.bid);
    //     item.bid = 0;
    //     item.bidder = payable(0x0);
    // }

    /// @notice these are Getter functions to get store displays

    function getUserItems(address _sender) public view returns (Item[] memory) {
        uint256 unsoldItemCount = itemCount - itemSold;
        Item[] memory unsoldItems = new Item[](unsoldItemCount);
        uint256 count;

        for (uint256 i = 1; i <= unsoldItemCount; i++) {
            Item memory item = items[i];
            if (item.seller == _sender && item.listed == true) {
                unsoldItems[count] = item;
                count++;
            }
        }

        Item[] memory userItems = new Item[](count);
        for (uint256 i = 0; i < count; i++) {
            userItems[i] = unsoldItems[i];
        }

        return userItems;
    }

    function getUnsoldItems() public view returns (Item[] memory) {
        uint256 unsoldItemCount = itemCount - itemSold;
        Item[] memory marketItems = new Item[](unsoldItemCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= unsoldItemCount; i++) {
            Item memory item = items[i];

            if (item.listed == true) {
                marketItems[count] = item;
                count++;
            }
        }

        return marketItems;
    }

    /// @notice Admin can control listing and purchase activities here

    function toggleListing() public {
        require(admins[msg.sender], "Only admins can pause Listing");
        isListingPaused = !isListingPaused;
    }

    function toggleSales() public {
        require(admins[msg.sender], "Only admins can pause Listing");
        isPurchasePaused = !isPurchasePaused;
    }

    function toggleSalesAndListing(bool _toggle) public {
        require(admins[msg.sender], "Only admins can pause Listing");
        isListingPaused = isPurchasePaused = _toggle;
    }

    /// @notice Add/remove admin, change owner and update fee and fee account here

    function updateAdmins(address[] memory _admins, bool _toggle) external {
        require(msg.sender == owner, "only owner can add admin");
        for (uint256 i = 0; i < _admins.length; i++) {
            admins[_admins[i]] = _toggle;
        }
    }

    function updateOwner(address _newOwner) external {
        require(msg.sender == owner, "only owner can can update owner");
        owner = _newOwner;
    }

    function updateFeeAccount(address _feeAccount) external {
        require(msg.sender == owner, "only owner can update fee account");
        feeAccount = payable(_feeAccount);
    }

    function updateFeePercentage(uint256 _feePercentage) external {
        require(admins[msg.sender], "only admin can update feePercentage");
        feePercent = _feePercentage;
    }

    /// @notice Function to check balance;
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
