// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";

contract NewStikiNFT is ERC721, Ownable, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(address _MinterContract) ERC721("Stiki", "STK") {
        MinterContract = _MinterContract;
    }

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Mapping total nft for user
    mapping(address => uint256[]) internal NftsForUSer;

    mapping(address => int256) public rankingPoint;

    struct StikiWarrior {
        uint256 Id;
        string name;
        uint256 level;
        uint256 lifepoint;
        uint256 power;
        uint256 dex;
        uint256 stamina;
        uint256 speed;
        uint256 poinStat;
    }
    StikiWarrior[] public stikies;

    address private MinterContract;

    modifier onlyContractMinter() {
        require(
            MinterContract == _msgSender(),
            "Contract caller is not the Contract owner"
        );
        _;
    }

    function mint(
        address to,
        string calldata _name,
        uint256 _lifepoint,
        uint256 _power,
        uint256 _dex,
        uint256 _stamina,
        uint256 _speed
    ) external virtual onlyContractMinter {
        uint256 newItemId = _tokenIds.current();
        _tokenIds.increment();
        // use can set 15 points for new Stiki
        require(
            (_lifepoint + _power + _dex + _stamina + _speed) == 15,
            "you must set 15 point's stat"
        );

        StikiWarrior memory NewStiki = StikiWarrior(
            newItemId,
            _name,
            1,
            _lifepoint,
            _power,
            _dex,
            _stamina,
            _speed,
            0
        );
        stikies.push(NewStiki);
        _mint(to, newItemId);
        NftsForUSer[to].push(newItemId);
    }

    function _setStat(
        uint256 _tokenId,
        uint256 _lifepoint,
        uint256 _power,
        uint256 _dex,
        uint256 _stamina,
        uint256 _speed
    ) internal {
        // use can set 3 points for new Stiki
        require(stikies[_tokenId].poinStat > 0, "haven't point stat");
        require(
            (_lifepoint + _power + _dex + _stamina + _speed) <= 3,
            "you must set 3 upgrade"
        );

        stikies[_tokenId].lifepoint += _lifepoint;
        stikies[_tokenId].power += _power;
        stikies[_tokenId].dex += _dex;
        stikies[_tokenId].stamina += _stamina;
        stikies[_tokenId].speed += _speed;
        stikies[_tokenId].poinStat -=
            _lifepoint +
            _power +
            _dex +
            _stamina +
            _speed;
    }

    function setStat(
        uint256 _tokenId,
        uint256 _lifepoint,
        uint256 _power,
        uint256 _dex,
        uint256 _stamina,
        uint256 _speed
    ) external {
        require(msg.sender == ownerOf(_tokenId), "select correct TokenId");
        _setStat(_tokenId, _lifepoint, _power, _dex, _stamina, _speed);
    }

    function _levelUp(address _owner, uint256 _tokenId) internal {
        rankingPoint[_owner] += 1;
        stikies[_tokenId].level += 1;
        stikies[_tokenId].lifepoint += 1;
        stikies[_tokenId].power += 1;
        stikies[_tokenId].dex += 1;
        stikies[_tokenId].stamina += 1;
        stikies[_tokenId].speed += 1;
        stikies[_tokenId].poinStat += 3;
    }

    function viewAllNftsUser(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return NftsForUSer[_owner];
    }

    function viewStat(uint256 _tokenId)
        public
        view
        virtual
        returns (StikiWarrior memory)
    {
        return stikies[_tokenId];
    }

    // this transaction must approve
    //function transferNft(address _to, uint256 _tokenId) external virtual {
    //    uint256 idlist = findNFtInUSerList(msg.sender, _tokenId);
    //    NftsForUSer[msg.sender][idlist] = NftsForUSer[msg.sender][
    //        NftsForUSer[msg.sender].length - 1
    //    ];
    //    NftsForUSer[msg.sender].pop();
    //    _transfer(msg.sender, _to, _tokenId);
    //}
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        uint256 idlist = findNFtInUSerList(from, tokenId);
        NftsForUSer[from][idlist] = NftsForUSer[from][
            NftsForUSer[from].length - 1
        ];
        NftsForUSer[from].pop();
        _transfer(from, to, tokenId);
        NftsForUSer[to].push(tokenId);
    }

    function findNFtInUSerList(address _owner, uint256 _tokenId)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < NftsForUSer[_owner].length; i++) {
            if (NftsForUSer[_owner][i] == _tokenId) {
                return i;
            }
        }
        revert("Token dont find");
    }

    function burn(uint256 tokenId) external onlyContractMinter {
        _burn(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override {
        address owner = ERC721.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);

        _afterTokenTransfer(owner, address(0), tokenId);
    }

    function viewCurrentID() public view returns (uint256 id) {
        return id = _tokenIds.current();
    }
}
