const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { ethers, upgrades } = require("@nomiclabs/buidler");

const NFTXFundProxy = artifacts.require("NFTXFundProxy");
const ProxyController = artifacts.require("ProxyController");
const NFTXv11 = artifacts.require("NFTXv11");
const NFTXv10 = artifacts.require("NFTXv10")
const XStore = artifacts.require("XStore")

module.exports = async function (deployer, network, accounts) {
  console.log("accounts[0]:"+accounts[0]);
  console.log("accounts[1]:"+accounts[1]);

  // // 部署xStore
  await deployer.deploy(XStore)
  const xStore = await XStore.deployed()
  console.log("xStore:"+ xStore.address)
  console.log("xStore owner:" +  await xStore.owner())

  // // 部署nftXv10
  await deployer.deploy(NFTXv10)
  const nftXv10 = await NFTXv10.deployed()
  console.log("nftXv10:"+ nftXv10.address)
  // const nftXv10 = await NFTXv10.at('0x13b796eED9f4165656d5E009234AC78f63773EAc')

  // // abi.encodeWithSignature("initialize(address)", 0xb85d36E149C6a9Eb004Bf3067c134B1cC789DFF1) = 0xc4d66de8000000000000000000000000b85d36e149c6a9eb004bf3067c134b1cc789dff1
  const delegatecallData = '0xc4d66de8000000000000000000000000' + xStore.address.substring(2).toLowerCase()
  // console.log(delegatecallData)
  // 部署 proxy
  await deployer.deploy(NFTXFundProxy, nftXv10.address, accounts[0], delegatecallData)
  const proxy = await NFTXFundProxy.deployed()
  console.log("NFTXFundProxy:"+ proxy.address)

  // 部署 proxyController
  await deployer.deploy(ProxyController, proxy.address)
  const proxyController = await ProxyController.deployed()
  console.log("proxyController:"+ proxyController.address)

  // xStore owner转给proxy
  await xStore.transferOwnership(proxy.address);
  console.log("xStore owner:" +  await xStore.owner())
  // proxy admin转给proxyController
  await proxy.changeAdmin(proxyController.address);
  console.log("proxy admin:" + await proxyController.getAdmin())
  
  const nftX = await NFTXv10.at(proxy.address)
  console.log("nftX owner:" + await nftX.owner({from:accounts[0]})) 
  console.log("nftX store:" + await nftX.store({from:accounts[0]}))
  console.log("nftXv10 owner:" +  await nftXv10.owner())
  console.log("nftXv10 store:" +  await nftXv10.store())
  
  // 升级到v11
  await proxyController.fetchImplAddress()
  console.log("current implemention:" +  await proxyController.implAddress())
  await deployer.deploy(NFTXv11)
  const nftXv11 = await NFTXv11.deployed()
  console.log("nftXv11:"+ nftXv11.address)
  await proxyController.upgradeProxyTo(nftXv11.address)
  await proxyController.fetchImplAddress()
  console.log("current implemention:" +  await proxyController.implAddress())

  // 查看升级后参数
  console.log("nftX owner:" + await nftX.owner({from:accounts[0]})) 
  console.log("nftX store:" + await nftX.store({from:accounts[0]}))



};
