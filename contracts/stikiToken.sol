// SPDX-License-Identifier: Leluk911
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract stikiToken is ERC20, Ownable {
    constructor() ERC20("Stiki coin", "STK") {}

    function OwnerMint(uint256 _amount) external onlyOwner {
        _mint(msg.sender, _amount);
    }

    function ContractMint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
