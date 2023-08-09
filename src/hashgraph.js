import { HashConnect } from "hashconnect";
import { 
    Client,
    AccountAllowanceApproveTransaction,
    AccountId, 
    PrivateKey, 
    ContractCreateFlow, 
    ContractExecuteTransaction, 
    ContractFunctionParameters, 
    ContractId,
    ContractInfoQuery, 
    TokenAssociateTransaction,
    AccountInfoQuery,
    TransferTransaction,
    TokenId
  } from '@hashgraph/sdk';

const hashconnect = new HashConnect();

const contractId = ContractId.fromString("0.0.465656");

let saveData = {
    topic: "",
    pairingString: "",
    encryptionKey: "",
    savedPairings: []
}
const appMetaData = {
    name: "SAUCEINU Coinflip",
    description: "A HBAR wallet",
    icon: "https://wallet.hashpack.app/assets/favicon/favicon.ico",
    url: "http://localhost:3000"
}

hashconnect.pairingEvent.once(pairingData => {
    pairingData.accountIds.forEach(id => {
        if(saveData.savedPairings.indexOf(id) === -1) 
            saveData.savedPairings.push(id);
    })
})

export const pairClient = async () => {
    let initData = await hashconnect.init(appMetaData, "testnet", false);
    console.log(initData, "initData");
    saveData = initData;    
    if(saveData.savedPairings.length == 0) {
        connectWallet();
    }
    return saveData
}

export const connectWallet = () => {
    hashconnect.connectToLocalWallet(saveData.pairingString);
}

export const flipHBar = async (selectedAmount, selectedOption) => {
    if(saveData.savedPairings.length==0) return;
    let provider = hashconnect.getProvider("testnet", saveData.topic, saveData.savedPairings[0]);
    let signer = hashconnect.getSigner(provider);
    const flipTx = await new ContractExecuteTransaction()
                    .setContractId(contractId)
                    .setGas(100000)
                    .setPayableAmount(selectedAmount)
                    .setFunction("flipForHBar", 
                      new ContractFunctionParameters()
                      .addBool(selectedOption)
                      .addUint256(0))
                    .freezeWithSigner(signer);
    await flipTx.executeWithSigner(signer)

}