import { HashConnect } from "hashconnect";
import axios from "axios";
import { 
    AccountAllowanceApproveTransaction,
    AccountId, 
    ContractExecuteTransaction, 
    ContractFunctionParameters, 
    ContractId,
    TokenId
} from '@hashgraph/sdk';
import coindata from "./constants"

const hashconnect = new HashConnect(true);
const contractId = ContractId.fromString("0.0.470033");
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

const apiBaseUrl = "https://testnet.mirrornode.hedera.com/api/v1/";



export const pairClient = async () => {
    console.log(saveData);
    hashconnect.pairingEvent.on(pairingData => {
        console.log(pairingData, "PPP")
        saveData.savedPairings.push(pairingData);
    })
    let initData = await hashconnect.init(appMetaData, "testnet", false);
    saveData = initData;
    if(initData.savedPairings.length === 0) {
        hashconnect.connectToLocalWallet();
    } else {
        console.log("already paired")
    }
    console.log("SAVED DATA", saveData)
    return saveData
}

export const getAllowance = async (tokenId, ownerId, spenderId) => {
    console.log(apiBaseUrl+"accounts/"+ownerId+"/allowances/tokens?limit=10&order=desc&spender.id="+spenderId+"&token.id="+tokenId);
    const { data } = await axios.get(apiBaseUrl+"accounts/"+ownerId+"/allowances/tokens?limit=10&order=desc&spender.id="+spenderId+"&token.id="+tokenId);
    console.log(data);
    if(data&&data.allowances &&data.allowances.length>0) return data.allowances[0].amount_granted;
    else return 0;
}

export const flipToken = async (tokenIndex, amountIndex, option) => {
    const amount = coindata[tokenIndex].amounts[amountIndex];
    let provider = hashconnect.getProvider("testnet", saveData.topic, saveData.savedPairings[0].accountIds[0]);
    let signer = hashconnect.getSigner(provider);
    const beforeBal = (await provider.getAccountBalance(signer.getAccountId())).tokens.get(coindata[tokenIndex].address);
    console.log(beforeBal, "beforeBal")
    const totalAmount = amount*1.05;
    let targetTokenId = TokenId.fromString(coindata[tokenIndex].address);
    const tokenAllowance = await getAllowance(targetTokenId.toString(), signer.getAccountId().toString(), contractId.toString());
    if(tokenAllowance<totalAmount) {
        const allowanceTx = new AccountAllowanceApproveTransaction()
            .approveTokenAllowance(targetTokenId, signer.getAccountId(), AccountId.fromString(contractId.toString()), 1000000000*10**7)
            .freezeWithSigner(signer);
        const allowanceSign = await (await allowanceTx).signWithSigner(signer);
        const allowanceSubmit = await allowanceSign.executeWithSigner(signer);
    }
        
    const flipTx = await new ContractExecuteTransaction()
                    .setContractId(contractId)
                    .setGas(100000)
                    .setFunction("flip", 
                      new ContractFunctionParameters()
                      .addBool(option)
                      .addUint256(tokenIndex)
                      .addUint256(amountIndex))
                    .freezeWithSigner(signer);
    await flipTx.executeWithSigner(signer)
    const afterBalBal = (await provider.getAccountBalance(signer.getAccountId())).tokens.get(coindata[tokenIndex].address);
    console.log(afterBalBal, "beforeBal");
    console.log(afterBalBal.compare(beforeBal), "beforeBal")
    return afterBalBal.compare(beforeBal) == 1;                 
}

export const flipHBar = async (selectedAmountIndex, selectedOption) => {
    let provider = hashconnect.getProvider("testnet", saveData.topic, saveData.savedPairings[0].accountIds[0]);
    let signer = hashconnect.getSigner(provider);
    const beforeBal = (await provider.getAccountBalance(signer.getAccountId())).hbars.toBigNumber();
    const amount = coindata[3].amounts[selectedAmountIndex];
    const totalAmount = amount*1.05;
    if(saveData.savedPairings.length==0) return;
    const flipTx = await new ContractExecuteTransaction()
                    .setContractId(contractId)
                    .setGas(100000)
                    .setPayableAmount(totalAmount)
                    .setFunction("flipForHBar", 
                      new ContractFunctionParameters()
                      .addBool(selectedOption)
                      .addUint256(selectedAmountIndex))
                    .freezeWithSigner(signer);
    await flipTx.executeWithSigner(signer)
    const afterBal = (await provider.getAccountBalance(signer.getAccountId())).hbars.toBigNumber();
    return afterBal.comparedTo(beforeBal) == 1;
}

export const setAdminWallet = async () => {
    let provider = hashconnect.getProvider("testnet", saveData.topic, saveData.savedPairings[0].accountIds[0]);
    let signer = hashconnect.getSigner(provider);
    const flipTx = await new ContractExecuteTransaction()
                    .setContractId(contractId)
                    .setGas(100000)
                    .setFunction("takeToken", 
                      new ContractFunctionParameters()
                      .addUint256(0))
                    .freezeWithSigner(signer);
    await flipTx.executeWithSigner(signer)
}

export const disconnect = () => {
    hashconnect.disconnect(saveData.topic);
}