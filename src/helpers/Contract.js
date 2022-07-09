import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

export const GetContract = (contractAddress, abi) => {
    const { library } = useWeb3React();

    let contract;

    try {
        const provider = new ethers.providers.Web3Provider(library.provider);
        const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
        contract = null;
    }
    return contract;
};
