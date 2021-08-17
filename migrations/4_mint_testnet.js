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

// NFT20化过程(NFT MINT ERC20、ERC20 REDEEM NFT)
module.exports = async function (deployer, network, accounts) {
  // const nftX = await NFTX.at('0xAAD1807bcA15cE2690fb14a3dB8bfcAA7BFBB6b3')
  // const xStore = await XStore.at('0x515F7baE5e34b30cE680d97857Fd9A4d9A8746dc')
  // assert.equal( await nftX.store(), xStore.address);

  // const funds = [
  //   {
  //     name: "PUNK-BASIC",
  //     symbol: "Punk-Basic",
  //     is1155: false,
  //   },
  //   // {
  //   //   name: "HASH-MASKS",
  //   //   symbol: "HASH-MASKS",
  //   //   is1155: false,
  //   // },
  //   // {
  //   //   name: "NFT-1155",
  //   //   symbol: "NFT-1155",
  //   //   is1155: true,
  //   // }
  // ]
  // // // 创建NFT Vault
  // for (let i = 0; i < funds.length; i++) {
  //   const fund = funds[i];

  //   console.log(i + ' is1155=' + fund.is1155)
  //   let nft
  //   if(fund.is1155) {
  //     nft = await ERC1155.new('1155 URI');
  //   } else {
  //     nft = await ERC721.new(fund.name, fund.symbol);
  //   }
  //   console.log("nft===>" + nft.address + '-----' + 
  //                 (fund.is1155 ? await nft.uri(1) : await nft.name() + '-----' + await nft.symbol()))
  //   funds[i].nftAddress = nft.address

  //   const tx = await nftX.createVault(fund.name+'-20', fund.symbol+'-20', nft.address, fund.is1155, true)
  //   // console.log(tx);
  //   var eventNewVaultAdded= '0x' + abi.soliditySHA3(['string'], ["NewVault(uint256,address)"]).toString("hex");
  //   var log = tx.receipt.rawLogs.find(element => element.topics[0].match(eventNewVaultAdded));
  //   const vaultId = web3.eth.abi.decodeParameters(["uint256"],log.topics[1])[0]
  //   console.log('vaultId:'+vaultId)
  //   console.log("vaultsLength:"+ await xStore.vaultsLength())

  //   assert.equal(await xStore.is1155(vaultId), fund.is1155);

  //   const xToken = await XToken.at(await xStore.xTokenAddress(vaultId))
  //   console.log("xToken===>" + xToken.address + '-----' + await xToken.name() + '-----' + await xToken.symbol())
  //   assert.equal(await xToken.owner(), nftX.address);

  //   // TODO 设置范围等操作setIsEligible、setNegateEligibility、setRange   固化后创建者就不可修改了
  //           // 若全部nft都可以，无需特别设置，默认创建时setNegateEligibility(true) + 不设置setIsEligible
  //           // 若需要设置制定id，通过setNegateEligibility(false)+设置setIsEligible 或 设置setRange
  //           // 取反即setNegateEligibility(true)+设置setIsEligible  ====》见isEligible()的代码实现
  //   // await nftx.setIsEligible(vaultId, nftIds, true); 
  //   // assert.equal(await nftX.isEligible(vaultId, 400), true);
  //   // await nftX.setNegateEligibility(vaultId, false);
  //   // await nftX.setRange(vaultId, 0, 300);
  //   // const range = await xStore.range(vaultId);
  //   // console.log("range:",range[0],range[1])
  //   // assert.equal(await nftX.isEligible(vaultId, 300), true);
  //   // assert.equal(await nftX.isEligible(vaultId, 400), false);
  //   // await nftX.setRange(vaultId, 0, 400);
  //   // assert.equal(await nftX.isEligible(vaultId, 400), true);
  //   // const range2 = await xStore.range(vaultId);
  //   // console.log("range2:",range2[0],range2[1])

  //   // 固化  不固化也可以mint和redeem，固化后onlyPrivileged相关操作(如上面的setIsEligible、setNegateEligibility、setRange等)创建者就没有权限了
  //   await nftX.finalizeVault(vaultId);
  //   assert.equal(await xStore.isFinalized(vaultId), true);

  //   //------------------------------------------铸NFT、mint、redeem----------------------------------------------------
  //   const tokenId = 100
  //   // 铸NFT并且授权
  //   if(fund.is1155) {
  //     await nft.safeMint(accounts[0], tokenId)
  //     assert.equal(await nft.balanceOf(accounts[0], tokenId), 1)

  //     await nft.setApprovalForAll(nftX.address, true)
  //     assert.equal(await nft.isApprovedForAll(accounts[0], nftX.address), true)
  //   } else {
  //     await nft.safeMint(accounts[0], tokenId)
  //     assert.equal(await nft.ownerOf(tokenId), accounts[0])

  //     await nft.approve(nftX.address, tokenId)
  //     assert.equal(await nft.getApproved(tokenId), nftX.address)
  //   }

  //   // // NFT转ERC20
  //   await nftX.mint(vaultId, [tokenId])
  //   assert.equal(await xToken.balanceOf(accounts[0])/1e18, 10000)
  //   assert.equal(await xToken.totalSupply()/1e18, 10000)
  //   if(fund.is1155) {
  //     assert.equal(await nft.balanceOf(nftX.address, tokenId), 1)
  //   } else{
  //     assert.equal(await nft.ownerOf(tokenId), nftX.address)
  //   }
  //   console.log('NFT mint ERC20成功')

  //   // // // ERC20转NFT
  //   await xToken.approve(nftX.address, web3.utils.toWei("1000000", 'ether'))
  //   assert.equal(await xToken.allowance(accounts[0], nftX.address)/1e18, 1000000)

  //   await nftX.redeem(vaultId, 1)
  //   assert.equal(await xToken.balanceOf(accounts[0])/1e18, 0)
  //   assert.equal(await xToken.totalSupply()/1e18, 0)
  //   if(fund.is1155) {
  //     assert.equal(await nft.balanceOf(accounts[0], tokenId), 1)
  //   } else{
  //     assert.equal(await nft.ownerOf(tokenId), accounts[0])
  //   }
  //   console.log('ERC20 redeem NFT成功\n\n')



  //   // // 铸20个nft用于测试  nft===>0x61eD57b11e094F656cf44e471E65a8eD6F7DB565-----PUNK-BASIC-----Punk-Basic
  //   for (let x = 0; x < 10; x++) {
  //     await nft.safeMint(accounts[0], x)
  //     assert.equal(await nft.ownerOf(x), accounts[0])
  //   }
  //   for (let x = 10; x < 20; x++) {
  //     await nft.safeMint(accounts[1], x)
  //     assert.equal(await nft.ownerOf(x), accounts[1])
  //   }

  // }
};
