const { expect, assert, waffle } = require("chai");
const { ethers } = require("hardhat");
describe("Yumi", function () {
    let Yumi;

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        Yumi = await ethers.getContractFactory("Yumi");
        YumiContract = await Yumi.deploy(
            "https://ipfs.io/ipfs/QmcTEpUn8Vb4Le11PyomhFLBCkn8Gw1Ns4k8EqKRUyLy2G/"
        );
        await YumiContract.deployed();
        console.log("success");
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            console.log("Owner Address:", owner.address);
            // console.log("BaseTokenURI:",await YumiContract.baseTokenURI());
            expect(await YumiContract.owner()).to.equal(owner.address);
        });
    });

    describe("Contract Name and Symbol check", function () {
        it("should return YumiNFT as contract name", async function () {
            const name = await YumiContract.name();
            assert.equal(name, "Yumi");
        });

        it("should return Yumi as contract symbol", async function () {
            const symbol = await YumiContract.symbol();

            assert.equal(symbol, "YUMI");
        });
    });

    describe("Mint Function Check", function () {
        const tokenAmount = 2;
        it("Should mint success", async function () {
            await YumiContract.setPaused(false);

            it("should return YumiNFT as contract name", async function () {
                const name = await YumiContract.name();
                assert.equal(name, "yumi");
            });
            const nftPrice = await YumiContract.cost();
            const correctPrice = nftPrice * tokenAmount;
            // console.log("current nft price:-------",await YumiContract.cost()*tokenAmount);
            //   const price = await YumiContract.getMintPrice(tokenAmount);
            //   console.log("mint->price:", price.toString());
            await YumiContract.connect(addr1).mint(tokenAmount, {
                value: correctPrice.toString()
            });
            // const bnTokens = await YumiContract.walletOfOwner(addr1.address);
            // var tokens = [];
            // bnTokens.forEach((bn) => tokens.push(bn.toNumber()));
            // var tokens = [];
            // bnTokens.forEach((bn) => tokens.push(bn.toNumber()));
            const totalSupply = await YumiContract.totalSupply();
            console.log("totalSupply typeof", typeof (totalSupply), totalSupply);
            assert.deepEqual(totalSupply.toNumber(), tokenAmount + 1);
        });
    });
    // describe("WithdrawAll function check", function () {
    //   // it("should work well", async function (){

    //   //   await YumiContract.connect(owner).withdrawAll();
    //   // })
    //   it("should fail with non-owner account", async function () {
    //     await expect(YumiContract.connect(addr1).withdrawAll()).to.be
    //       .reverted;
    //   });
    // });
    // describe("TokenURI function check", function () {
    //   it("should return .json style", async function () {
    //     await YumiContract.setPause(false);
    //     const price = await YumiContract.getMintPrice(2);
    //     console.log("mint->price:", price.toString());
    //     await YumiContract.mint(2, { value: price.toString() });
    //     await YumiContract.setMetaReveal(true, 1, 5555);

    //     const uri = await YumiContract.tokenURI(1);
    //     console.log("return TokenURI", uri);
    //     expect(uri).to.equal(
    //       "https://ipfs.io/ipfs/QmcTEpUn8Vb4Le11PyomhFLBCkn8Gw1Ns4k8EqKRUyLy2G/1.json"
    //     );
    //   });
    // });
});
