// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol";

contract NFTXFundProxy is TransparentUpgradeableProxy {
    constructor(address logic, address admin, bytes memory data) public payable TransparentUpgradeableProxy(logic, admin, data) {
    }
}
