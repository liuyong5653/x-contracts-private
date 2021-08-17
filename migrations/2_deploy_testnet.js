const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { ethers, upgrades } = require("@nomiclabs/buidler");
const { assert } = require('chai');
const abi = require('ethereumjs-abi');

const XTokenClonable = artifacts.require("XTokenClonable")
const XTokenFactory = artifacts.require("XTokenFactory");
const NFTXFundProxy = artifacts.require("NFTXFundProxy");
const ProxyController = artifacts.require("ProxyController");
const NFTXv2 = artifacts.require("NFTXv2");
const NFTX = artifacts.require("NFTX");
const XStore = artifacts.require("XStore")
const ERC721 = artifacts.require("ERC721")
const ERC1155 = artifacts.require("ERC1155")
const XToken = artifacts.require("XToken")

module.exports = async function (deployer, network, accounts) {
  console.log("accounts[0]:"+accounts[0]);
  console.log("accounts[1]:"+accounts[1]);

  // await deployer.deploy(XTokenClonable)
  // const xtokenClonable = await XTokenClonable.deployed()
  // await deployer.deploy(XTokenFactory, xtokenClonable.address)
  // const xtokenFactory = await XTokenFactory.deployed()
  // console.log("xtokenFactory:" + xtokenFactory.address)
  // assert.equal(await xtokenFactory.template(), xtokenClonable.address);
  

  // // // TODO 修改NFTX中的createVault的代码
  // const xtokenFactory = await XTokenFactory.at('0x0565bdF713A6F310aa8884F0a392EB489e31CbaF')

  // // 部署xStore
  // await deployer.deploy(XStore)
  // const xStore = await XStore.deployed()
  // console.log("xStore:"+ xStore.address)
  // // console.log("xStore owner:" +  await xStore.owner())
  // assert.equal(await xStore.owner(), accounts[0]);

  // // // // 部署nftxv1
  // await deployer.deploy(NFTX)
  // const nftXv1 = await NFTX.deployed()
  // console.log("nftXv1:"+ nftXv1.address)

  // // // abi.encodeWithSignature("initialize(address)", 0xb85d36E149C6a9Eb004Bf3067c134B1cC789DFF1) = 0xc4d66de8000000000000000000000000b85d36e149c6a9eb004bf3067c134b1cc789dff1
  // const delegatecallData = '0xc4d66de8000000000000000000000000' + xStore.address.substring(2).toLowerCase()
  // console.log("delegatecallData="+delegatecallData)
  // // 部署 proxy
  // await deployer.deploy(NFTXFundProxy, nftXv1.address, accounts[0], delegatecallData)
  // const proxy = await NFTXFundProxy.deployed()
  // console.log("NFTXFundProxy:"+ proxy.address)

  // // // 部署 proxyController
  // await deployer.deploy(ProxyController, proxy.address)
  // const proxyController = await ProxyController.deployed()
  // console.log("proxyController:"+ proxyController.address)

  // // xtokenFactory owner转给proxy 
  // await xtokenFactory.transferOwnership(proxy.address);
  // // console.log("xtokenFactory owner:" +  await xtokenFactory.owner())
  // assert.equal(await xtokenFactory.owner(), proxy.address);
  // // xStore owner转给proxy
  // await xStore.transferOwnership(proxy.address);
  // // console.log("xStore owner:" +  await xStore.owner())
  // assert.equal(await xStore.owner(), proxy.address);
  // // proxy admin转给proxyController
  // await proxy.changeAdmin(proxyController.address);
  // // console.log("proxy admin:" + await proxyController.getAdmin())

  // const nftX = await NFTX.at(proxy.address)
  // // console.log("nftX owner:" + await nftX.owner({from:accounts[0]})) 
  // // console.log("nftX store:" + await nftX.store({from:accounts[0]}))
  // assert.equal(await nftX.owner({from:accounts[0]}), accounts[0]);
  // assert.equal( await nftX.store({from:accounts[0]}), xStore.address);
};
