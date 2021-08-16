// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

import "./EnumerableSet.sol";
import "./Ownable.sol";
import "./SafeMath.sol";
import "./IXToken.sol";
import "./IERC721.sol";
import "./SafeERC20.sol";

contract XStore is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.UintSet;

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
        bool isFinalized;
        bool isClosed;
        uint256 ethBalance;
    }

    event XTokenAddressSet(uint256 indexed vaultId, address token);
    event NftAddressSet(uint256 indexed vaultId, address asset);
    event ManagerSet(uint256 indexed vaultId, address manager);
    event XTokenSet(uint256 indexed vaultId);
    event NftSet(uint256 indexed vaultId);
    event HoldingsAdded(uint256 indexed vaultId, uint256 id);
    event HoldingsRemoved(uint256 indexed vaultId, uint256 id);
    event IsEligibleSet(uint256 indexed vaultId, uint256 id, bool _bool);
    event FlipEligOnRedeemSet(uint256 indexed vaultId, bool _bool);
    event NegateEligibilitySet(uint256 indexed vaultId, bool _bool);
    event IsFinalizedSet(uint256 indexed vaultId, bool _isFinalized);
    event IsClosedSet(uint256 indexed vaultId, bool _isClosed);
    event EthBalanceSet(uint256 indexed vaultId, uint256 _ethBalance);
    event NewVaultAdded(uint256 indexed vaultId);
    event IsExtensionSet(address addr, bool _isExtension);
    event RandNonceSet(uint256 _randNonce);

    Vault[] internal vaults;

    mapping(address => bool) public isExtension;
    uint256 public randNonce;

    constructor() public {
        initOwnable();
    }

    function _getVault(uint256 vaultId) internal view returns (Vault storage) {
        require(vaultId < vaults.length, "Invalid vaultId");
        return vaults[vaultId];
    }

    function vaultsLength() public view returns (uint256) {
        return vaults.length;
    }

    function xTokenAddress(uint256 vaultId) public view returns (address) {
        Vault storage vault = _getVault(vaultId);
        return vault.xTokenAddress;
    }

    function nftAddress(uint256 vaultId) public view returns (address) {
        Vault storage vault = _getVault(vaultId);
        return vault.nftAddress;
    }

    function manager(uint256 vaultId) public view returns (address) {
        Vault storage vault = _getVault(vaultId);
        return vault.manager;
    }

    function xToken(uint256 vaultId) public view returns (IXToken) {
        Vault storage vault = _getVault(vaultId);
        return vault.xToken;
    }

    function nft(uint256 vaultId) public view returns (IERC721) {
        Vault storage vault = _getVault(vaultId);
        return vault.nft;
    }

    function holdingsLength(uint256 vaultId) public view returns (uint256) {
        Vault storage vault = _getVault(vaultId);
        return vault.holdings.length();
    }

    function holdingsContains(uint256 vaultId, uint256 elem)
        public
        view
        returns (bool)
    {
        Vault storage vault = _getVault(vaultId);
        return vault.holdings.contains(elem);
    }

    function holdingsAt(uint256 vaultId, uint256 index)
        public
        view
        returns (uint256)
    {
        Vault storage vault = _getVault(vaultId);
        return vault.holdings.at(index);
    }

    function isEligible(uint256 vaultId, uint256 id)
        public
        view
        returns (bool)
    {
        Vault storage vault = _getVault(vaultId);
        return vault.isEligible[id];
    }

    function flipEligOnRedeem(uint256 vaultId) public view returns (bool) {
        Vault storage vault = _getVault(vaultId);
        return vault.flipEligOnRedeem;
    }

    function negateEligibility(uint256 vaultId) public view returns (bool) {
        Vault storage vault = _getVault(vaultId);
        return vault.negateEligibility;
    }

    function isFinalized(uint256 vaultId) public view returns (bool) {
        Vault storage vault = _getVault(vaultId);
        return vault.isFinalized;
    }

    function isClosed(uint256 vaultId) public view returns (bool) {
        Vault storage vault = _getVault(vaultId);
        return vault.isClosed;
    }

    function ethBalance(uint256 vaultId) public view returns (uint256) {
        Vault storage vault = _getVault(vaultId);
        return vault.ethBalance;
    }

    function setXTokenAddress(uint256 vaultId, address _xTokenAddress)
        public
        onlyOwner
    {
        Vault storage vault = _getVault(vaultId);
        vault.xTokenAddress = _xTokenAddress;
        emit XTokenAddressSet(vaultId, _xTokenAddress);
    }

    function setNftAddress(uint256 vaultId, address _nft) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.nftAddress = _nft;
        emit NftAddressSet(vaultId, _nft);
    }

    function setManager(uint256 vaultId, address _manager) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.manager = _manager;
        emit ManagerSet(vaultId, _manager);
    }

    function setXToken(uint256 vaultId) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.xToken = IXToken(vault.xTokenAddress);
        emit XTokenSet(vaultId);
    }

    function setNft(uint256 vaultId) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.nft = IERC721(vault.nftAddress);
        emit NftSet(vaultId);
    }

    function holdingsAdd(uint256 vaultId, uint256 elem) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.holdings.add(elem);
        emit HoldingsAdded(vaultId, elem);
    }

    function holdingsRemove(uint256 vaultId, uint256 elem) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.holdings.remove(elem);
        emit HoldingsRemoved(vaultId, elem);
    }

    function setIsEligible(uint256 vaultId, uint256 id, bool _bool)
        public
        onlyOwner
    {
        Vault storage vault = _getVault(vaultId);
        vault.isEligible[id] = _bool;
        emit IsEligibleSet(vaultId, id, _bool);
    }

    function setFlipEligOnRedeem(uint256 vaultId, bool flipElig)
        public
        onlyOwner
    {
        Vault storage vault = _getVault(vaultId);
        vault.flipEligOnRedeem = flipElig;
        emit FlipEligOnRedeemSet(vaultId, flipElig);
    }

    function setNegateEligibility(uint256 vaultId, bool negateElig)
        public
        onlyOwner
    {
        Vault storage vault = _getVault(vaultId);
        vault.negateEligibility = negateElig;
        emit NegateEligibilitySet(vaultId, negateElig);
    }

    function setIsFinalized(uint256 vaultId, bool _isFinalized)
        public
        onlyOwner
    {
        Vault storage vault = _getVault(vaultId);
        vault.isFinalized = _isFinalized;
        emit IsFinalizedSet(vaultId, _isFinalized);
    }

    function setIsClosed(uint256 vaultId, bool _isClosed) public onlyOwner {
        Vault storage vault = _getVault(vaultId);
        vault.isClosed = _isClosed;
        emit IsClosedSet(vaultId, _isClosed);
    }

    function setEthBalance(uint256 vaultId, uint256 _ethBalance)
        public
        onlyOwner
    {
        Vault storage vault = _getVault(vaultId);
        vault.ethBalance = _ethBalance;
        emit EthBalanceSet(vaultId, _ethBalance);
    }

    ////////////////////////////////////////////////////////////

    function addNewVault() public onlyOwner returns (uint256) {
        Vault memory newVault;
        vaults.push(newVault);
        uint256 vaultId = vaults.length.sub(1);
        emit NewVaultAdded(vaultId);
        return vaultId;
    }

    function setIsExtension(address addr, bool _isExtension) public onlyOwner {
        isExtension[addr] = _isExtension;
        emit IsExtensionSet(addr, _isExtension);
    }

    function setRandNonce(uint256 _randNonce) public onlyOwner {
        randNonce = _randNonce;
        emit RandNonceSet(_randNonce);
    }
}
