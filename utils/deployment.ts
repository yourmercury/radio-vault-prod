import { ethers } from "ethers"
import NFT from "../backend_/artifacts/contracts/NFT.sol/NFT.json";
import { Provider } from "react";

    //@ts-ignore

export async function createNFTCollection(name, symbol, maxSupply, baseUri, mintPrice) {
        //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // The factory we use for deploying contracts
    const factory = new ethers.ContractFactory(NFT.abi, NFT.bytecode, signer)


    // Deploy an instance of the contract
    const contract = await factory.deploy(name, symbol, maxSupply, baseUri, mintPrice)

    return contract.address
}


export async function connectToMetamask() {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()

    return {provider, signer};

}



export async function changeNetwork(id: number){
    try {
        // BEFORE - window.ethereum
        // await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${CHAIN_ID_REQUIRED.toString(16)}` }], })
        
        // AFTER = ethers.js
        //@ts-ignore
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${id.toString(16)}` }]);
        // And you will have to get the current provider again
        //@ts-ignore
        provider = new ethers.providers.Web3Provider(window.ethereum);

        return provider;
      } catch (error) {
          throw(error);
      }
}