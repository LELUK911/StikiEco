const mockUsdc  = artifacts.require("mockUsdc");
const stikiToken  = artifacts.require("stikiToken");
const NewStikiNFT  = artifacts.require("NewStikiNFT");
const MintContract  = artifacts.require("MintContract");
const Turnament  = artifacts.require("Turnament");
const MarketplaceStiki = artifacts.require("MarketplaceStiki");





module.exports = async function (deployer){
  await deployer.deploy(mockUsdc,1000000000);
  await deployer.deploy(stikiToken);
  const stiki = await  stikiToken.deployed();
  const usdc = await  mockUsdc.deployed();
  await deployer.deploy(MintContract,usdc.address,stiki.address,10);
  const contMinter = await  MintContract.deployed();
  await deployer.deploy(NewStikiNFT,contMinter.address);
  const newstiki = await  NewStikiNFT.deployed();
  await deployer.deploy(Turnament,newstiki.address);
  await contMinter.setAddrStikiNft(newstiki.address)
  await deployer.deploy(MarketplaceStiki,newstiki.address);
}
