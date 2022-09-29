const mockUsdc = artifacts.require("mockUsdc");
const stikiToken = artifacts.require("stikiToken");
const NewStikiNFT = artifacts.require("NewStikiNFT");
const MintContract = artifacts.require("MintContract");
const MarketplaceStiki = artifacts.require("MarketplaceStiki");

const Turnament = artifacts.require("Turnament");
const truffleAssert = require("truffle-assertions");


contract("Stiki Marketplace", accounts => {

    const account = accounts[0];
    const account2 = accounts[1];
    //console.log(account);

    it("Mint 1 nft", async () => {
        const stk = await stikiToken.deployed();
        const contMinter = await MintContract.deployed();
        const nft = await NewStikiNFT.deployed()
        const usdc = await mockUsdc.deployed();
        await contMinter.setAddrStikiNft(nft.address)

        await usdc.approve(contMinter.address, 1000);
        await contMinter.BuyStikiToken(account, 1000);

        await stk.approve(contMinter.address, 100);

        await contMinter.MintStiki("impostore", 11, 1, 1, 1, 1);

        const nft1 = await nft.viewStat(0);

    })
    it("deposit 3 nft in put Sell", async () => {
        const stk = await stikiToken.deployed();
        const contMinter = await MintContract.deployed();
        const nft = await NewStikiNFT.deployed()
        const usdc = await mockUsdc.deployed();
        const market = await MarketplaceStiki.deployed()
        await contMinter.setAddrStikiNft(nft.address)

        await usdc.approve(contMinter.address, 1000);
        await contMinter.BuyStikiToken(account, 1000);

        await stk.approve(contMinter.address, 300);
        await contMinter.MintStiki("venduto", 11, 1, 1, 1, 1);
        await contMinter.MintStiki("non venduto", 11, 1, 1, 1, 1);
        await contMinter.MintStiki("ritirato", 11, 1, 1, 1, 1);


        //MarketplaceStiki
        // deposito
        await nft.approve(market.address, 0);
        await nft.approve(market.address, 1);
        await nft.approve(market.address, 2);
        await market.putSell(0, (1000));
        await market.putSell(1, (2000));
        await market.putSell(2, (3000));


        let nft0 = await market.viewPuttSell(0);
        let nft1 = await market.viewPuttSell(1);
        let nft2 = await market.viewPuttSell(2);

        //console.log(nft0)
        //console.log(nft1)
        //console.log(nft2)


    })
    it("Fill offer sel NFT", async () => {
        const contMinter = await MintContract.deployed();
        const nft = await NewStikiNFT.deployed()
        const market = await MarketplaceStiki.deployed()
        await contMinter.setAddrStikiNft(nft.address)

        let nft0 = await market.viewPuttSell(0);
        let nft1 = await market.viewPuttSell(1);
        let nft2 = await market.viewPuttSell(2);

        //console.log(nft0)
        //console.log(nft1)
        //console.log(nft2)
        // fill offer sell
        await market.fillPutSell(0, { from: account2, value: 1000 })
        nft0 = await market.viewPuttSell(0);

    })
    it("widrowl ETH", async () => {
        const market = await MarketplaceStiki.deployed()

        let bal = await market.viewBalance(account)
        //console.log(bal.toString())
        await market.widrowProfitSell();
    })
    it("Ower nft buy", async () => {
        const nft = await NewStikiNFT.deployed()

        let ownerNft = await nft.ownerOf(0)
        //console.log(account2)
        //console.log(ownerNft)
    })
    it("Set 3 offerBuyr", async () => {
        const market = await MarketplaceStiki.deployed()
        const nft = await NewStikiNFT.deployed()
        await nft.ownerOf(3);
        await market.putBuyOffer(10000, 3, { from: account2, value: 10000 });
        await market.putBuyOffer(20000, 3, { from: account2, value: 20000 });
        await market.putBuyOffer(30000, 3, { from: account2, value: 30000 });

        let listOffer = await market.viewBuyOfferForToken(3);
        console.log(listOffer);
    })
    it("Sell with fill Buyer offer", async () => {
        const market = await MarketplaceStiki.deployed()
        const nft = await NewStikiNFT.deployed()

        await nft.approve(market.address, 3);
        await market.fillBuyerOffer(3, 2)

        listOffer = await market.viewBuyOfferForToken(3);
        //console.log(listOffer);
    })
    it("Parts widrowl Eth and Nft", async () => {
        const market = await MarketplaceStiki.deployed()
        const nft = await NewStikiNFT.deployed()

        await market.widrowlNftBuy(3, { from: account2 });
        let newOwner = await nft.ownerOf(3);
        console.log(newOwner, account2)


        await market.widrowProfitSell()


    })
    it("deactive one offer Buy", async () => {
        const market = await MarketplaceStiki.deployed()
            ;
        await market.deactiveBuyOffer(3, 1, { from: account2 })

        listOffer = await market.viewBuyOfferForToken(3);
        console.log(listOffer);
    })
    it("deactive one offer Buy already deactive", async () => {
        const market = await MarketplaceStiki.deployed();

        await truffleAssert.reverts(
            market.deactiveBuyOffer(3, 1, { from: account2 })
        )

        listOffer = await market.viewBuyOfferForToken(3);
        console.log(listOffer);
    })
    it("Sell with fill Buyer offer deactive", async () => {
        const market = await MarketplaceStiki.deployed()
        const stk = await stikiToken.deployed();
        const contMinter = await MintContract.deployed();
        const nft = await NewStikiNFT.deployed()
        const usdc = await mockUsdc.deployed();
        await contMinter.setAddrStikiNft(nft.address)

        await usdc.approve(contMinter.address, 1000);
        await contMinter.BuyStikiToken(account, 1000);

        await stk.approve(contMinter.address, 100);

        await contMinter.MintStiki("impostore", 11, 1, 1, 1, 1);
        await market.putBuyOffer(10000, 4, { from: account2, value: 10000 });


        await nft.approve(market.address, 4);

        await market.deactiveBuyOffer(4, 0, { from: account2 })
        await truffleAssert.reverts(
            market.fillBuyerOffer(4, 0)
        )
    })
    it("delete offer Buy", async () => {
        const market = await MarketplaceStiki.deployed();


        await market.deletOfferBuyer(3, 1, { from: account2 });


        listOffer = await market.viewBuyOfferForToken(3);
        console.log(listOffer);
    })



    //await truffleAssert.reverts





})






