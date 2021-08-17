// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

import "./EnumerableSet.sol";
import "./Ownable.sol";
import "./SafeMath.sol";
import "./IXToken.sol";
import "./IERC721.sol";
import "./EnumerableSet.sol";

interface IXStore {
    struct Vault {
        address xTokenAddress;
        address nftAddress;
        address manager;
        IXToken xToken;
        IERC721 nft;
        EnumerableSet.UintSet holdings;
        mapping(uint256 => bool) isEligible;
        bool flipEligOnRedeem;
        bool negateEligibility;
        uint256 rangeStart;
        uint256 rangeEnd;
        bool is1155;
        bool isFinalized;
        bool isClosed;
        uint256 ethBalance;
    }

    function isExtension(address addr) external view returns (bool);

    function randNonce() external view returns (uint256);

    function vaultsLength() external view returns (uint256);

    function xTokenAddress(uint256 vaultId) external view returns (address);

    function nftAddress(uint256 vaultId) external view returns (address);

    function manager(uint256 vaultId) external view returns (address);

    function xToken(uint256 vaultId) external view returns (IXToken);

    function nft(uint256 vaultId) external view returns (IERC721);

    function holdingsLength(uint256 vaultId) external view returns (uint256);

    function holdingsContains(uint256 vaultId, uint256 elem)
        external
        view
        returns (bool);

    function holdingsAt(uint256 vaultId, uint256 index)
        external
        view
        returns (uint256);

    function isEligible(uint256 vaultId, uint256 id)
        external
        view
        returns (bool);

    function flipEligOnRedeem(uint256 vaultId) external view returns (bool);

    function negateEligibility(uint256 vaultId) external view returns (bool);

    function range(uint256 vaultId) external view returns (uint256, uint256);

    function is1155(uint256 vaultId) external view returns (bool);

    function isFinalized(uint256 vaultId) external view returns (bool);

    function isClosed(uint256 vaultId) external view returns (bool);

    function ethBalance(uint256 vaultId) external view returns (uint256);

    function setXTokenAddress(uint256 vaultId, address _xTokenAddress) external;

    function setNftAddress(uint256 vaultId, address _assetAddress) external;

    function setManager(uint256 vaultId, address _manager) external;

    function setXToken(uint256 vaultId) external;

    function setNft(uint256 vaultId) external;

    function holdingsAdd(uint256 vaultId, uint256 elem) external;

    function holdingsRemove(uint256 vaultId, uint256 elem) external;

    function setIsEligible(uint256 vaultId, uint256 id, bool _bool) external;

    function setFlipEligOnRedeem(uint256 vaultId, bool flipElig) external;

    function setNegateEligibility(uint256 vaultId, bool negateElig) external;

    function setRange(uint256 vaultId, uint256 _rangeStart, uint256 _rangeEnd) external;

    function setIs1155(uint256 vaultId, bool _is1155) external;

    function setIsFinalized(uint256 vaultId, bool _isFinalized) external;

    function setIsClosed(uint256 vaultId, bool _isClosed) external;

    function setEthBalance(uint256 vaultId, uint256 _ethBalance) external;

    ////////////////////////////////////////////////////////////

    function setIsExtension(address addr, bool _isExtension) external;

    function setRandNonce(uint256 _randNonce) external;

    function addNewVault() external returns (uint256);
}
