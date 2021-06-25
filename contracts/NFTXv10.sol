// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

import "./NFTXv9.sol";

interface KittyCoreAlt {
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;
}

contract NFTXv10 is NFTXv9 {
    function requestMint(uint256 vaultId, uint256[] memory nftIds)
        public
        payable
        virtual
        override
        nonReentrant
    {
        onlyOwnerIfPaused(1);
        require(store.allowMintRequests(vaultId), "1");
        for (uint256 i = 0; i < nftIds.length; i = i.add(1)) {
            store.nft(vaultId).safeTransferFrom(
                msg.sender,
                address(this),
                nftIds[i]
            );
            store.setRequester(vaultId, nftIds[i], msg.sender);
        }
        emit MintRequested(vaultId, nftIds, msg.sender);
    }
}
