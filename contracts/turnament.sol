// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";

contract Turnament is Pausable, Ownable {
    IERC721 stikiWarrior;

    constructor(address _stikiWarrior) {
        stikiWarrior = IERC721(_stikiWarrior);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _listId;

    //Player deposit Nft

    // ricevuta deposito address => id
    mapping(address => uint256) private receipDepostNft;
    mapping(address => uint256[]) private listDepositNft;

    // staking War (deposito nella lista dei combattenti)
    // address => indexList => indexList
    mapping(address => mapping(uint256 => bool)) private stakingWar;
    //list token in stakingWarlist
    mapping(address => mapping(uint256 => uint256)) private stakingWarID;
    uint256[] listStakingWar;

    function _depositStikiWar(address _to, uint256 _tokenId) internal {
        stikiWarrior.transferFrom(_to, address(this), _tokenId);
        receipDepostNft[_to] = _tokenId;
        listDepositNft[_to].push(receipDepostNft[_to]);
    }

    function _withdrawalNft(address _to, uint256 _indexList) internal {
        require(!stakingWar[_to][_indexList], " Nft deposit in stakingWar");
        uint256 _tokenId = listDepositNft[_to][_indexList];
        require(receipDepostNft[_to] == _tokenId);
        receipDepostNft[_to] = 0;
        //remove array element
        uint256[] storage listArray = listDepositNft[_to];
        uint256 len = listArray.length;
        listArray[_indexList] = listArray[listArray.length - 1];
        listArray.pop();
        //
        stikiWarrior.approve(address(this), _tokenId);
        stikiWarrior.transferFrom(address(this), _to, _tokenId);
        //
        require(stikiWarrior.ownerOf(_tokenId) == _to);
        require(listArray.length + 1 == len);
    }

    function _stakingWar(address _to, uint256 _indexList) internal {
        uint256 listId = _listId.current();
        _listId.increment();
        stakingWar[_to][_indexList] = true;
        stakingWarID[_to][_indexList] = listId;
        listStakingWar.push(listId);
    }

    function _unStakingWar(address _to, uint256 _indexList) internal {
        require(
            stakingWar[_to][_indexList],
            "nft not in list or your dont owner"
        );
        stakingWar[_to][_indexList] = false;

        //remove array element
        uint256 idPopList = _findIdListStakingWar(_to, _indexList);
        listStakingWar[idPopList] = listStakingWar[listStakingWar.length - 1];
        listStakingWar.pop();
        //
    }

    function _findIdListStakingWar(address _to, uint256 _indexList)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < listStakingWar.length; i++) {
            if (listStakingWar[i] == stakingWarID[_to][_indexList]) {
                return i;
            }
        }
        revert("element don't find in list");
    }
}
