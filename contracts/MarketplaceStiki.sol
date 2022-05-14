// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../contracts/interface/INewStikiNft.sol";
import "../contracts/stikiToken.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketplaceStiki is Ownable, ReentrancyGuard {
    IERC721 private Ierc721;
    IStikiNFT private Isnft;

    constructor(address _NftContract) {
        require(_NftContract != address(0), "Set correct Address");
        Ierc721 = IERC721(_NftContract);
        Isnft = IStikiNFT(_NftContract);
    }

    // buyer
    struct OfferBuy {
        address payable Buyer;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }
    OfferBuy[] public offersBuy;

    // tokenID => offerSeller
    mapping(uint256 => OfferBuy[]) TokenIdToOfferBuyer;

    //Seller
    struct OfferSeller {
        address payable Seller;
        uint256 price;
        uint256 tokenId;
    }
    OfferSeller public offersSell;

    // tokenID => offerBuyer
    mapping(uint256 => OfferSeller) TokenToOfferSeller;

    function setNewStikiContract(address _contract)
        external
        onlyOwner
        nonReentrant
    {
        require(_contract != address(0), "Set correct Address");
        Ierc721 = IERC721(_contract);
        Isnft = IStikiNFT(_contract);
    }

    // Function Seller
    //ricevuta di deposito
    // bool =>(address=>tokenId)
    mapping(address => mapping(uint256 => bool)) receiptDeposit;

    // address => [nftIdSEll,..,...,..]
    mapping(address => uint256[]) userListSell;

    function viewUserListSell(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return userListSell[_user];
    }

    function _putSell(
        address payable _to,
        uint256 _tokenId,
        uint256 _price
    ) internal {
        require(_to == Ierc721.ownerOf(_tokenId), "Not Owner Stiki NFT");
        require(receiptDeposit[_to][_tokenId] == false, "Nft just in list");
        Ierc721.transferFrom(_to, address(this), _tokenId);
        receiptDeposit[_to][_tokenId] = true;

        TokenToOfferSeller[_tokenId] = OfferSeller(_to, _price, _tokenId);
        userListSell[_to].push(_tokenId);
    }

    function putSell(uint256 _tokenId, uint256 _price) external nonReentrant {
        _putSell(payable(msg.sender), _tokenId, _price);
    }

    function viewUserListSellIndex(address _user, uint256 _tokenId)
        public
        view
        returns (uint256 i)
    {
        for (; i < userListSell[_user].length; i++)
            if (userListSell[_user][i] == _tokenId) {
                return i;
            }
    }

    function _removePutSell(address _to, uint256 _tokenId) internal {
        require(
            TokenToOfferSeller[_tokenId].Seller == _to,
            "This isnt your put"
        );
        delete TokenToOfferSeller[_tokenId];
        receiptDeposit[_to][_tokenId] = false;

        uint256 i = viewUserListSellIndex(_to, _tokenId);
        userListSell[_to][i] = userListSell[_to][userListSell[_to].length - 1];
        userListSell[_to].pop();
        Ierc721.transferFrom(address(this), _to, _tokenId);
    }

    function removePutSell(uint256 _tokenId) external {
        _removePutSell(msg.sender, _tokenId);
    }

    function viewPuttSell(uint256 _tokenId)
        public
        view
        returns (OfferSeller memory)
    {
        return TokenToOfferSeller[_tokenId];
    }

    // Proventi della vedita
    mapping(address => uint256) balanceSelling;

    function fillPutSell(uint256 _tokenId) external payable nonReentrant {
        //chek
        require(
            receiptDeposit[TokenToOfferSeller[_tokenId].Seller][_tokenId] ==
                true,
            "nft not in selling"
        );
        require(
            msg.value == TokenToOfferSeller[_tokenId].price,
            "Set correct value"
        );

        balanceSelling[TokenToOfferSeller[_tokenId].Seller] += msg.value;
        receiptDeposit[TokenToOfferSeller[_tokenId].Seller][_tokenId] = false;
        uint256 i = viewUserListSellIndex(
            TokenToOfferSeller[_tokenId].Seller,
            _tokenId
        );

        userListSell[TokenToOfferSeller[_tokenId].Seller][i] = userListSell[
            TokenToOfferSeller[_tokenId].Seller
        ][userListSell[TokenToOfferSeller[_tokenId].Seller].length - 1];
        userListSell[TokenToOfferSeller[_tokenId].Seller].pop();
        // result
        delete TokenToOfferSeller[_tokenId];

        Ierc721.transferFrom(address(this), msg.sender, _tokenId);

        require(Ierc721.ownerOf(_tokenId) == msg.sender, "transfer NFt faill");
    }

    function viewBalance(address _owner) public view returns (uint256) {
        return balanceSelling[_owner];
    }

    function widrowProfitSell() external nonReentrant {
        require(
            address(this).balance >= viewBalance(msg.sender),
            "balance low"
        );
        uint256 profit = viewBalance(msg.sender);
        balanceSelling[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: profit}("");
        require(success, "Widrow fail");
    }

    /**
     struct OfferBuy {
        address payable Buyer;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
        
    }
    OfferBuy[] public offersBuy;

    // tokenID => offerSeller
    mapping(uint256 => OfferBuy) TokenIdToOfferBuyer; */
    mapping(address => uint256) depositEthBuyer;

    function putBuyOffer(uint256 _price, uint256 _tokenId) external payable {
        require(Ierc721.ownerOf(_tokenId) != msg.sender, "already owner");
        require(
            msg.value == _price,
            "Send correct Eth in contract for your offer"
        );
        depositEthBuyer[msg.sender] += msg.value;
        address payable _to = payable(msg.sender);
        _putBuyOffer(_to, _tokenId, msg.value);
    }

    function _putBuyOffer(
        address payable _to,
        uint256 _tokenId,
        uint256 _price
    ) internal {
        uint256 index = TokenIdToOfferBuyer[_tokenId].length;
        OfferBuy memory Offer = OfferBuy(_to, _price, index, _tokenId, true);
        TokenIdToOfferBuyer[_tokenId].push(Offer);
    }

    function deactiveBuyOffer(uint256 _tokenId, uint256 _index) external {
        require(
            TokenIdToOfferBuyer[_tokenId][_index].Buyer == msg.sender,
            "this not is your offer"
        );
        require(
            TokenIdToOfferBuyer[_tokenId][_index].active == true,
            "this offer is already deactive"
        );
        TokenIdToOfferBuyer[_tokenId][_index].active = false;
    }

    function reactiveBuyOffer(uint256 _tokenId, uint256 _index) external {
        require(
            TokenIdToOfferBuyer[_tokenId][_index].Buyer == msg.sender,
            "this not is your offer"
        );
        require(
            TokenIdToOfferBuyer[_tokenId][_index].active == false,
            "this offer is already active"
        );
        TokenIdToOfferBuyer[_tokenId][_index].active = true;
    }

    function _deletOfferBuyer(
        address _to,
        uint256 _tokenId,
        uint256 _index
    ) internal {
        require(
            TokenIdToOfferBuyer[_tokenId][_index].Buyer == msg.sender,
            "this not is your offer"
        );
        uint256 repay = TokenIdToOfferBuyer[_tokenId][_index].price;
        depositEthBuyer[msg.sender] -= repay;

        TokenIdToOfferBuyer[_tokenId][_index] = TokenIdToOfferBuyer[_tokenId][
            TokenIdToOfferBuyer[_tokenId].length - 1
        ];
        TokenIdToOfferBuyer[_tokenId].pop();

        (bool success, ) = _to.call{value: repay}("");
        require(success, "Repay Eth faill");
    }

    function deletOfferBuyer(uint256 _tokenId, uint256 _index)
        external
        nonReentrant
    {
        _deletOfferBuyer(msg.sender, _tokenId, _index);
    }

    // buyer => nft == riceipt for deposit
    mapping(address => mapping(uint256 => bool)) recptNftBuy;

    function _fillBuyerOffer(
        address _to,
        uint256 _tokenId,
        uint256 _index
    ) internal {
        require(
            Ierc721.ownerOf(_tokenId) == _to,
            "you haven't owner's dirict on this nft "
        );
        require(
            TokenIdToOfferBuyer[_tokenId][_index].active == true,
            "this offer is deactive"
        );
        Ierc721.transferFrom(_to, address(this), _tokenId);
        uint256 price = TokenIdToOfferBuyer[_tokenId][_index].price;
        address buyer = TokenIdToOfferBuyer[_tokenId][_index].Buyer;

        //delet Offer
        TokenIdToOfferBuyer[_tokenId][_index] = TokenIdToOfferBuyer[_tokenId][
            TokenIdToOfferBuyer[_tokenId].length - 1
        ];
        TokenIdToOfferBuyer[_tokenId].pop();

        depositEthBuyer[buyer] -= price;
        balanceSelling[_to] += price;

        recptNftBuy[buyer][_tokenId] = true;
    }

    function fillBuyerOffer(uint256 _tokenId, uint256 _index) external {
        _fillBuyerOffer(msg.sender, _tokenId, _index);
    }

    function _widrowlNftBuy(address _to, uint256 _tokenId) internal {
        require(recptNftBuy[_to][_tokenId] == true, "not avalible for widrowl");
        recptNftBuy[_to][_tokenId] == false;
        Ierc721.transferFrom(address(this), _to, _tokenId);
    }

    function widrowlNftBuy(uint256 _tokenId) external nonReentrant {
        _widrowlNftBuy(msg.sender, _tokenId);
    }

    function viewBuyOfferForToken(uint256 _tokenId)
        public
        view
        returns (OfferBuy[] memory)
    {
        return TokenIdToOfferBuyer[_tokenId];
    }
}
