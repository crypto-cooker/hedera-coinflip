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
    console.log(pairingData, "PPP")
    pairingData.accountIds.forEach(id => {
        if(saveData.savedPairings.indexOf(id) === -1) 
            saveData.savedPairings.push(id);
    })
})

export const pairClient = async () => {
    if(saveData.savedPairings.length==0) {
        let initData = await hashconnect.init(appMetaData, "testnet", false);
        console.log(initData, "III")
        let state = await hashconnect.connect();
        saveData.topic = state.topic;
        saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false);
        hashconnect.findLocalWallets();
    } else {
        console.log("already paired")
    }
    return saveData
}

export const flipHBar = async (selectedAmount, selectedOption) => {
    if(saveData.savedPairings.length==0) return;
    let provider = hashconnect.getProvider("testnet", saveData.topic, "0.0.451770");
    let signer = hashconnect.getSigner(provider);
    console.log(provider, "Provider");
    console.log(signer, "signer");
    const flipTx = await new ContractExecuteTransaction()
                    .setContractId(contractId)
                    .setGas(100000)
                    .setPayableAmount(selectedAmount)
                    .setFunction("flipForHBar", 
                      new ContractFunctionParameters()
                      .addBool(selectedOption)
                      .addUint256(0))
                    .freezeWithSigner(signer);
    console.log(flipTx, "flipTx");
    await flipTx.executeWithSigner(signer)
}

export const disconnect = () => {
    hashconnect.disconnect(saveData.topic);
}