// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

import "./NFTXv5.sol";
import "./IXTokenFactory.sol";

contract NFTXv2 is NFTXv5 {
    function changeTokenName(uint256 vaultId, string memory newName)
        public
        virtual
        override
    {}

    function changeTokenSymbol(uint256 vaultId, string memory newSymbol)
        public
        virtual
        override
    {}

}
