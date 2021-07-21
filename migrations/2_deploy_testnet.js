const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { ethers, upgrades } = require("@nomiclabs/buidler");
const { assert } = require('chai');
const abi = require('ethereumjs-abi');

const XTokenClonable = artifacts.require("XTokenClonable")
const XTokenFactory = artifacts.require("XTokenFactory");
const NFTXFundProxy = artifacts.require("NFTXFundProxy");
const ProxyController = artifacts.require("ProxyController");
const NFTXv11 = artifacts.require("NFTXv11");
const NFTXv10 = artifacts.require("NFTXv10")
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
  
  // // TODO 每次使用新的xtokenFactory都需要修改v6的代码
  // //xtokenFactory testnet: 0x72c4F1871B4A27076f23Afc022Fe0043353A8106
  // const xtokenFactory = await XTokenFactory.at('0x72c4F1871B4A27076f23Afc022Fe0043353A8106')

  // // // // 部署xStore
  // await deployer.deploy(XStore)
  // const xStore = await XStore.deployed()
  // console.log("xStore:"+ xStore.address)
  // // console.log("xStore owner:" +  await xStore.owner())
  // assert.equal(await xStore.owner(), accounts[0]);

  // // // // 部署nftXv10
  // await deployer.deploy(NFTXv10)
  // const nftXv10 = await NFTXv10.deployed()
  // console.log("nftXv10:"+ nftXv10.address)

  // // // abi.encodeWithSignature("initialize(address)", 0xb85d36E149C6a9Eb004Bf3067c134B1cC789DFF1) = 0xc4d66de8000000000000000000000000b85d36e149c6a9eb004bf3067c134b1cc789dff1
  // const delegatecallData = '0xc4d66de8000000000000000000000000' + xStore.address.substring(2).toLowerCase()
  // // console.log(delegatecallData)
  // // 部署 proxy
  // await deployer.deploy(NFTXFundProxy, nftXv10.address, accounts[0], delegatecallData)
  // const proxy = await NFTXFundProxy.deployed()
  // console.log("NFTXFundProxy:"+ proxy.address)

  // // 部署 proxyController
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

  // const nftX = await NFTXv10.at(proxy.address)
  // // console.log("nftX owner:" + await nftX.owner({from:accounts[0]})) 
  // // console.log("nftX store:" + await nftX.store({from:accounts[0]}))
  // assert.equal(await nftX.owner({from:accounts[0]}), accounts[0]);
  // assert.equal( await nftX.store({from:accounts[0]}), xStore.address);

  // // 升级到v11
  // await proxyController.fetchImplAddress()
  // let currentImpl = await proxyController.implAddress()
  // console.log("current implemention:" +  currentImpl + "--------" + (currentImpl == NFTXv10.address))
  // await deployer.deploy(NFTXv11)
  // const nftXv11 = await NFTXv11.deployed()
  // console.log("nftXv11:"+ nftXv11.address)
  // await proxyController.upgradeProxyTo(nftXv11.address)
  // await proxyController.fetchImplAddress()
  // currentImpl = await proxyController.implAddress()
  // console.log("current implemention:" + currentImpl + '---------' + (currentImpl == nftXv11.address))

  // // // 查看升级后参数不变
  // // console.log("nftX owner:" + await nftX.owner({from:accounts[0]})) 
  // // console.log("nftX store:" + await nftX.store({from:accounts[0]}))
  // assert.equal(await nftX.owner({from:accounts[0]}), accounts[0])
  // assert.equal( await nftX.store({from:accounts[0]}), xStore.address)






  // ------------------------NFT20化过程(NFT MINT ERC20、ERC20 REDEEM NFT)-------------------------------------------------------------------------------------------------------------
  // // NFTXFundProxy testnet: 0xc31aF058f9150adD8F23bF68c79F7ECf18dC7Eb3
  const nftX = await NFTXv11.at('0xc31aF058f9150adD8F23bF68c79F7ECf18dC7Eb3')
  const xStore = await XStore.at(await nftX.store())
  console.log("xstore="+xStore.address)

  const funds = [
    // {
    //   name: "PUNK-BASIC",
    //   symbol: "Punk-Basic",
    //   is1155: false,
    //   // negateElig: true,
    // },
    // {
    //   name: "HASH-MASKS",
    //   symbol: "HASH-MASKS",
    //   is1155: false,
    // },
    // {
    //   name: "NFT-1155",
    //   symbol: "NFT-1155",
    //   is1155: true,
    // }
  ]
  // // 创建NFT Vault
  for (let i = 0; i < funds.length; i++) {
    const fund = funds[i];

    console.log(i + ' is1155=' + fund.is1155)
    let nft
    if(fund.is1155) {
      nft = await ERC1155.new('1155 URI');
    } else {
      nft = await ERC721.new(fund.name, fund.symbol);
    }
    console.log("nft===>" + nft.address + '-----' + 
                  (fund.is1155 ? await nft.uri(1) : await nft.name() + '-----' + await nft.symbol()))
    funds[i].nftAddress = nft.address

    const tx = await nftX.createVault(fund.name+'-20', fund.symbol+'-20', nft.address, false)
    // console.log(tx);
    var eventNewVaultAdded= '0x' + abi.soliditySHA3(['string'], ["NewVault(uint256,address)"]).toString("hex");
    var log = tx.receipt.rawLogs.find(element => element.topics[0].match(eventNewVaultAdded));
    const vaultId = web3.eth.abi.decodeParameters(["uint256"],log.topics[1])[0]
    console.log('vaultId:'+vaultId)
    console.log("vaultsLength:"+ await xStore.vaultsLength())

    const xToken = await XToken.at(await xStore.xTokenAddress(vaultId))
    console.log("xToken===>" + xToken.address + '-----' + await xToken.name() + '-----' + await xToken.symbol())
    assert.equal(await xToken.owner(), nftX.address);

    if(fund.is1155) {
      await nftX.setIs1155(vaultId, true)
      assert.equal(await nftX.isVault1155(vaultId), true);
    }

    // TODO 设置范围等操作setIsEligible、setNegateEligibility、setRange、setAllowMintRequests     固化后创建者就不可修改了
            // 若全部nft都可以，无需特别设置，默认创建时setNegateEligibility(true) + 不设置setIsEligible
            // 若需要设置制定id，通过setNegateEligibility(false)+设置setIsEligible 或 设置setRange
            // 取反即setNegateEligibility(true)+设置setIsEligible  ====》见isEligible()的代码实现
    // await nftx.setIsEligible(vaultId, nftIds, true); 
  

    // 固化  不固化也可以mint和redeem，固化后onlyPrivileged相关操作(如上面的setIsEligible、setNegateEligibility、setRange、setAllowMintRequests等)创建者就没有权限了
    await nftX.finalizeVault(vaultId);
    assert.equal(await xStore.isFinalized(vaultId), true);


    // (testnet 0xc31aF058f9150adD8F23bF68c79F7ECf18dC7Eb3)nftx vaultId:0            xstore=0xd7586cA51Ac9c1008C3eC94f999A1208E2F3e1B2    nftXv11:0xDdC323Bcf535A982BF3F23Db6Ff8e7B8A7540dbb
      // nft===>0xAf901CaC6fFD4c9F87FE47f0c0B515405284CdcF-----PUNK-BASIC-----Punk-Basic   is1155=false
      // xToken===>0xa266615c411b183B739059aE859Db39Ea1239d9C-----PUNK-BASIC-20-----Punk-Basic-20
      // 0~9 nft归宿accounts[0]，10～19 nft归宿accounts[1] 
    // 铸20个nft用于测试
    for (let x = 0; x < 10; x++) {
      await nft.safeMint(accounts[0], x)
      assert.equal(await nft.ownerOf(x), accounts[0])
    }
    for (let x = 10; x < 20; x++) {
      await nft.safeMint(accounts[1], x)
      assert.equal(await nft.ownerOf(x), accounts[1])
    }
















//------------------------------------------铸NFT、mint、redeem----------------------------------------------------
    // const tokenId = 100
    // // 铸NFT并且授权
    // if(fund.is1155) {
    //   await nft.safeMint(accounts[0], tokenId)
    //   assert.equal(await nft.balanceOf(accounts[0], tokenId), 1)

    //   await nft.setApprovalForAll(nftX.address, true)
    //   assert.equal(await nft.isApprovedForAll(accounts[0], nftX.address), true)
    // } else {
    //   await nft.safeMint(accounts[0], tokenId)
    //   assert.equal(await nft.ownerOf(tokenId), accounts[0])

    //   await nft.approve(nftX.address, tokenId)
    //   assert.equal(await nft.getApproved(tokenId), nftX.address)
    // }

    // // NFT转ERC20
    // await nftX.mint(vaultId, [tokenId], 0)
    // assert.equal(await xToken.balanceOf(accounts[0])/1e18, 10000)
    // assert.equal(await xToken.totalSupply()/1e18, 10000)
    // if(fund.is1155) {
    //   assert.equal(await nft.balanceOf(nftX.address, tokenId), 1)
    // } else{
    //   assert.equal(await nft.ownerOf(tokenId), nftX.address)
    // }
    // console.log('NFT mint ERC20成功')

    // // // ERC20转NFT
    // await xToken.approve(nftX.address, web3.utils.toWei("1000000", 'ether'))
    // assert.equal(await xToken.allowance(accounts[0], nftX.address)/1e18, 1000000)

    // await nftX.redeem(vaultId, 1)
    // assert.equal(await xToken.balanceOf(accounts[0])/1e18, 0)
    // assert.equal(await xToken.totalSupply()/1e18, 0)
    // if(fund.is1155) {
    //   assert.equal(await nft.balanceOf(accounts[0], tokenId), 1)
    // } else{
    //   assert.equal(await nft.ownerOf(tokenId), accounts[0])
    // }
    // console.log('ERC20 redeem NFT成功\n\n')


  }


};
