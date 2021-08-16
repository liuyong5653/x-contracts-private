// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

import "./NFTX.sol";

contract NFTXv2 is NFTX {
    function setFlipEligOnRedeem(uint256 vaultId, bool flipElig)
        public
        virtual
        override
    {}
}
