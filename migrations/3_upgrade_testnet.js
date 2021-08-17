const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { ethers, upgrades } = require("@nomiclabs/buidler");
const { assert } = require('chai');
const abi = require('ethereumjs-abi');

const XTokenClonable = artifacts.require("XTokenClonable")
const XTokenFactory = artifacts.require("XTokenFactory")
const NFTXFundProxy = artifacts.require("NFTXFundProxy")
const ProxyController = artifacts.require("ProxyController")
const NFTX = artifacts.require("NFTX");
const NFTXv2 = artifacts.require("NFTXv2");
const XStore = artifacts.require("XStore")
const ERC721 = artifacts.require("ERC721")
const ERC1155 = artifacts.require("ERC1155")
const XToken = artifacts.require("XToken")

module.exports = async function (deployer, network, accounts) {
  // const nftX = await NFTX.at('0xAAD1807bcA15cE2690fb14a3dB8bfcAA7BFBB6b3')
  // const xStore = await XStore.at('0x515F7baE5e34b30cE680d97857Fd9A4d9A8746dc')
  // assert.equal( await nftX.store(), xStore.address);

  // const proxyController = await ProxyController.at('0xD132971a82d9DB3ccB49D3600d6AA6F881f93Cb3')
  // console.log("proxyController.getAdmin():" + await proxyController.getAdmin())

  // // // 升级到v2 0x83D91aE968067e1C5feBAC34B87D94f3D16f2ef6
  // await proxyController.fetchImplAddress()
  // let currentImpl = await proxyController.implAddress()
  // console.log("current implemention:" +  currentImpl)
  // await deployer.deploy(NFTXv2)
  // const nftXv2 = await NFTXv2.deployed()
  // console.log("nftXv2:"+ nftXv2.address)
  // await proxyController.upgradeProxyTo(nftXv2.address)
  // await proxyController.fetchImplAddress()
  // currentImpl = await proxyController.implAddress()
  // assert.equal(currentImpl, nftXv2.address);
  // console.log("current implemention:" + currentImpl)

  // // 查看升级后参数不变
  // assert.equal(await nftX.owner({from:accounts[0]}), accounts[0])
  // assert.equal( await nftX.store({from:accounts[0]}), xStore.address)
};
