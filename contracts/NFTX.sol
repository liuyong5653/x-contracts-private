// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

import "./Pausable.sol";
import "./IXToken.sol";
import "./IERC721.sol";
import "./ReentrancyGuard.sol";
import "./ERC721Holder.sol";
import "./IXStore.sol";
import "./Initializable.sol";
import "./SafeERC20.sol";
import "./IERC1155.sol";
import "./IERC1155Receiver.sol";
import "./IXTokenFactory.sol";

contract NFTX is Pausable, ReentrancyGuard, ERC721Holder, IERC1155Receiver {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event NewVault(uint256 indexed vaultId, address sender);
    event Mint(
        uint256 indexed vaultId,
        uint256[] nftIds,
        address sender
    );
    event Redeem(
        uint256 indexed vaultId,
        uint256[] nftIds,
        address sender
    );

    IXStore public store;



    // TODO 放xstore中，加事件
    mapping(uint256 => bool) public isVault1155;

    function setIs1155(
        uint256 vaultId,
        bool _boolean
    ) public virtual {
        onlyPrivileged(vaultId);
        isVault1155[vaultId] = _boolean;
    }

    // TODO 放xstore中，加事件
    mapping(uint256 => uint256) public rangeStart;
    mapping(uint256 => uint256) public rangeEnd;
    function setRange(
        uint256 vaultId,
        uint256 start,
        uint256 end
    ) public virtual {
        onlyPrivileged(vaultId);
        rangeStart[vaultId] = start;
        rangeEnd[vaultId] = end;
    }





    function initialize(address storeAddress) public initializer {
        initOwnable();
        initReentrancyGuard();
        store = IXStore(storeAddress);
    }

    function onlyPrivileged(uint256 vaultId) internal view {
        if (store.isFinalized(vaultId)) {
            require(msg.sender == owner(), "Not owner");
        } else {
            require(msg.sender == store.manager(vaultId), "Not manager");
        }
    }

    function isEligible(uint256 vaultId, uint256 nftId)
        public
        view
        virtual
        returns (bool)
    {
        if (rangeEnd[vaultId] > 0) {
            if (nftId >= rangeStart[vaultId] && nftId <= rangeEnd[vaultId]) {
                return true;
            }
        }
        return
            store.negateEligibility(vaultId)
                ? !store.isEligible(vaultId, nftId)
                : store.isEligible(vaultId, nftId);
    }

    function vaultSize(uint256 vaultId) public view virtual returns (uint256) {
        return store.holdingsLength(vaultId);
    }

    function _getPseudoRand(uint256 modulus)
        internal
        virtual
        returns (uint256)
    {
        store.setRandNonce(store.randNonce().add(1));
        return
            uint256(
                keccak256(abi.encodePacked(now, msg.sender, store.randNonce()))
            ) %
            modulus;
    }

    function createVault(
        string memory name,
        string memory symbol,
        address _assetAddress,
        bool _is1155,
        bool _isFinalize
    ) public virtual nonReentrant returns (uint256) {
        onlyOwnerIfPaused(0);
        IXTokenFactory xTokenFactory = IXTokenFactory(
            0x72c4F1871B4A27076f23Afc022Fe0043353A8106
        );
        address xTokenAddress = xTokenFactory.createXToken(name, symbol);
        uint256 vaultId = store.addNewVault();
        store.setXTokenAddress(vaultId, xTokenAddress);
        store.setXToken(vaultId);
        store.setNftAddress(vaultId, _assetAddress);
        store.setNft(vaultId);
        store.setNegateEligibility(vaultId, true);
        store.setManager(vaultId, msg.sender);

        setIs1155(vaultId, _is1155);
        if(_isFinalize) {
            finalizeVault(vaultId);
        }
        
        emit NewVault(vaultId, msg.sender);
        return vaultId;
    }

    function _mint(uint256 vaultId, uint256[] memory nftIds)
        internal
        virtual
    {
        for (uint256 i = 0; i < nftIds.length; i = i.add(1)) {
            uint256 nftId = nftIds[i];
            require(isEligible(vaultId, nftId), "1");
            
            if (isVault1155[vaultId]) {
                IERC1155 nft = IERC1155(store.nftAddress(vaultId));
                nft.safeTransferFrom(msg.sender, address(this), nftId, 1, "");
            } else {
                require(
                    store.nft(vaultId).ownerOf(nftId) != address(this),
                    "2"
                );
                store.nft(vaultId).transferFrom(msg.sender, address(this), nftId);
                require(
                    store.nft(vaultId).ownerOf(nftId) == address(this),
                    "3"
                );
            }
            
            store.holdingsAdd(vaultId, nftId);
        }
        store.xToken(vaultId).mint(msg.sender, nftIds.length.mul(10000*10**18));
    }

    function _redeem(uint256 vaultId, uint256 numNFTs)
        internal
        virtual
    {
        for (uint256 i = 0; i < numNFTs; i = i.add(1)) {
            uint256[] memory nftIds = new uint256[](1);
            if (store.holdingsLength(vaultId) > 0) {
                uint256 rand = _getPseudoRand(store.holdingsLength(vaultId));
                nftIds[0] = store.holdingsAt(vaultId, rand);
            }
            _redeemHelper(vaultId, nftIds);
            emit Redeem(vaultId, nftIds, msg.sender);
        }
    }

    function _redeemHelper(
        uint256 vaultId,
        uint256[] memory nftIds
    ) internal virtual {
        store.xToken(vaultId).burnFrom(msg.sender, nftIds.length.mul(10000*10**18));
        for (uint256 i = 0; i < nftIds.length; i = i.add(1)) {
            uint256 nftId = nftIds[i];
            require(store.holdingsContains(vaultId, nftId), "1");
            if (store.holdingsContains(vaultId, nftId)) {
                store.holdingsRemove(vaultId, nftId);
            }
            if (store.flipEligOnRedeem(vaultId)) {
                bool isElig = store.isEligible(vaultId, nftId);
                store.setIsEligible(vaultId, nftId, !isElig);
            }
            if (isVault1155[vaultId]) {
                IERC1155 nft = IERC1155(store.nftAddress(vaultId));
                nft.safeTransferFrom(address(this), msg.sender, nftId, 1, "");
            } else {
                store.nft(vaultId).safeTransferFrom(
                    address(this),
                    msg.sender,
                    nftId
                );
            }
        }  
    }

    function mint(uint256 vaultId, uint256[] memory nftIds)
        public
        payable
        virtual
        nonReentrant
    {
        onlyOwnerIfPaused(1);
        _mint(vaultId, nftIds);
        emit Mint(vaultId, nftIds, msg.sender);  
    }

    function redeem(uint256 vaultId, uint256 amount)
        public
        payable
        virtual
        nonReentrant
    {
        onlyOwnerIfPaused(2);
        _redeem(vaultId, amount);
    }

    function setIsEligible(
        uint256 vaultId,
        uint256[] memory nftIds,
        bool _boolean
    ) public virtual {
        onlyPrivileged(vaultId);
        for (uint256 i = 0; i < nftIds.length; i = i.add(1)) {
            store.setIsEligible(vaultId, nftIds[i], _boolean);
        }
    }

    function setFlipEligOnRedeem(uint256 vaultId, bool flipElig)
        public
        virtual
    {
        onlyPrivileged(vaultId);
        store.setFlipEligOnRedeem(vaultId, flipElig);
    }

    function setNegateEligibility(uint256 vaultId, bool shouldNegate)
        public
        virtual
    {
        onlyPrivileged(vaultId);
        require(store.holdingsLength(vaultId) == 0, "1");
        store.setNegateEligibility(vaultId, shouldNegate);    
    }
 
    function setManager(uint256 vaultId, address newManager) public virtual {
        onlyPrivileged(vaultId);
        store.setManager(vaultId, newManager);
    }

    function finalizeVault(uint256 vaultId) public virtual {
        onlyPrivileged(vaultId);
        if (!store.isFinalized(vaultId)) {
            store.setIsFinalized(vaultId, true);
        }
    }

    function closeVault(uint256 vaultId) public virtual {
        onlyPrivileged(vaultId);
        if (!store.isFinalized(vaultId)) {
            store.setIsFinalized(vaultId, true);
        }
        store.setIsClosed(vaultId, true);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId)
        external
        override
        view
        returns (bool)
    {}
}
