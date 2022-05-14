// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.7;

interface IStikiNFT {
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

    function mint(
        address to,
        string calldata _name,
        uint256 _lifepoint,
        uint256 _power,
        uint256 _dex,
        uint256 _stamina,
        uint256 _speed
    ) external;

    function setStat(
        uint256 _tokenId,
        uint256 _lifepoint,
        uint256 _power,
        uint256 _dex,
        uint256 _stamina,
        uint256 _speed
    ) external;

    function viewAllNftsUser(address _owner)
        external
        view
        returns (uint256[] memory);

    function viewStat(uint256 _tokenId)
        external
        view
        returns (StikiWarrior memory);

    function transferNft(address _to, uint256 _tokenId) external;
}
