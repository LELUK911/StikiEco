// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../contracts/interface/INewStikiNft.sol";
import "../contracts/stikiToken.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract MintContract is Ownable {
    IStikiNFT StikiNft;
    IERC20 usdc;
    IERC20 StikiToken;
    uint256 priceStiki;

    constructor(
        address _usdc,
        address _StikiToken,
        uint256 _priceStiki
    ) {
        usdc = IERC20(_usdc);
        priceStiki = _priceStiki;
        StikiToken = IERC20(_StikiToken);
    }

    function setAddrStikiNft(address _StikiNft) external onlyOwner {
        StikiNft = IStikiNFT(_StikiNft);
    }

    function MintStiki(
        string calldata _name,
        uint256 _lifepoint,
        uint256 _power,
        uint256 _dex,
        uint256 _stamina,
        uint256 _speed
    ) public {
        uint256 inBalance = StikiToken.balanceOf(address(this));
        StikiToken.transferFrom(msg.sender, address(this), 100);
        require(
            inBalance + 100 == StikiToken.balanceOf(address(this)),
            "sending StikiToken faill"
        );
        StikiNft.mint(
            msg.sender,
            _name,
            _lifepoint,
            _power,
            _dex,
            _stamina,
            _speed
        );
    }

    function BuyStikiToken(address _to, uint256 _amount) external {
        _BuyStikiToken(_to, _amount);
    }

    function _BuyStikiToken(address _to, uint256 _amount) internal {
        uint256 inBalance = usdc.balanceOf(address(this));
        usdc.transferFrom(_to, address(this), _amount);
        require(
            inBalance + _amount == usdc.balanceOf(address(this)),
            "sending Usdc faill"
        );

        (bool success, ) = address(StikiToken).call(
            abi.encodeWithSignature(
                "ContractMint(address,uint256)",
                _to,
                _amount * priceStiki
            )
        );

        require(success, "mint Faill");
    }

    function withdrawalUsdc() external onlyOwner {
        usdc.transfer(msg.sender, usdc.balanceOf(msg.sender));
    }

    function balanceOfUsdc() external view onlyOwner returns (uint256) {
        return usdc.balanceOf(msg.sender);
    }
}
