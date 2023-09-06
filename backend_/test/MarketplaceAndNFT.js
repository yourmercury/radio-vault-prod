const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

async function deploy(){
    const accounts = await ethers.getSigners();
    const [owner, acc1, acc2, acc3, acc4, acc5 ] = accounts;

    //Deploy NFT
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy("Songs to Radio", "STR", 20, "baseuri/", ethers.utils.parseEther("1"));

    //Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(owner.address, [acc1.address, acc2.address, acc3.address]);

    // await (await nft.connect(acc5).setApprovalForAll(marketplace.address, true)).wait();

    return {owner, acc1, acc2, acc3, acc4, acc5, marketplace, nft}
}

describe("Marketplace Test", ()=>{
    it("Testing deployment", async()=>{
        await loadFixture(deploy);
    });

    it("Testing Features", async()=>{
        const {marketplace, nft, acc5, acc4, acc3, owner} = await loadFixture(deploy);

        describe("Listing", ()=>{
            it("'listItem'", async ()=>{
                await (await nft.connect(acc5).setApprovalForAll(marketplace.address, true)).wait();
                await (await nft.connect(owner).safeMint(acc5.address)).wait();

                await (await marketplace.connect(acc5).listItem(nft.address, 1, ethers.utils.parseEther("1"))).wait();


                expect(await nft.ownerOf(1)).to.equal(marketplace.address);
                expect(await marketplace.itemCount()).to.equal(BigNumber.from(1));
                expect((await marketplace.items(1)).listed).to.equal(true);
                expect((await marketplace.items(1)).seller).to.equal(acc5.address);
            });

            it("'getUserItems'", async ()=>{
                await (await nft.connect(owner).safeMint(acc4.address)).wait();
                await (await nft.connect(acc4).setApprovalForAll(marketplace.address, true)).wait();

                await (await marketplace.connect(acc4).listItem(nft.address, 2, ethers.utils.parseEther("1"))).wait();

                let items = await marketplace.getUserItems(acc5.address)
                expect(items[0].seller).to.equal(acc5.address);
            })

            it("'getUnsoldItems'", async ()=>{
                let items = await marketplace.getUnsoldItems()
                expect(items.length).to.equal(2);
            })            

            it("'unListItem'", async ()=> {
                await (await marketplace.connect(acc5).unListItem(1)).wait()
                expect(await nft.ownerOf(1)).to.equal(acc5.address);
                expect(await marketplace.itemCount()).to.equal(BigNumber.from(2));
                expect((await marketplace.items(1)).listed).to.equal(false);
                expect((await marketplace.items(1)).seller).to.equal(acc5.address);
            });

            it("'purchaseItem'", async()=>{
                await (await marketplace.connect(acc5).listItem(nft.address, 1, ethers.utils.parseEther("1"))).wait();

                await (await marketplace.connect(acc4).purchaseItem(3, {value: ethers.utils.parseEther("1.05")})).wait()
                expect(await nft.ownerOf(1), "not owner").to.equal(acc4.address);
                expect((await marketplace.items(3)).listed).to.equal(false);
                expect((await marketplace.items(3)).seller, "not seller").to.equal(acc5.address, "not seller");
                expect((await marketplace.items(3)).buyer, "not buyer").to.equal(acc4.address, "not buyer");
                expect(await marketplace.itemSold()).to.equal(1);
                expect(await marketplace.itemCount()).to.equal(3);
            });

            it("'placeBid'", async ()=>{
                await (await marketplace.connect(acc3).placeBid(2, {value: ethers.utils.parseEther("0.6")})).wait();

                expect((await marketplace.items(2)).bid).to.equal(ethers.utils.parseEther("0.6"));
                expect((await marketplace.getBalance())).to.equal(ethers.utils.parseEther("0.6"));
            })

            it("'honorBid'", async ()=>{
                await (await marketplace.connect(acc4).honorBid(2)).wait();
                
                expect((await marketplace.items(2)).buyer, "not buyer").to.equal(acc3.address, "not buyer");
                expect((await marketplace.items(2)).listed, "not buyer").to.equal(false, "Still listed after bid was honored");
            })
        })


        describe("Test NFT", ()=>{
            it("publicMint", async()=>{
                await (await nft.connect(acc4).publicMint({value: ethers.utils.parseEther("1")})).wait();
                let lastId = await nft.nonce();
                expect(await nft.ownerOf(lastId)).to.equal(acc4.address, "token did not go to minter");
            });

            it("publicMintBalance", async()=>{
                let balance = await nft.getPublicMintBalance();
                expect(balance).to.equal(ethers.utils.parseEther("1"));
            });

            it("withdraw", async()=>{
                let balance = await owner.getBalance();
                await (await nft.withdraw()).wait();
                let _balance = await owner.getBalance();
                let balance_ = await nft.getPublicMintBalance();
                expect(_balance).to.greaterThan(balance);
                expect(balance_).to.equal(ethers.utils.parseEther("0"));
                
            });

            it("tokenUri", async ()=>{
                let uri = await nft.tokenURI(3);
                expect(uri).to.equal("baseuri/3");
            })
        })
    })

    
})

